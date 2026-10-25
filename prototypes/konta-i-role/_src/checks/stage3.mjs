// Stage 3 browser check. Run from the repository root after building the prototype:
//   LD_LIBRARY_PATH=... AGENT_BROWSER_ARGS=--no-sandbox node prototypes/konta-i-role/_src/checks/stage3.mjs [log-name]
// Drives the built prototype over file:// in agent-browser: every state at 320 and 1440 px in the dark and light theme,
// the review-bar controls, every button on every screen, and a real Tab walk. Writes evidence/stage3/<log-name>.log.
import { execFileSync } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const proto = join(here, "..", "..");
const evidence = join(here, "..", "evidence", "stage3");
mkdirSync(evidence, { recursive: true });
const logFile = join(evidence, `${process.argv[2] ?? "dziennik"}.log`);
const only = process.argv[3]; // optional: run only a part, e.g. "keyboard"
writeFileSync(logFile, "");

const ab = (args, input) =>
  execFileSync("npx", ["agent-browser", ...args], { input, encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 120000 });
const evalJson = (js) => {
  const out = JSON.parse(ab(["eval", "--stdin", "--json"], js));
  if (!out.success) throw new Error(JSON.stringify(out.error));
  return out.data.result;
};
let pass = 0;
let fail = 0;
const log = (line) => { appendFileSync(logFile, line + "\n"); console.log(line); };
const check = (ok, name, detail = "") => { ok ? pass++ : fail++; log(`${ok ? "PASS" : "FAIL"} | ${name}${detail ? " | " + detail : ""}`); };

const lib = readFileSync(join(here, "page-lib.js"), "utf8");
const VIEWPORTS = [["1440", 1440, 900], ["320", 320, 700]];
const THEMES = ["dark", "light"];
const DEFAULT_STATES = new Set(["s01.1", "s02.1", "s03.1", "s04.1", "s05.1", "s06.1", "s07.1", "s09.1", "s10.1"]);

function openFresh(width, height, theme) {
  ab(["close", "--all"]);
  ab(["open", "file://" + join(proto, "index.html")]);
  ab(["set", "viewport", String(width), String(height)]);
  evalJson(lib);
  if (theme === "light") evalJson(`document.getElementById("theme-toggle").click(); document.documentElement.dataset.theme`);
  const now = evalJson(`document.documentElement.dataset.theme`);
  if (now !== theme) throw new Error(`theme is ${now}, wanted ${theme}`);
}

function states(tag) {
  const ids = evalJson(`__chk.states`);
  for (const id of ids) {
    const res = evalJson(`__chk.runState(${JSON.stringify(id)})`);
    check(res.problems.length === 0, `${tag} ${id}`, res.problems.slice(0, 4).join("; "));
    if (DEFAULT_STATES.has(id) || res.problems.length) ab(["screenshot", join(evidence, `${tag.replaceAll(" ", "-")}-${id}.png`)]);
  }
}

function reachability(tag) {
  const res = evalJson(`__chk.panelReach()`);
  check(res.problems.length === 0, `${tag} review-bar panel: ${res.controls} controls reachable`, res.problems.join("; "));
  ab(["screenshot", join(evidence, `${tag.replaceAll(" ", "-")}-panel.png`)]);
  evalJson(`document.querySelector(".review-help").open = false`);
}

function options(tag) {
  const plan = evalJson(`__chk.optionsPlan()`);
  let total = 0;
  for (const control of plan) {
    for (const value of control.values) {
      const row = evalJson(`__chk.optionRun(${control.i}, ${JSON.stringify(value)})`);
      total++;
      check(row.problems.length === 0, `${tag} ${row.control} = ${row.option}`, row.problems.join("; "));
    }
  }
  check(total > 40, `${tag} ${total} scenario options exercised`);
}

function buttons(tag) {
  const plan = evalJson(`__chk.plan`);
  for (let p = 0; p < plan.length; p++) {
    const count = evalJson(`__chk.clickCount(${p})`);
    for (let i = 0; i < count; i++) {
      const row = evalJson(`__chk.clickOne(${p}, ${i})`);
      check(row.effect !== "NOTHING" && row.js.length === 0, `${tag} ${row.screen} '${row.control}' ${row.effect}`, row.js.join("; "));
    }
  }
}

function toolbarButtons(tag, w, h) {
  openFresh(w, h, "dark");
  const count = evalJson(`__chk.toolbarCount()`);
  for (let i = 0; i < count; i++) {
    openFresh(w, h, "dark");
    evalJson(`__chk.toolbarCount()`);
    const row = evalJson(`__chk.toolbarOne(${i})`);
    check(row.effect !== "NOTHING" && row.js.length === 0, `${tag} review bar '${row.control}' ${row.effect}`, row.js.join("; "));
  }
}

const WALK = [["s01", null], ["s02", null], ["s03", "reg"], ["s04", "link"], ["s05", "A1"], ["s06", "A3"], ["s07", "A6"], ["s09", null], ["s10", "reg"]];

