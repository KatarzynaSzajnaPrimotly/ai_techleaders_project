/**
 * Client-side "backend" for the prototype: persists in localStorage so the
 * demo survives real full-page navigation between the static .html files.
 * This stands in for the API endpoints documented per screen in
 * docs/04-screen-specifications.md.
 */
namespace MentorApp {
  const LS_KEY = "mentorapp_state_v1";

  export type Role = "guest" | "student" | "tutor" | "admin";
  export type DemoState = "success" | "loading" | "empty" | "error";

  export interface ThreadMessage { from: "me" | "them"; text: string; time: string; }
  export interface Thread { id: string; tutorId: string; tutorName: string; unread: boolean; messages: ThreadMessage[]; }
  export interface BookingDraft {
    tutorId?: string;
    lessonType?: "trial" | "single" | "package";
    packageSize?: 4 | 8 | 12;
    day?: string;
    time?: string;
    note?: string;
  }
  export interface NotificationItem { id: string; icon: string; text: string; time: string; unread: boolean; href: string; }
  export interface AppState {
    auth: boolean;
    role: Role;
    name: string;
    favorites: string[];
    threads: Thread[];
    bookingDraft: BookingDraft;
    notifications: NotificationItem[];
    applicationStatus: "none" | "pending" | "approved" | "rejected";
    redirectTo: string;
  }

  function defaultState(): AppState {
    return {
      auth: false,
      role: "guest",
      name: "",
      favorites: [],
      threads: [
        {
          id: "th-ana", tutorId: "t-ana-ruiz", tutorName: "Ana Ruiz", unread: true,
          messages: [
            { from: "them", text: "¡Hola! Thanks for reaching out — happy to answer any questions before you book a trial.", time: "09:12" },
          ],
        },
      ],
      bookingDraft: {},
      notifications: [
        { id: "n1", icon: "📅", text: "Reminder: your lesson with Ana Ruiz starts in 1 hour.", time: "08:00", unread: true, href: "dashboard.html" },
        { id: "n2", icon: "💬", text: "Ana Ruiz sent you a message.", time: "Yesterday", unread: true, href: "messages.html" },
        { id: "n3", icon: "⭐", text: "You received a new 5-star review.", time: "2 days ago", unread: false, href: "tutor-reviews.html" },
      ],
      applicationStatus: "none",
      redirectTo: "",
    };
  }

  function load(): AppState {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaultState();
      return { ...defaultState(), ...JSON.parse(raw) };
    } catch {
      return defaultState();
    }
  }

  function save(s: AppState): void {
    localStorage.setItem(LS_KEY, JSON.stringify(s));
  }

  export const Store = {
    get(): AppState { return load(); },
    set(patch: Partial<AppState>): AppState {
      const next = { ...load(), ...patch };
      save(next);
      return next;
    },
    update(fn: (s: AppState) => AppState): AppState {
      const next = fn(load());
      save(next);
      return next;
    },
    reset(): void { localStorage.removeItem(LS_KEY); },
  };

  export function login(role: Role, name: string): void {
    Store.set({ auth: true, role, name });
  }

  export function logout(): void {
    Store.set({ auth: false, role: "guest", name: "" });
  }

  export function toggleFavorite(tutorId: string): boolean {
    const s = Store.get();
    const has = s.favorites.includes(tutorId);
    const favorites = has ? s.favorites.filter((id) => id !== tutorId) : [...s.favorites, tutorId];
    Store.set({ favorites });
    return !has;
  }

  /** Per-screen "what state should I render" override, read from ?state= in the URL,
   *  controlled by the floating dev toolbar. Defaults to a short loading flash then success. */
  export function demoStateFromUrl(): DemoState | null {
    const params = new URLSearchParams(location.search);
    const v = params.get("state");
    if (v === "loading" || v === "empty" || v === "error" || v === "success") return v;
    return null;
  }

  export function setDemoState(state: DemoState): void {
    const params = new URLSearchParams(location.search);
    params.set("state", state);
    location.search = params.toString();
  }
}
