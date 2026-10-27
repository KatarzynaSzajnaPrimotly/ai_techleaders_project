import { execFileSync } from "node:child_process";
import path from "node:path";

const binary = path.resolve(import.meta.dirname, "../../../node_modules/.bin/agent-browser");
const DEFAULT_BROWSER_SESSION = `devmentor-it-${process.pid}`;

function runBrowser(session: string, args: string[]): string {
  return execFileSync(binary, args, {
    encoding: "utf8",
    timeout: 60_000,
    env: { ...process.env, AGENT_BROWSER_SESSION: session },
  }).trim();
}

export function setCookie(
  name: string,
  value: string,
  pageUrl: string,
  session = DEFAULT_BROWSER_SESSION,
): void {
  runBrowser(session, ["cookies", "set", name, value, "--url", pageUrl, "--httpOnly", "--sameSite", "Lax"]);
}

export function createBrowser(session = DEFAULT_BROWSER_SESSION) {
  const run = (...args: string[]) => runBrowser(session, args);

  return {
    open: (url: string) => run("open", url),
    url: () => run("get", "url"),
    title: () => run("get", "title"),
    text: (selector: string) => run("get", "text", selector),
    click: (selector: string) => run("click", selector),
    fill: (selector: string, value: string) => run("fill", selector, value),
    setCookie: (name: string, value: string, pageUrl: string) => setCookie(name, value, pageUrl, session),
    waitForText: (text: string) => run("wait", "--text", text),
    waitForUrl: (glob: string) => run("wait", "--url", glob),
    snapshot: () => run("snapshot"),
    close: () => {
      try {
        run("close");
      } catch {
        // the session was never opened
      }
    },
  };
}
