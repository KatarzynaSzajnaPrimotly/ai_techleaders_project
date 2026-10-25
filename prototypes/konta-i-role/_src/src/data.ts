// All data is fictitious (mapa-ekranow.md, section 3). Nothing here is a real person or address.

export type Role = "mentee" | "mentor" | "operator";

export interface Account {
  id: string;
  name: string;
  email: string;
  /** The saved role. A listed operator address becomes an operator at sign-in unless the saved role is mentor (D31). */
  role: Role;
  github?: string;
  password?: string;
}

export interface GithubProfile {
  login: string;
  email: string | null;
  label: string;
}

export interface MentorRow {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

// The fixed demo clock: Monday 2026-11-02, 10:00 CET (09:00 UTC); winter time applies after 25 October.
export const NOW_ISO = "2026-11-02T09:00:00.000Z";
export const NOW_LABEL = "Mon 2 Nov 2026, 10:00 CET";

export const DEMO_PASSWORD = "demo-haslo-12345";

// Addresses on this list get the operator role at sign-in (D19); mirrors OPERATOR_EMAILS.
export const OPERATOR_EMAILS = ["founder.a@devmentor.test", "founder.b@devmentor.test"];

export const ACCOUNTS: Account[] = [
  { id: "A1", name: "Marta Kowalczyk", email: "marta.kowalczyk@devmentor.test", role: "mentee", github: "marta-k" },
  { id: "A2", name: "Tomasz Brzozowski", email: "tomasz.brzozowski@devmentor.test", role: "mentee", password: DEMO_PASSWORD },
  { id: "A3", name: "Piotr Zieliński", email: "piotr.zielinski@devmentor.test", role: "mentor", github: "piotr-z" },
  { id: "A4", name: "Ewa Lis", email: "ewa.lis@devmentor.test", role: "mentor", password: DEMO_PASSWORD },
  { id: "A5", name: "Founder A (demo)", email: "founder.a@devmentor.test", role: "mentee", github: "founder-a" },
  { id: "A6", name: "Founder B (demo)", email: "founder.b@devmentor.test", role: "mentee", password: DEMO_PASSWORD },
  { id: "A7", name: "Founder B as mentor", email: "founder.b.mentor@devmentor.test", role: "mentor", github: "founder-b-mentor" },
];

// Profiles offered by the GitHub consent simulation (s09). The failure profiles arrive in stage 2.
export const GITHUB_PROFILES: GithubProfile[] = [
  { login: "lena-w", email: "lena.wojcik@devmentor.test", label: "New user, verified e-mail" },
  { login: "marta-k", email: "marta.kowalczyk@devmentor.test", label: "Mentee with an account (A1)" },
  { login: "piotr-z", email: "piotr.zielinski@devmentor.test", label: "Mentor with an account (A3)" },
  { login: "founder-a", email: "founder.a@devmentor.test", label: "Operator (A5)" },
  { login: "founder-b-mentor", email: "founder.b.mentor@devmentor.test", label: "Founder B's mentor account (A7)" },
  { login: "tomasz-b", email: "tomasz.brzozowski@devmentor.test", label: "Verified e-mail of a password account (A2), gets linked" },
  { login: "marta-k-alt", email: "marta.kowalczyk@devmentor.test", label: "E-mail of A1, who has a different GitHub id" },
  { login: "no-mail-user", email: null, label: "No verified e-mail" },
];

export const MENTORS: MentorRow[] = [
  { id: "m1", name: "Anna Kaczmarek", email: "anna.kaczmarek@devmentor.test", createdAt: "2026-10-27T09:00:00.000Z" },
  { id: "m2", name: "Piotr Zieliński", email: "piotr.zielinski@devmentor.test", createdAt: "2026-10-29T09:00:00.000Z" },
  { id: "m3", name: "Ewa Lis", email: "ewa.lis@devmentor.test", createdAt: "2026-10-30T09:00:00.000Z" },
];

// Registration link lifetime (REGISTRATION_TOKEN_TTL in the spec).
export const REGISTRATION_TOKEN_HOURS = 24;

export const SUPPORT_ADDRESS = "support@devmentor.test";

// A short, fixed delay for every simulated request, so the loading state is visible and always ends.
export const LATENCY_MS = 400;

// A slow network keeps the loading state visible long enough to look at, and still always ends.
export const SLOW_LATENCY_MS = 3000;

// Retry-After of the login limit (540 s, mapa-ekranow.md section 3) shown in whole minutes.
export const LOGIN_RETRY_MINUTES = 9;
// Registration and confirmation windows are one hour in the spec; the prototype shows the whole window (assumption).
export const HOURLY_RETRY_MINUTES = 60;

// Spec limits: at most 3 mails per address per hour; 5 registrations per hour per client IP.
export const MAILS_PER_ADDRESS_PER_HOUR = 3;
export const REGISTRATIONS_PER_IP_PER_HOUR = 5;
