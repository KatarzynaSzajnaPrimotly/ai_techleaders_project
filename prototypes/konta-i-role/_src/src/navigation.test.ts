import { beforeEach, describe, expect, it } from "vitest";
import { ACCOUNTS } from "./data";
import { openAddress, setScenario, switchAccount } from "./flows";
import { SCREENS } from "./screens";
import { getState, HOME, reset, resolve, signIn, signOut, visit, type ScreenId } from "./store";
import type { Role } from "./data";

const DEMO_ACCOUNT: Record<Role, string> = { mentee: "A1", mentor: "A3", operator: "A6" };

function lastNavigation(action: () => void): ScreenId | null {
  let target: ScreenId | null = null;
  const listener = (event: Event) => {
    target = (event as CustomEvent<ScreenId>).detail;
  };
  document.addEventListener("prototype:navigate", listener);
  action();
  document.removeEventListener("prototype:navigate", listener);
  return target;
}

beforeEach(() => {
  reset();
});

describe("screen registry", () => {
  it("keeps the ids of the approved map and draws nothing for s08", () => {
    expect(SCREENS.map((screen) => screen.id)).toEqual(["s01", "s02", "s03", "s04", "s05", "s06", "s07", "s09", "s10"]);
  });

  it("gives every screen a path and a note with the three honesty lines", () => {
    for (const screen of SCREENS) {
      expect(screen.path, screen.id).not.toBe("");
      expect(screen.note.stories, screen.id).not.toBe("");
      expect(screen.note.simulated, screen.id).not.toBe("");
      expect(screen.note.open, screen.id).not.toBe("");
    }
  });
});

// mapa-ekranow.md section 1b: who sees which screen.
describe("access matrix (1b)", () => {
  const home: Record<Role, ScreenId> = { mentee: "s05", mentor: "s06", operator: "s07" };

  it("shows guest screens to an anonymous visitor and sends the role pages to sign-in", () => {
    for (const screen of ["s01", "s02", "s03", "s04"] as ScreenId[]) expect(resolve(screen)).toBe(screen);
    for (const screen of ["s05", "s06", "s07"] as ScreenId[]) expect(resolve(screen)).toBe("s01");
  });

  for (const role of ["mentee", "mentor", "operator"] as Role[]) {
    it(`sends a ${role} away from guest screens and foreign role pages, silently, to their own home`, () => {
      signIn(DEMO_ACCOUNT[role]);
      for (const screen of ["s01", "s02", "s03", "s04"] as ScreenId[]) expect(resolve(screen), screen).toBe(home[role]);
      for (const screen of ["s05", "s06", "s07"] as ScreenId[]) expect(resolve(screen), screen).toBe(home[role]);
      expect(resolve(home[role])).toBe(home[role]);
    });
  }

  it("never redirects the simulated external screens", () => {
    expect(resolve("s09")).toBe("s09");
    expect(resolve("s10")).toBe("s10");
    signIn("A1");
    expect(resolve("s09")).toBe("s09");
    expect(resolve("s10")).toBe("s10");
  });
});

describe("navigation", () => {
  it("remembers where an anonymous visitor wanted to go (returnTo)", () => {
    expect(lastNavigation(() => visit("s07"))).toBe("s01");
    expect(getState().returnTo).toBe("s07");
  });

  it("does not remember guest or simulated screens as a return target", () => {
    visit("s02");
    visit("s09");
    expect(getState().returnTo).toBeNull();
  });

  it("emits the resolved screen, not the requested one", () => {
    signIn("A3");
    expect(lastNavigation(() => visit("s05"))).toBe("s06");
  });

  it("lands every demo account on the home of its effective role", () => {
    const expected: Record<string, ScreenId> = { A1: "s05", A2: "s05", A3: "s06", A4: "s06", A5: "s07", A6: "s07", A7: "s06" };
    for (const account of ACCOUNTS) {
      signOut();
      expect(lastNavigation(() => switchAccount(account.id)), account.id).toBe(expected[account.id]);
    }
  });

  it("signing out returns to sign-in", () => {
    switchAccount("A1");
    expect(lastNavigation(() => switchAccount(null))).toBe("s01");
    expect(getState().session).toBeNull();
  });

  it("keeps a listed operator who saved the mentor role on the mentor page (38-K8)", () => {
    setScenario("founderRole", "mentor");
    expect(lastNavigation(() => switchAccount("A5"))).toBe("s06");
  });

  it("shows a stale mentee cookie the mentee page although the account is a mentor (P09)", () => {
    setScenario("cookie", "stale");
    expect(getState().session?.cookieRole).toBe("mentee");
    expect(resolve("s05")).toBe("s05");
    expect(resolve("s06")).toBe("s05");
  });

  it("P08 lands each role on the address it opens, and anonymous on sign-in with returnTo", () => {
    const grid: [Role | "anonymous", ScreenId, ScreenId][] = [
      ["anonymous", "s05", "s01"],
      ["anonymous", "s07", "s01"],
      ["mentee", "s06", "s05"],
      ["mentee", "s07", "s05"],
      ["mentor", "s05", "s06"],
      ["mentor", "s07", "s06"],
      ["operator", "s05", "s07"],
      ["operator", "s06", "s07"],
      ["mentor", "s06", "s06"],
    ];
    for (const [who, address, landing] of grid) {
      expect(lastNavigation(() => openAddress(who, address)), `${who} ${address}`).toBe(landing);
      expect(getState().hint).toContain(`lands on ${landing}`);
    }
  });

  it("an expired session sends a role page back to sign-in with the reason and the return target", async () => {
    switchAccount("A3");
    visit("s06");
    // the app keeps currentScreen in step with the engine; do the same here
    const { update } = await import("./store");
    update({ currentScreen: "s06" });
    setScenario("session", "expired");
    await new Promise((resolveTimer) => setTimeout(resolveTimer, 400));
    expect(getState().session).toBeNull();
    expect(getState().notice).toBe("sessionExpired");
    expect(getState().returnTo).toBe("s06");
  });

  it("choosing an invalid session while signed out only explains what to do", () => {
    setScenario("session", "tampered");
    expect(getState().hint).toContain("Sign in first");
    expect(getState().scenario.session).toBe("valid");
  });
});

describe("home mapping", () => {
  it("has one home per role", () => {
    expect(HOME).toEqual({ mentee: "s05", mentor: "s06", operator: "s07" });
  });
});
