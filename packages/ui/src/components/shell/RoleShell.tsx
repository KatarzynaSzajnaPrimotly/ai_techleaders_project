"use client";

import type { ReactNode } from "react";
import { apiCall } from "../../backend/api/apiCall";

export type ShellRole = "mentee" | "mentor" | "operator";

export interface RoleNavigationItem {
  label: string;
  href: string;
}

export function navFor(role: ShellRole): RoleNavigationItem[] {
  switch (role) {
    case "mentee": return [{ label: "Home", href: "/home" }];
    case "mentor": return [{ label: "Home", href: "/mentor" }];
    case "operator": return [{ label: "Mentors", href: "/admin/mentors" }];
  }
}

const roleLabel: Record<ShellRole, string> = { mentee: "Mentee", mentor: "Mentor", operator: "Operator" };

export function RoleShell({
  children,
  name,
  role,
  onSignedOut,
  wide = false,
  badge,
}: {
  children: ReactNode;
  name: string;
  role: ShellRole;
  onSignedOut: () => void;
  wide?: boolean;
  badge?: ReactNode;
}) {
  async function signOut() {
    const result = await apiCall("/api/auth/logout", { method: "POST", onUnauthorized: "ignore" });
    if (result.ok) onSignedOut();
  }

  return (
    <div className="min-h-screen">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3 sm:px-6">
        <a className="font-semibold tracking-tight" href={navFor(role)[0].href}>DevMentor</a>
        <nav aria-label="Main navigation" className="flex items-center gap-4 text-sm">
          {navFor(role).map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </nav>
        <div className="flex items-center gap-3 text-sm">
          <span>{name}</span>
          <span className="rounded-full border px-2 py-0.5">{roleLabel[role]}</span>
          {badge}
          <button className="rounded-md border px-3 py-1.5" onClick={signOut} type="button">Sign out</button>
        </div>
      </header>
      <main className={`mx-auto space-y-6 px-6 py-8 ${wide ? "max-w-4xl" : "max-w-2xl"}`}>{children}</main>
    </div>
  );
}
