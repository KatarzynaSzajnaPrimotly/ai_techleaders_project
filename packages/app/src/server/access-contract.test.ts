import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";

const appRoot = join(process.cwd(), "packages/app/src/app");

interface AccessDeclaration {
  kind: "public" | "authenticated" | "roles" | "missing";
  roles: string[];
}

interface AccessUse {
  api: "apiHandler" | "makeCrudRoute" | "guardedPage" | "publicPage";
  declaration: AccessDeclaration;
}

interface SourceFile {
  path: string;
  text: string;
}

interface Exception {
  path: string;
  recordedOn: string;
  until: string;
  reason: string;
  expected: AccessDeclaration;
}

// E01-S03 removes these temporary public surfaces. Keep the date and owner visible
// so the contract cannot silently turn a known gap into a permanent exception.
const EXCEPTIONS: readonly Exception[] = [
  {
    path: "admin/mentors/page.tsx",
    recordedOn: "2026-10-27",
    until: "E01-S03",
    reason: "The admin page remains public until operator sign-in and page guards ship.",
    expected: { kind: "missing", roles: [] },
  },
  {
    path: "api/mentors/route.ts",
    recordedOn: "2026-10-27",
    until: "E01-S03",
    reason: "The mentor CRUD API remains public until operator sign-in and API guards ship.",
    expected: { kind: "public", roles: [] },
  },
];

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() && (entry.name === "route.ts" || entry.name === "page.tsx") ? [path] : [];
  });
}

function normalizedPath(path: string): string {
  return relative(appRoot, path).split(sep).join("/");
}

function accessDeclaration(node: ts.Expression | undefined): AccessDeclaration {
  if (!node || !ts.isObjectLiteralExpression(node)) return { kind: "missing", roles: [] };
  const access = node.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && property.name.text === "access",
  )?.initializer;
  if (!access) return { kind: "missing", roles: [] };
  if (ts.isStringLiteral(access) && (access.text === "public" || access.text === "authenticated")) {
    return { kind: access.text, roles: [] };
  }
  if (!ts.isObjectLiteralExpression(access)) return { kind: "missing", roles: [] };
  const rolesProperty = access.properties.find(
    (property): property is ts.PropertyAssignment =>
      ts.isPropertyAssignment(property) && ts.isIdentifier(property.name) && property.name.text === "roles",
  );
  if (!rolesProperty || !ts.isArrayLiteralExpression(rolesProperty.initializer)) {
    return { kind: "missing", roles: [] };
  }
  const roles = rolesProperty.initializer.elements.flatMap((role) =>
    ts.isStringLiteral(role) ? [role.text] : [],
  );
  return roles.length > 0 ? { kind: "roles", roles } : { kind: "missing", roles: [] };
}

function importAliases(
  source: ts.SourceFile,
): Map<string, "apiHandler" | "makeCrudRoute" | "guardedPage" | "publicPage"> {
  const aliases = new Map<string, "apiHandler" | "makeCrudRoute" | "guardedPage" | "publicPage">();
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !statement.importClause?.namedBindings) continue;
    const named = statement.importClause.namedBindings;
    if (!ts.isNamedImports(named)) continue;
    for (const element of named.elements) {
      const importedName = element.propertyName && ts.isIdentifier(element.propertyName)
        ? element.propertyName.text
        : element.name.text;
      if (importedName === "apiHandler") {
        aliases.set(element.name.text, "apiHandler");
      }
      if (importedName === "makeCrudRoute") {
        aliases.set(element.name.text, "makeCrudRoute");
      }
      if (importedName === "guardedPage") aliases.set(element.name.text, "guardedPage");
      if (importedName === "publicPage") aliases.set(element.name.text, "publicPage");
    }
  }
  // Local const aliases and thin wrappers are common ways to centralize route setup.
  // Resolve them iteratively so `const first = apiHandler; const second = first;` is covered.
  let changed = true;
  while (changed) {
    changed = false;
    for (const statement of source.statements) {
      if (!ts.isVariableStatement(statement)) continue;
      for (const declaration of statement.declarationList.declarations) {
        if (!ts.isIdentifier(declaration.name) || !declaration.initializer) continue;
        if (ts.isIdentifier(declaration.initializer)) {
          const target = aliases.get(declaration.initializer.text);
          if (target && aliases.get(declaration.name.text) !== target) {
            aliases.set(declaration.name.text, target);
            changed = true;
          }
        }
      }
    }
  }
  return aliases;
}

