import { useSyncExternalStore } from "react";
import { ACCOUNTS, LATENCY_MS, MENTORS, OPERATOR_EMAILS, SLOW_LATENCY_MS, type Account, type MentorRow, type Role } from "./data";

export type ScreenId = "s01" | "s02" | "s03" | "s04" | "s05" | "s06" | "s07" | "s09" | "s10";

export interface Mail {
  id: string;
  to: string;
  subject: string;
  body: string;
  link?: { label: string; token: string };
  sentAt: string;
}

export interface RegistrationDraft {
  email: string;
  displayName: string;
}

export type SignInNotice = "cancelled" | "state" | "noEmail" | "unavailable" | "sessionExpired" | null;

/** The signed session cookie: who it belongs to and the role it carries (it can be older than the account, P09). */
export interface Session {
  accountId: string;
  cookieRole: Role;
}

// Scenario controls (mapa-ekranow.md section 2). Every value is a review aid, never a product feature.
export interface Scenario {
  github: "ok" | "cancelled" | "state" | "noEmail" | "unavailable" | "conflict"; // P01
  register: "auto" | "existing" | "sendFail" | "cooldown"; // P03
  link: "valid" | "expired" | "tampered" | "used" | "missing"; // P04
  login: "auto" | "wrongPassword" | "unknownEmail" | "githubOnly" | "rateLimit"; // P05
  session: "valid" | "expired" | "tampered" | "midWork"; // P06
  founderRole: "mentee" | "mentor"; // P07
  cookie: "matches" | "stale"; // P09
  network: "fast" | "slow" | "serverError" | "empty"; // P10
  nextRequest: "ok" | "rateLimit" | "serverError"; // the next form request fails
  s01b: boolean; // s01.2: stage variant with the e-mail form switched off
}

export interface Limits {
  login: boolean;
  register: boolean;
  confirm: boolean;
}

export interface State {
  epoch: number;
  notice: SignInNotice;
  accounts: Account[];
  session: Session | null;
  mentors: MentorRow[];
  mailbox: Mail[];
  draft: RegistrationDraft;
  token: { value: string; email: string; displayName: string } | null;
  scenario: Scenario;
  limits: Limits;
  returnTo: ScreenId | null;
  currentScreen: ScreenId;
  mailCount: Record<string, number>;
  registrations: number;
  hint: string;
}

const defaultScenario = (): Scenario => ({
  github: "ok",
  register: "auto",
  link: "valid",
  login: "auto",
  session: "valid",
  founderRole: "mentee",
  cookie: "matches",
  network: "fast",
  nextRequest: "ok",
  s01b: false,
});

const initial = (epoch = 0): State => ({
  epoch,
  notice: null,
  accounts: ACCOUNTS.map((account) => ({ ...account })),
  session: null,
  mentors: MENTORS.map((mentor) => ({ ...mentor })),
  mailbox: [],
  draft: { email: "", displayName: "" },
  token: null,
  scenario: defaultScenario(),
  limits: { login: false, register: false, confirm: false },
  returnTo: null,
  currentScreen: "s01",
  mailCount: {},
  registrations: 0,
  hint: "",
});

let state = initial();
const listeners = new Set<() => void>();

export function getState(): State {
  return state;
}

export function update(patch: Partial<State>): void {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function reset(): void {
  state = initial(state.epoch + 1);
  listeners.forEach((listener) => listener());
}

export function useStore<T>(select: (current: State) => T): T {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => select(state),
  );
}

// Every account has exactly one role (D31). An address on the operator list becomes an operator at sign-in,
// unless the saved role is mentor: that account stays a mentor without operator access (38-K8).
export function effectiveRole(account: Account): Role {
  if (account.role === "mentor") return "mentor";
  return OPERATOR_EMAILS.includes(account.email.toLowerCase()) ? "operator" : account.role;
}

export const HOME: Record<Role, ScreenId> = { mentee: "s05", mentor: "s06", operator: "s07" };

const GUEST_SCREENS: ScreenId[] = ["s01", "s02", "s03", "s04"];
const ROLE_SCREENS: Partial<Record<ScreenId, Role>> = { s05: "mentee", s06: "mentor", s07: "operator" };

export function currentAccount(current: State = state): Account | null {
  return current.accounts.find((account) => account.id === current.session?.accountId) ?? null;
}

export function currentRole(current: State = state): Role | null {
  return current.session?.cookieRole ?? null;
}

// Where a visit to `target` really ends up. Redirects are silent (G06): a wrong role lands on its own home.
export function resolve(target: ScreenId, current: State = state): ScreenId {
  const role = currentRole(current);
  if (GUEST_SCREENS.includes(target) && role) return HOME[role];
  const required = ROLE_SCREENS[target];
  if (!required) return target;
  if (!role) return "s01";
  return role === required ? target : HOME[role];
}

function navigate(target: ScreenId): void {
  document.dispatchEvent(new CustomEvent("prototype:navigate", { detail: target }));
}

// An anonymous visitor sent to sign-in keeps where they wanted to go (returnTo, E-2).
export function visit(target: ScreenId): void {
  if (ROLE_SCREENS[target] && !state.session) update({ returnTo: target });
  navigate(resolve(target));
}

export function signIn(accountId: string, cookieRole?: Role): void {
  const account = state.accounts.find((candidate) => candidate.id === accountId);
  if (!account) return;
  update({ session: { accountId, cookieRole: cookieRole ?? effectiveRole(account) }, notice: null });
}

export function signOut(): void {
  update({ session: null });
}

// Lands a signed-in user where they were going, or on their home.
export function landAfterSignIn(): void {
  const role = currentRole();
  if (!role) return;
  const target = state.returnTo ?? HOME[role];
  update({ returnTo: null });
  visit(target);
}

// The server answered 401 or the cookie is no longer valid: back to sign-in with the reason (G07).
export function expireSession(): void {
  const here = state.currentScreen;
  update({
    session: null,
    notice: "sessionExpired",
    returnTo: ROLE_SCREENS[here] ? here : null,
    scenario: { ...state.scenario, session: "valid" },
  });
  navigate("s01");
}

export function setHint(hint: string): void {
  update({ hint });
}

export function latency(): number {
  return state.scenario.network === "slow" ? SLOW_LATENCY_MS : LATENCY_MS;
}

// The "next request" control fails exactly one request, then returns to normal.
export function takeNextRequest(): Scenario["nextRequest"] {
  const next = state.scenario.nextRequest;
  if (next !== "ok") update({ scenario: { ...state.scenario, nextRequest: "ok" } });
  return next;
}
