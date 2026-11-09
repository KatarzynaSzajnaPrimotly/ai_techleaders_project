import type { Role } from "@devmentor/core";
import { requireJwtSecret, SESSION_COOKIE, verifySession, type Access, type Session } from "@devmentor/core";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createElement, type ComponentType, type ReactNode } from "react";
import { resolveCurrentSession } from "./current-session";

/** The default landing page for each single-role account type. */
export function homeFor(role: Role): string {
  switch (role) {
    case "mentee":
      return "/home";
    case "mentor":
      return "/mentor";
    case "operator":
      return "/admin/mentors";
  }
}

export async function readSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const session = await verifySession(token, requireJwtSecret());
    return resolveCurrentSession(session);
  } catch {
    return null;
  }
}

export function guardedPage<P extends object>(
  options: { path: string; access: Exclude<Access, "public"> },
  render: (props: P, session: Session) => ReactNode | Promise<ReactNode>,
): (props: P) => Promise<ReactNode> {
  return async function GuardedPage(props: P): Promise<ReactNode> {
    const session = await readSession();
    if (!session) redirect(`/sign-in?returnTo=${encodeURIComponent(options.path)}`);
    if (options.access === "authenticated") return render(props, session);
    if (!options.access.roles.some((role) => (session.roles ?? [session.role]).includes(role))) redirect(homeFor(session.role));
    return render(props, session);
  };
}

export function publicPage<P extends object>(component: ComponentType<P>): ComponentType<P>;
export function publicPage<P extends object>(
  component: ComponentType<P & { session: Session | null }>,
  options: { withSession: true },
): (props: P) => Promise<ReactNode>;
export function publicPage<P extends object>(
  component: ComponentType<P>,
  options?: { withSession: true },
): ComponentType<P> | ((props: P) => Promise<ReactNode>) {
  if (!options?.withSession) return component;
  return async function PublicPage(props: P): Promise<ReactNode> {
    const session = await readSession();
    return createElement(component, { ...props, session } as P);
  };
}
