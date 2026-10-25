// What happens when a screen sends something. Screens only call these and show the outcome.
import type { ApiResult } from "@devmentor/ui";
import {
  MAILS_PER_ADDRESS_PER_HOUR,
  NOW_ISO,
  REGISTRATIONS_PER_IP_PER_HOUR,
  type GithubProfile,
  type MentorRow,
  type Role,
} from "./data";
import {
  currentRole,
  effectiveRole,
  expireSession,
  getState,
  HOME,
  landAfterSignIn,
  resolve,
  setHint,
  signIn,
  signOut,
  takeNextRequest,
  update,
  visit,
  type Scenario,
  type ScreenId,
  type SignInNotice,
} from "./store";

function findByEmail(email: string) {
  const wanted = email.trim().toLowerCase();
  return getState().accounts.find((account) => account.email === wanted);
}

function fail(notice: Exclude<SignInNotice, null>): void {
  update({ notice });
}

export type GithubOutcome = "signedIn" | "cancelled" | "state" | "noEmail" | "unavailable";

// s09 -> the callback of the real flow. Failures come back to s01 as a plain message, never as raw data (spec: API Contracts).
export function authorizeGithub(profile: GithubProfile): GithubOutcome {
  const { scenario, accounts } = getState();
  const forced: Partial<Record<Scenario["github"], Exclude<GithubOutcome, "signedIn">>> = {
    cancelled: "cancelled",
    state: "state",
    noEmail: "noEmail",
    unavailable: "unavailable",
    conflict: "unavailable",
  };
  const outcome = forced[scenario.github];
  if (outcome) {
    fail(outcome);
    return outcome;
  }
  if (profile.email === null) {
    fail("noEmail");
    return "noEmail";
  }
  const byGithub = accounts.find((account) => account.github === profile.login);
  if (byGithub) {
    signIn(byGithub.id);
    return "signedIn";
  }
  const byEmail = findByEmail(profile.email);
  if (byEmail) {
    // The e-mail already has an account: link it when it has no GitHub id yet, refuse (without saying why) when it has another one.
    if (byEmail.github) {
      fail("unavailable");
      return "unavailable";
    }
    update({ accounts: accounts.map((account) => (account.id === byEmail.id ? { ...account, github: profile.login } : account)) });
    signIn(byEmail.id);
    return "signedIn";
  }
  const created = { id: `N${accounts.length + 1}`, name: profile.login, email: profile.email, role: "mentee" as Role, github: profile.login };
  update({ accounts: [...accounts, created] });
  signIn(created.id);
  return "signedIn";
}

export function cancelGithub(): void {
  fail("cancelled");
}

export type LoginOutcome = "ok" | "invalid" | "limited" | "failed";

export function submitLogin(email: string, password: string): LoginOutcome {
  const { scenario, limits } = getState();
  const next = takeNextRequest();
  if (next === "rateLimit" || scenario.login === "rateLimit" || limits.login) {
    update({ limits: { ...getState().limits, login: true } });
    return "limited";
  }
  if (next === "serverError") return "failed";
  // Unknown e-mail, wrong password and a GitHub-only account all give the same answer (37-K2).
  if (scenario.login !== "auto") return "invalid";
  const account = findByEmail(email);
  if (!account || account.password !== password) return "invalid";
  signIn(account.id);
  landAfterSignIn();
  return "ok";
}

export type RegisterOutcome = "sent" | "limited" | "failed";

// The answer is "check your e-mail" whatever the address (37-K6); only the mail that leaves differs.
export function submitRegistration(rawEmail: string, displayName: string): RegisterOutcome {
  const before = getState();
  const next = takeNextRequest();
  if (next === "rateLimit" || before.limits.register || before.registrations >= REGISTRATIONS_PER_IP_PER_HOUR) {
    update({ limits: { ...before.limits, register: true } });
    return "limited";
  }
  if (next === "serverError" || before.scenario.register === "sendFail") return "failed";
  const email = rawEmail.trim().toLowerCase();
  update({ draft: { email, displayName }, registrations: before.registrations + 1 });
  const sent = before.mailCount[email] ?? 0;
  // s03.2: past the per-address cooldown the screen looks the same and no mail leaves.
  if (before.scenario.register === "cooldown" || sent >= MAILS_PER_ADDRESS_PER_HOUR) return "sent";
  update({ mailCount: { ...before.mailCount, [email]: sent + 1 } });
  const existing = findByEmail(email);
  const mailbox = getState().mailbox;
  const id = `mail-${mailbox.length + 1}`;
  if (existing || before.scenario.register === "existing") {
    const how = existing?.github ? "Sign in with GitHub, or with your e-mail and password." : "Sign in with your e-mail and password.";
    update({
      mailbox: [{ id, to: email, subject: "You already have a DevMentor account", body: `An account for this address already exists. ${how}`, sentAt: NOW_ISO }, ...mailbox],
    });
    return "sent";
  }
  const token = `demo-token-${mailbox.length + 1}`;
  update({
    token: { value: token, email, displayName },
    mailbox: [
      {
        id,
        to: email,
        subject: "Confirm your DevMentor account",
        body: "Use the link below to set a password and finish creating your account. The link is valid for 24 hours.",
        link: { label: "Confirm your account", token },
        sentAt: NOW_ISO,
      },
      ...mailbox,
    ],
  });
  return "sent";
}