function keyboard(tag) {
  for (const [id, who] of WALK) {
    const expected = evalJson(`__chk.prepareKeyboard(${JSON.stringify(id)}, ${JSON.stringify(who)})`);
    const reached = [];
    for (let i = 0; i < expected.length + 2; i++) {
      ab(["press", "Tab"]);
      const info = evalJson(`__chk.focusInfo()`);
      if (!info || !info.inFrame) break;
      reached.push(info);
    }
    const labels = reached.map((r) => r.label);
    const noRing = reached.filter((r) => !r.ring).map((r) => r.label);
    const hidden = reached.filter((r) => !r.inView).map((r) => r.label);
    const sameOrder = expected.length === labels.length && expected.every((e, i) => labels[i].startsWith(String(e).slice(0, 40)) || String(e).startsWith(labels[i]));
    check(sameOrder, `${tag} ${id} Tab reaches ${expected.length} controls in order`, sameOrder ? "" : `expected ${JSON.stringify(expected)} got ${JSON.stringify(labels)}`);
    check(noRing.length === 0, `${tag} ${id} every focused control shows a focus ring`, noRing.join(", "));
    check(hidden.length === 0, `${tag} ${id} focus never lands out of view`, hidden.join(", "));
  }
  evalJson(`__chk.reset()`);
  evalJson(`__chk.toolbarFocus()`);
  const expected = evalJson(`__chk.toolbarExpected()`);
  const seen = [];
  for (let i = 0; i < expected.length + 1; i++) {
    ab(["press", "Tab"]);
    const info = evalJson(`__chk.focusInfo()`);
    if (!info || !info.inToolbar) break;
    seen.push(info);
  }
  check(seen.length === expected.length && seen.every((s) => s.ring), `${tag} review bar: Tab reaches ${expected.length} controls, all with a focus ring`, `got ${seen.map((s) => s.label).join(" | ")}`);
}

// Keyboard operation: Enter submits the sign-in form, Ctrl+Enter submits the operator form, Escape closes the panel.
function keyboardOperation() {
  evalJson(`__chk.reset()`);
  evalJson(`__chk.go("s01").then(() => { document.querySelector('#s01 [name=email]').focus(); return 1; })`);
  ab(["keyboard", "type", "ewa.lis@devmentor.test"]);
  ab(["press", "Tab"]);
  ab(["keyboard", "type", "wrong-password-1"]);
  ab(["press", "Enter"]);
  const sign = evalJson(`__chk.sleep(700).then(() => __chk.frameText().toLowerCase())`);
  check(sign.includes("invalid credentials"), "keyboard: Enter submits the sign-in form (wrong password -> generic error)");
  evalJson(`__chk.reset().then(() => __chk.account("A6"))`);
  evalJson(`document.querySelector('#s07 [name=name]').focus(); 1`);
  ab(["keyboard", "type", "Keyboard Mentor"]);
  ab(["press", "Tab"]);
  ab(["keyboard", "type", "keyboard.mentor@devmentor.test"]);
  ab(["press", "Control+Enter"]);
  const added = evalJson(`__chk.sleep(900).then(() => __chk.frameText().toLowerCase())`);
  check(added.includes("keyboard.mentor@devmentor.test"), "keyboard: Ctrl+Enter submits the add-mentor form");
  evalJson(`document.querySelector('#s07 [name=name]').focus(); 1`);
  ab(["keyboard", "type", "Will be cancelled"]);
  ab(["press", "Escape"]);
  // The real /admin/mentors page passes no onCancel to CrudForm, so Escape does nothing there either; the prototype matches it.
  const kept = evalJson(`document.querySelector('#s07 [name=name]').value`);
  check(kept === "Will be cancelled", "keyboard: Escape leaves the add-mentor form as the real page does (no onCancel)", `field holds '${kept}'`);
  evalJson(`document.querySelector('.review-help').open = false; document.querySelector('.review-help summary').focus(); 1`);
  ab(["press", "Enter"]);
  check(evalJson(`document.querySelector('.review-help').open`) === true, "keyboard: Enter opens the Scenarios panel");
  ab(["press", "Enter"]);
  check(evalJson(`document.querySelector('.review-help').open`) === false, "keyboard: Enter closes the Scenarios panel again");
}

const jobs = [];
for (const [vpName, w, h] of VIEWPORTS) for (const theme of THEMES) jobs.push({ tag: `${vpName}px ${theme}`, w, h, theme });

for (const job of jobs) {
  openFresh(job.w, job.h, job.theme);
  if (!only || only === "states") states(job.tag);
  if (!only || only === "reach") reachability(job.tag);
  if (!only || only === "keyboard") keyboard(job.tag);
  if (job.theme === "dark") {
    if (!only || only === "options") options(job.tag);
    if (!only || only === "buttons") { buttons(job.tag); toolbarButtons(job.tag, job.w, job.h); }
    if (job.w === 1440 && (!only || only === "keyboard")) keyboardOperation();
  }
}
ab(["close", "--all"]);
log(`TOTAL | ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