function accessUses(text: string, fileName: string): AccessUse[] {
  const scriptKind = fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const source = ts.createSourceFile(fileName, text, ts.ScriptTarget.Latest, true, scriptKind);
  const aliases = importAliases(source);
  const uses: AccessUse[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)) {
      const api = aliases.get(node.expression.text);
      if (api) {
        if (api === "publicPage") {
          uses.push({ api, declaration: { kind: "public", roles: [] } });
        } else {
          const optionsIndex = api === "apiHandler" ? 1 : 0;
          uses.push({ api, declaration: accessDeclaration(node.arguments[optionsIndex]) });
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return uses;
}

function requiredRoles(path: string): string[] | undefined {
  if (path.startsWith("admin/") || path.startsWith("api/operator/")) return ["operator"];
  if (path.startsWith("(mentor)/")) return ["mentor"];
  if (path.startsWith("(mentee)/")) return ["mentee"];
  return undefined;
}

function expectedFor(path: string): AccessDeclaration | undefined {
  const exception = EXCEPTIONS.find((entry) => entry.path === path);
  if (exception) return exception.expected;
  const roles = requiredRoles(path);
  return roles ? { kind: "roles", roles } : undefined;
}

function pageFailures(files: readonly SourceFile[]): string[] {
  const discovered = new Set(files.map((file) => file.path));
  const failures: string[] = [];
  for (const exception of EXCEPTIONS.filter((entry) => entry.path.endsWith("page.tsx"))) {
    if (!discovered.has(exception.path)) failures.push(`${exception.path}: declared exception was not discovered`);
  }
  for (const file of files) {
    if (!file.path.endsWith("page.tsx")) continue;
    const uses = accessUses(file.text, file.path).filter(
      ({ api }) => api === "guardedPage" || api === "publicPage",
    );
    const exception = EXCEPTIONS.find((entry) => entry.path === file.path);
    if (exception) {
      if (exception.expected.kind === "missing" && uses.length > 0) {
        failures.push(`${file.path}: expected the named temporary unguarded exception`);
      }
      if (!file.text.includes(exception.until)) failures.push(`${file.path}: missing ${exception.until} exception comment`);
      continue;
    }
    const roles = requiredRoles(file.path);
    if (!roles) continue;
    const expected = { kind: "roles" as const, roles };
    if (uses.length === 0) {
      failures.push(`${file.path}: protected page has no guardedPage or publicPage declaration`);
      continue;
    }
    if (uses.some(({ api }) => api !== "guardedPage")) {
      failures.push(`${file.path}: protected page must use guardedPage`);
      continue;
    }
    for (const use of uses) {
      if (use.declaration.kind !== expected.kind || JSON.stringify(use.declaration.roles) !== JSON.stringify(roles)) {
        failures.push(`${file.path}: expected guardedPage ${JSON.stringify(expected)}, got ${JSON.stringify(use.declaration)}`);
      }
    }
  }
  return failures;
}

function scanSource(text: string, fileName: string): AccessUse[] {
  return accessUses(text, fileName);
}

describe("access contract", () => {
  it("declares access for every API route and follows the protected path rule", () => {
    const routes = sourceFiles(appRoot).filter((path) => path.endsWith(`${sep}route.ts`));
    const failures: string[] = [];
    for (const path of routes) {
      const relativePath = normalizedPath(path);
      const text = readFileSync(path, "utf8");
      const uses = accessUses(text, path);
      const expected = expectedFor(relativePath);
      if (uses.length === 0) {
        failures.push(`${relativePath}: no apiHandler or makeCrudRoute access declaration`);
        continue;
      }
      for (const use of uses) {
        if (use.declaration.kind === "missing") {
          failures.push(`${relativePath}: ${use.api} has no literal access declaration`);
          continue;
        }
        if (expected && (use.declaration.kind !== expected.kind ||
          JSON.stringify(use.declaration.roles) !== JSON.stringify(expected.roles))) {
          failures.push(`${relativePath}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(use.declaration)}`);
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it("discovers the admin page exception and enforces guards on other admin pages", () => {
    const pages = sourceFiles(appRoot)
      .filter((path) => path.endsWith(`${sep}page.tsx`))
      .map((path) => ({ path: normalizedPath(path), text: readFileSync(path, "utf8") }));
    expect(pages.some(({ path }) => path === "admin/mentors/page.tsx")).toBe(true);
    expect(pageFailures(pages)).toEqual([]);

    const exceptionFixture = pages.find(({ path }) => path === "admin/mentors/page.tsx");
    expect(exceptionFixture).toBeDefined();
    expect(pageFailures([exceptionFixture!])).toEqual([]);

    expect(pageFailures([{ path: "admin/reports/page.tsx", text: "export default function Page() { return null; }" }]))
      .toContain("admin/reports/page.tsx: protected page has no guardedPage or publicPage declaration");
    const wrongRole = `import { guardedPage } from "@devmentor/core";\nexport default guardedPage({ path: "/admin/reports", access: { roles: ["mentor"] } }, () => null);`;
    expect(pageFailures([{ path: "admin/reports/page.tsx", text: wrongRole }])).toContain(
      'admin/reports/page.tsx: expected guardedPage {"kind":"roles","roles":["operator"]}, got {"kind":"roles","roles":["mentor"]}',
    );
  });

  it("keeps only the named, dated E01-S03 exceptions with source comments", () => {
    expect(EXCEPTIONS.map(({ path, recordedOn, until, reason }) => ({ path, recordedOn, until, reason }))).toEqual([
      {
        path: "admin/mentors/page.tsx",
        recordedOn: "2026-10-27",
        until: "E01-S03",
        reason: "The admin page remains public until operator sign-in and page guards ship.",
      },
      {
        path: "api/mentors/route.ts",
        recordedOn: "2026-10-27",
        until: "E01-S03",
        reason: "The mentor CRUD API remains public until operator sign-in and API guards ship.",
      },
    ]);
    for (const exception of EXCEPTIONS) {
      const text = readFileSync(join(appRoot, exception.path), "utf8");
      expect(text).toContain(exception.until);
    }
  });

  it("maps protected route paths to their required role", () => {
    expect(requiredRoles("admin/mentors/page.tsx")).toEqual(["operator"]);
    expect(requiredRoles("api/operator/reports/route.ts")).toEqual(["operator"]);
    expect(requiredRoles("(mentor)/home/page.tsx")).toEqual(["mentor"]);
    expect(requiredRoles("(mentee)/home/page.tsx")).toEqual(["mentee"]);
    expect(requiredRoles("api/mentors/route.ts")).toBeUndefined();
  });

  it("recognizes aliased APIs and local wrapper aliases", () => {
    const fixture = `
      import { apiHandler as wrapRoute, makeCrudRoute as crud } from "@devmentor/core";
      const alias = wrapRoute;
      export const GET = alias(async () => ({}), { access: "public" });
      export const route = crud({ access: { roles: ["operator"] }, list: async () => [] });
    `;
    expect(scanSource(fixture, "fixture.ts")).toEqual([
      { api: "apiHandler", declaration: { kind: "public", roles: [] } },
      { api: "makeCrudRoute", declaration: { kind: "roles", roles: ["operator"] } },
    ]);
  });

  it("recognizes nested wrapper calls and reports missing declarations", () => {
    const fixture = `
      import { apiHandler } from "@devmentor/core";
      const route = (handler: () => unknown) => apiHandler(handler, { access: "authenticated" });
      export const GET = route(() => ({}));
      export const POST = apiHandler(async () => ({}), {});
    `;
    expect(scanSource(fixture, "fixture.ts")).toEqual([
      { api: "apiHandler", declaration: { kind: "authenticated", roles: [] } },
      { api: "apiHandler", declaration: { kind: "missing", roles: [] } },
    ]);
  });

  it("parses guarded page access before JSX in TSX sources", () => {
    const fixture = `
      import { guardedPage } from "@devmentor/core";
      export default guardedPage({ path: "/admin/reports", access: { roles: ["operator"] } }, () => <main />);
    `;
    expect(scanSource(fixture, "admin/reports/page.tsx")).toEqual([
      { api: "guardedPage", declaration: { kind: "roles", roles: ["operator"] } },
    ]);
  });
});