export type ConfirmOutcome = "ok" | "limited" | "failed";

export function submitConfirm(password: string): ConfirmOutcome {
  const before = getState();
  const next = takeNextRequest();
  if (next === "rateLimit" || before.limits.confirm) {
    update({ limits: { ...before.limits, confirm: true } });
    return "limited";
  }
  if (next === "serverError" || !before.token) return "failed";
  const created = { id: `N${before.accounts.length + 1}`, name: before.token.displayName, email: before.token.email, role: "mentee" as Role, password };
  update({ accounts: [...before.accounts, created], token: null });
  signIn(created.id);
  landAfterSignIn();
  return "ok";
}

// s07: the same answers the real /api/mentors gives, from memory.
export function createMentor(name: string, email: string): ApiResult<unknown> {
  const { mentors } = getState();
  const next = takeNextRequest();
  if (next === "rateLimit") {
    return { ok: false, status: 429, error: { code: "RATE_LIMITED", message: "Too many attempts. Try again in a few minutes." } };
  }
  if (next === "serverError") {
    return { ok: false, status: 500, error: { code: "INTERNAL_ERROR", message: "Internal server error" } };
  }
  if (mentors.some((mentor) => mentor.email === email)) {
    return { ok: false, status: 409, error: { code: "CONFLICT", message: `A mentor with email ${email} already exists` } };
  }
  const row: MentorRow = { id: `m${mentors.length + 1}`, name, email, createdAt: NOW_ISO };
  update({ mentors: [...mentors, row] });
  return { ok: true, status: 201, data: row };
}

export function setScenario<K extends keyof Scenario>(key: K, value: Scenario[K]): void {
  const before = getState();
  update({ scenario: { ...before.scenario, [key]: value } });
  if (key === "login" && value !== "rateLimit") update({ limits: { ...getState().limits, login: false } });
  if (key === "founderRole") {
    update({ accounts: getState().accounts.map((account) => (account.id === "A5" ? { ...account, role: value as Role } : account)) });
  }
  if (key === "session" && value !== "valid") {
    if (before.session) {
      setHint("The session is no longer valid; the next request is refused.");
      window.setTimeout(expireSession, 300);
    } else {
      setHint("Sign in first, then choose this again.");
      update({ scenario: { ...getState().scenario, session: "valid" } });
    }
  }
  if (key === "cookie") applyCookie(value as Scenario["cookie"]);
}

// P09: a cookie that still says mentee although the account became a mentor (G18). No warning, only the state.
function applyCookie(cookie: Scenario["cookie"]): void {
  if (cookie === "stale") {
    signIn("A3", "mentee");
    setHint("Cookie says mentee; account A3 is already a mentor. /home still opens (up to 24 h).");
    visit("s05");
    return;
  }
  const session = getState().session;
  const account = getState().accounts.find((candidate) => candidate.id === session?.accountId);
  if (!session || !account) return;
  update({ session: { ...session, cookieRole: effectiveRole(account) } });
  visit(HOME[effectiveRole(account)]);
}

export function switchAccount(accountId: string | null): void {
  if (accountId === null) {
    signOut();
    visit("s01");
    return;
  }
  signIn(accountId);
  const role = currentRole();
  if (role) visit(HOME[role]);
}

const DEMO_ACCOUNT_FOR_ROLE: Record<Role, string> = { mentee: "A1", mentor: "A3", operator: "A6" };

// P08: who opens which address, and where they land.
export function openAddress(who: "anonymous" | Role, address: ScreenId): void {
  if (who === "anonymous") signOut();
  else signIn(DEMO_ACCOUNT_FOR_ROLE[who]);
  const landing = resolve(address);
  setHint(`${who} opens ${address}: lands on ${landing}.`);
  visit(address);
}

export function clearLimits(): void {
  update({ limits: { login: false, register: false, confirm: false } });
  setHint("Rate limits cleared.");
}
