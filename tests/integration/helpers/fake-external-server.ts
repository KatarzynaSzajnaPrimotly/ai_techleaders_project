import { createServer, type IncomingMessage, type Server, type ServerResponse } from "node:http";
import type { AddressInfo } from "node:net";

const MAX_BODY_BYTES = 1_048_576;
const FAKE_ACCESS_TOKEN = "devmentor-fake-github-access-token";

export interface FakeGithubUser {
  id: number;
  login: string;
  name: string | null;
  avatar_url: string | null;
}

export interface FakeGithubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: "public" | "private" | null;
}

export interface FakeGithubIdentity {
  user: FakeGithubUser;
  emails: FakeGithubEmail[];
}

export interface FakeExternalServer {
  url: string;
  close: () => Promise<void>;
}

function sendJson(response: ServerResponse, status: number, body: unknown): void {
  response.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(body));
}

async function readJson(request: IncomingMessage): Promise<unknown> {
  const chunks: Buffer[] = [];
  let bytes = 0;
  for await (const chunk of request) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    bytes += buffer.byteLength;
    if (bytes > MAX_BODY_BYTES) {
      request.resume();
      throw new RangeError("Request body is too large");
    }
    chunks.push(buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}

function isGithubIdentity(value: unknown): value is FakeGithubIdentity {
  if (typeof value !== "object" || value === null || !("user" in value) || !("emails" in value)) return false;
  const candidate = value as { user: unknown; emails: unknown };
  if (typeof candidate.user !== "object" || candidate.user === null || !Array.isArray(candidate.emails)) return false;
  const user = candidate.user as Partial<FakeGithubUser>;
  return typeof user.id === "number" && typeof user.login === "string" &&
    (typeof user.name === "string" || user.name === null) &&
    (typeof user.avatar_url === "string" || user.avatar_url === null) &&
    candidate.emails.every((email: unknown) => {
      if (typeof email !== "object" || email === null) return false;
      const item = email as Partial<FakeGithubEmail>;
      return typeof item.email === "string" && typeof item.primary === "boolean" &&
        typeof item.verified === "boolean" &&
        (item.visibility === "public" || item.visibility === "private" || item.visibility === null);
    });
}

async function handleRequest(
  request: IncomingMessage,
  response: ServerResponse,
  getIdentity: (code?: string) => FakeGithubIdentity | null,
  setIdentity: (identity: FakeGithubIdentity | null, code?: string) => void,
  setTokenIdentity: (token: string, identity: FakeGithubIdentity) => void,
  getIdentityForToken: (token: string) => FakeGithubIdentity | null,
): Promise<void> {
  const url = new URL(request.url ?? "/", "http://127.0.0.1");

  if (request.method === "POST" && url.pathname === "/__control/reset") {
    setIdentity(null);
    sendJson(response, 200, { ok: true });
    return;
  }

  if (request.method === "POST" && url.pathname === "/__control/github/identity") {
    try {
      const identity = await readJson(request);
      if (!isGithubIdentity(identity)) {
        sendJson(response, 400, { error: "Invalid fake GitHub identity" });
        return;
      }
      setIdentity(identity, url.searchParams.get("code") ?? undefined);
      sendJson(response, 200, { ok: true });
    } catch (error) {
      const status = error instanceof RangeError ? 413 : 400;
      sendJson(response, status, { error: status === 413 ? "Request body is too large" : "Invalid JSON body" });
    }
    return;
  }

  if (request.method === "POST" && url.pathname === "/login/oauth/access_token") {
    let code: string | undefined;
    try {
      const body = await readJson(request);
      if (typeof body === "object" && body !== null && "code" in body && typeof body.code === "string") {
        code = body.code;
      }
    } catch {
      sendJson(response, 400, { error: "Invalid OAuth request" });
      return;
    }
    const identity = getIdentity(code);
    if (!identity) {
      sendJson(response, 503, { error: "Fake GitHub identity is not configured" });
      return;
    }
    const accessToken = code ? `${FAKE_ACCESS_TOKEN}:${code}` : FAKE_ACCESS_TOKEN;
    setTokenIdentity(accessToken, identity);
    sendJson(response, 200, { access_token: accessToken, token_type: "bearer", scope: "user:email" });
    return;
  }

  const authorization = request.headers.authorization;
  const accessToken = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : "";
  const tokenIdentity = getIdentityForToken(accessToken);
  if (!getIdentity() && !tokenIdentity) {
    sendJson(response, 503, { error: "Fake GitHub identity is not configured" });
    return;
  }
  if (accessToken !== FAKE_ACCESS_TOKEN && !tokenIdentity) {
    sendJson(response, 401, { message: "Bad credentials" });
    return;
  }

  const identity = tokenIdentity ?? getIdentity();
  if (!identity) {
    sendJson(response, 503, { error: "Fake GitHub identity is not configured" });
    return;
  }

  if (request.method === "GET" && url.pathname === "/user") {
    sendJson(response, 200, identity.user);
    return;
  }
  if (request.method === "GET" && url.pathname === "/user/emails") {
    sendJson(response, 200, identity.emails);
    return;
  }
  sendJson(response, 404, { error: "Not found" });
}

export async function startFakeExternalServer(): Promise<FakeExternalServer> {
  let identity: FakeGithubIdentity | null = null;
  const codeIdentities = new Map<string, FakeGithubIdentity>();
  const tokenIdentities = new Map<string, FakeGithubIdentity>();
  const getIdentity = (code?: string) => code ? codeIdentities.get(code) ?? identity : identity;
  const setIdentity = (next: FakeGithubIdentity | null, code?: string) => {
    if (code) {
      if (next) codeIdentities.set(code, next);
      else codeIdentities.delete(code);
      return;
    }
    identity = next;
    if (!next) {
      codeIdentities.clear();
      tokenIdentities.clear();
    }
  };
  const setTokenIdentity = (token: string, next: FakeGithubIdentity) => tokenIdentities.set(token, next);
  const getIdentityForToken = (token: string) => tokenIdentities.get(token) ?? null;
  const server: Server = createServer((request, response) => {
    void handleRequest(request, response, getIdentity, setIdentity, setTokenIdentity, getIdentityForToken).catch((error: unknown) => {
      if (response.headersSent) {
        response.destroy(error instanceof Error ? error : undefined);
        return;
      }
      sendJson(response, 500, { error: "Fake external service failed" });
    });
  });

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${address.port}`,
    close: () => new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve())),
  };
}
