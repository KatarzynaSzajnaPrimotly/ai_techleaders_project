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
}

// Identifiers follow lekcja-07/mapa-ekranow.md and never change: comments are pinned to them. s08 draws nothing (G06).
export const SCREENS: ScreenDef[] = [
  { id: "s01", title: "Sign in", nav: "Sign in", path: "/sign-in", component: SignIn },
  { id: "s02", title: "Register", nav: "Register", path: "/register", component: Register },
  { id: "s03", title: "Check your e-mail", nav: "Check e-mail", path: "/register (after sending)", component: CheckInbox },
  { id: "s04", title: "Set a password", nav: "Password", path: "/register/confirm?token=", component: ConfirmPassword },
  { id: "s05", title: "Mentee home", nav: "Mentee", path: "/home", component: MenteeHome },
  { id: "s06", title: "Mentor home", nav: "Mentor", path: "/mentor", component: MentorHome },
  { id: "s07", title: "Operator: mentors", nav: "Operator", path: "/admin/mentors", component: OperatorHome },
  { id: "s09", title: "GitHub consent (simulation)", nav: "GitHub", path: "github.com (external, simulated)", component: GithubConsent },
  { id: "s10", title: "Mailbox (simulation)", nav: "Mailbox", path: "mail client (external, simulated)", component: Mailbox },
];
