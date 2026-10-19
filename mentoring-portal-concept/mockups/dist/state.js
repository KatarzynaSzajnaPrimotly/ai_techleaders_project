"use strict";
/**
 * Client-side "backend" for the prototype: persists in localStorage so the
 * demo survives real full-page navigation between the static .html files.
 * This stands in for the API endpoints documented per screen in
 * docs/04-screen-specifications.md.
 */
var MentorApp;
(function (MentorApp) {
    const LS_KEY = "mentorapp_state_v1";
    function defaultState() {
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
    function load() {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw)
                return defaultState();
            return { ...defaultState(), ...JSON.parse(raw) };
        }
        catch {
            return defaultState();
        }
    }
    function save(s) {
        localStorage.setItem(LS_KEY, JSON.stringify(s));
    }
    MentorApp.Store = {
        get() { return load(); },
        set(patch) {
            const next = { ...load(), ...patch };
            save(next);
            return next;
        },
        update(fn) {
            const next = fn(load());
            save(next);
            return next;
        },
        reset() { localStorage.removeItem(LS_KEY); },
    };
    function login(role, name) {
        MentorApp.Store.set({ auth: true, role, name });
    }
    MentorApp.login = login;
    function logout() {
        MentorApp.Store.set({ auth: false, role: "guest", name: "" });
    }
    MentorApp.logout = logout;
    function toggleFavorite(tutorId) {
        const s = MentorApp.Store.get();
        const has = s.favorites.includes(tutorId);
        const favorites = has ? s.favorites.filter((id) => id !== tutorId) : [...s.favorites, tutorId];
        MentorApp.Store.set({ favorites });
        return !has;
    }
    MentorApp.toggleFavorite = toggleFavorite;
    /** Per-screen "what state should I render" override, read from ?state= in the URL,
     *  controlled by the floating dev toolbar. Defaults to a short loading flash then success. */
    function demoStateFromUrl() {
        const params = new URLSearchParams(location.search);
        const v = params.get("state");
        if (v === "loading" || v === "empty" || v === "error" || v === "success")
            return v;
        return null;
    }
    MentorApp.demoStateFromUrl = demoStateFromUrl;
    function setDemoState(state) {
        const params = new URLSearchParams(location.search);
        params.set("state", state);
        location.search = params.toString();
    }
    MentorApp.setDemoState = setDemoState;
})(MentorApp || (MentorApp = {}));
