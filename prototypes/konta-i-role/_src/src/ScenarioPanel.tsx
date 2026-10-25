import { useState } from "react";
import { DEMO_PASSWORD } from "./data";
import { clearLimits, openAddress, setScenario, switchAccount } from "./flows";
import { effectiveRole, useStore, type Scenario, type ScreenId } from "./store";
import type { Role } from "./data";

interface Control<K extends keyof Scenario> {
  id: string;
  key: K;
  label: string;
  options: [Scenario[K], string][];
}

// Scenario controls from mapa-ekranow.md section 2. The first option is the default.
const CONTROLS: Control<keyof Scenario>[] = [
  {
    id: "P01",
    key: "github",
    label: "GitHub result",
    options: [
      ["ok", "success"],
      ["cancelled", "cancelled"],
      ["state", "missing or wrong state"],
      ["noEmail", "no verified e-mail"],
      ["unavailable", "unavailable"],
      ["conflict", "e-mail has another GitHub id"],
    ],
  },
  {
    id: "P03",
    key: "register",
    label: "Registration by e-mail",
    options: [
      ["auto", "from the address typed"],
      ["existing", "address already has an account"],
      ["sendFail", "mail send fails"],
      ["cooldown", "third mail in the hour (silent)"],
    ],
  },
  {
    id: "P04",
    key: "link",
    label: "Link from the mail",
    options: [
      ["valid", "valid"],
      ["expired", "expired (older than 24 h)"],
      ["tampered", "tampered"],
      ["used", "already used"],
      ["missing", "no token"],
    ],
  },
  {
    id: "P05",
    key: "login",
    label: "E-mail sign-in",
    options: [
      ["auto", "from the credentials typed"],
      ["wrongPassword", "wrong password"],
      ["unknownEmail", "unknown e-mail"],
      ["githubOnly", "account with GitHub only"],
      ["rateLimit", "attempt limit reached"],
    ],
  },
  {
    id: "P06",
    key: "session",
    label: "Session",
    options: [
      ["valid", "valid"],
      ["expired", "expired (cookie older than 24 h)"],
      ["tampered", "tampered"],
      ["midWork", "expires mid-work (401 now)"],
    ],
  },
  {
    id: "P07",
    key: "founderRole",
    label: "Saved role of listed operator A5",
    options: [
      ["mentee", "mentee (becomes operator)"],
      ["mentor", "mentor (stays a mentor)"],
    ],
  },
  {
    id: "P09",
    key: "cookie",
    label: "Cookie role",
    options: [
      ["matches", "matches the account"],
      ["stale", "mentee, account already a mentor"],
    ],
  },
  {
    id: "P10",
    key: "network",
    label: "Network and mentor list",
    options: [
      ["fast", "fast"],
      ["slow", "slow (loading state)"],
      ["serverError", "server error"],
      ["empty", "empty list"],
    ],
  },
  {
    id: "next",
    key: "nextRequest",
    label: "Next form request",
    options: [
      ["ok", "succeeds"],
      ["rateLimit", "429 too many attempts"],
      ["serverError", "server error"],
    ],
  },
];

const ADDRESSES: [ScreenId, string][] = [
  ["s01", "/sign-in"],
  ["s02", "/register"],
  ["s05", "/home"],
  ["s06", "/mentor"],
  ["s07", "/admin/mentors"],
];

// The review bar's scenario panel. It sits apart from the product navigation (rule 5) and never appears on a product screen.
export function ScenarioPanel() {
  const scenario = useStore((state) => state.scenario);
  const hint = useStore((state) => state.hint);
  const sessionId = useStore((state) => state.session?.accountId ?? "");
  const accounts = useStore((state) => state.accounts);
  const [who, setWho] = useState<"anonymous" | Role>("anonymous");
  const [address, setAddress] = useState<ScreenId>("s05");

  return (
    <details className="review-help">
      <summary>Scenarios</summary>
      <div className="review-help-body" role="group" aria-label="Scenario controls">
        <p className="t-hint" role="status">
          {hint || "Pick a scenario; it applies to the next action."}
        </p>
        <div className="review-grid">
          {CONTROLS.map((control) => (
            <label key={control.id} className="review-field">
              <span>
                <b>{control.id}</b> {control.label}
              </span>
              <select
                value={String(scenario[control.key])}
                onChange={(event) => setScenario(control.key, event.target.value as never)}
              >
                {control.options.map(([value, label]) => (
                  <option key={String(value)} value={String(value)}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <label className="review-field">
            <span>
              <b>s01.2</b> Stage variant
            </span>
            <select value={scenario.s01b ? "on" : "off"} onChange={(event) => setScenario("s01b", event.target.value === "on")}>
              <option value="off">e-mail form on</option>
              <option value="on">e-mail form off (S01b)</option>
            </select>
          </label>
          <label className="review-field">
            <span>
              <b>Account</b> Signed in as
            </span>
            <select value={sessionId} onChange={(event) => switchAccount(event.target.value || null)}>
              <option value="">anonymous</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.id} {account.name} ({effectiveRole(account)})
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className="review-open">
          <legend>
            <b>P08</b> Who opens which address
          </legend>
          <select aria-label="Role" value={who} onChange={(event) => setWho(event.target.value as typeof who)}>
            <option value="anonymous">anonymous</option>
            <option value="mentee">mentee</option>
            <option value="mentor">mentor</option>
            <option value="operator">operator</option>
          </select>
          <select aria-label="Address" value={address} onChange={(event) => setAddress(event.target.value as ScreenId)}>
            {ADDRESSES.map(([id, path]) => (
              <option key={id} value={id}>
                {path}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-sm" onClick={() => openAddress(who, address)}>
            Open
          </button>
        </fieldset>
        <div className="row">
          <button type="button" className="btn btn-sm" onClick={clearLimits}>
            Clear rate limits
          </button>
          <span className="t-hint">E-mail sign-in password for A2, A4 and A6: {DEMO_PASSWORD}.</span>
        </div>
      </div>
    </details>
  );
}
