import type { ComponentType } from "react";
import type { ScreenId } from "../store";
import { CheckInbox } from "./CheckInbox";
import { ConfirmPassword } from "./ConfirmPassword";
import { GithubConsent } from "./GithubConsent";
import { MenteeHome, MentorHome, OperatorHome } from "./Homes";
import { Mailbox } from "./Mailbox";
import { Register } from "./Register";
import { SignIn } from "./SignIn";

export interface ScreenDef {
  id: ScreenId;
  title: string;
  nav: string;
  path: string;
  component: ComponentType;
  note: ScreenNote;
}

/** Stage 3 honesty note shown above every screen: which stories it serves, what is simulated, what it does not settle. */
export interface ScreenNote {
  stories: string;
  simulated: string;
  open: string;
}

// Identifiers follow lekcja-07/mapa-ekranow.md and never change: comments are pinned to them. s08 draws nothing (G06).
export const SCREENS: ScreenDef[] = [
  { id: "s01", title: "Sign in", nav: "Sign in", path: "/sign-in", component: SignIn, note: { stories: "#36 (GitHub), #37 (e-mail), E-1, E-2, 36-K3 to K7, 37-K2, 37-K8", simulated: "GitHub and the e-mail check are simulated: the result comes from the scenario controls, not from a server. Rate limits are counted in memory.", open: "Reset-password flow (G16: only a pointer to GitHub or the team), invitation wording (G04), the real contact address (placeholder)." } },
  { id: "s02", title: "Register", nav: "Register", path: "/register", component: Register, note: { stories: "#37, 37-K1, 37-K4, 37-K6, 37-K7", simulated: "No e-mail leaves the page; the message lands in the simulated mailbox (s10). The 5 per hour limit is counted in memory.", open: "Terms and privacy consent (G26: none for now), final copy under the title (G25: neutral placeholder)." } },
  { id: "s03", title: "Check your e-mail", nav: "Check e-mail", path: "/register (after sending)", component: CheckInbox, note: { stories: "#37, 37-K1, 37-K6", simulated: "Looks the same for every address, including a silent cooldown, by design. Nothing proves a mail was sent.", open: "Whether this is a separate screen (G12, decided: yes) and the wording of the retry line (placeholder)." } },
  { id: "s04", title: "Set a password", nav: "Password", path: "/register/confirm?token=", component: ConfirmPassword, note: { stories: "#37, 37-K1, 37-K4, 37-K5, 37-K6", simulated: "The token is a prototype value; expiry, tampering and reuse are scenario choices (P04). The password is never stored or checked beyond length.", open: "What a signed-in visitor sees with a valid link (G13, decided: redirect home). The 10 per hour limit text is a placeholder." } },
  { id: "s05", title: "Mentee home", nav: "Mentee", path: "/home", component: MenteeHome, note: { stories: "#36 (36-K1), #38 (38-K1, 38-K5), E-1, E-2", simulated: "The session is a variable in memory; the signed cookie, its 24 h life and a stale role (P09) are modelled, not enforced.", open: "Page content (G08: one neutral card), what a stale cookie should do (G18: nothing). Nothing offers a way to become a mentor (R07)." } },
  { id: "s06", title: "Mentor home", nav: "Mentor", path: "/mentor", component: MentorHome, note: { stories: "#36 (36-K2), #38 (38-K1, 38-K8), E-1, E-2", simulated: "Same simulated session as s05. The operator-with-mentor-role case (P07) only shows the state.", open: "Page content (G08), any word about operator access for a founder with a mentor account (G19: none)." } },
  { id: "s07", title: "Operator: mentors", nav: "Operator", path: "/admin/mentors", component: OperatorHome, note: { stories: "#38 (38-K2, 38-K3, 38-K6), E-3", simulated: "The mentor list lives in memory, never in /api; loading, error and empty come from the network control (P10). Adding a mentor changes only this page.", open: "Whether the add form stays in the final Epic 01 (G09: kept as is), who may be a mentor without an invitation (E02-S01)." } },
  { id: "s09", title: "GitHub consent (simulation)", nav: "GitHub", path: "github.com (external, simulated)", component: GithubConsent, note: { stories: "#36 (36-K1, 36-K3, 36-K6, 36-K7)", simulated: "A stand-in for github.com, not a DevMentor screen. The profiles are invented; nothing leaves the page.", open: "The real GitHub consent screen, scopes and error pages." } },
  { id: "s10", title: "Mailbox (simulation)", nav: "Mailbox", path: "mail client (external, simulated)", component: Mailbox, note: { stories: "#37 (37-K1, 37-K6)", simulated: "A stand-in for the recipient mailbox. In production the adapter only logs messages (Q26).", open: "Final mail copy (G11: placeholders), the real transport (Q26)." } },
];
