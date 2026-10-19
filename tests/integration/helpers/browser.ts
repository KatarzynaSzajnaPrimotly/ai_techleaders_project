import { execFileSync } from "node:child_process";
import path from "node:path";

const binary = path.resolve(import.meta.dirname, "../../../node_modules/.bin/agent-browser");

export function createBrowser(session = `devmentor-it-${process.pid}`) {
  const run = (...args: string[]) =>
    execFileSync(binary, args, {
      encoding: "utf8",
      timeout: 60_000,
      env: { ...process.env, AGENT_BROWSER_SESSION: session },
    }).trim();

  return {
    open: (url: string) => run("open", url),
    url: () => run("get", "url"),
    title: () => run("get", "title"),
    text: (selector: string) => run("get", "text", selector),
    click: (selector: string) => run("click", selector),
    fill: (selector: string, value: string) => run("fill", selector, value),
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
