"use strict";
var MentorApp;
(function (MentorApp) {
    // ---------------------------------------------------------------- Home
    function initHome() {
        const carousel = document.getElementById("featuredTutors");
        const state = MentorApp.demoStateFromUrl() || "success";
        renderFeatured(carousel, state);
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const chipList = document.getElementById("subjectChips");
        chipList.innerHTML = MentorApp.subjects.map((s) => `<button class="chip" data-subject="${MentorApp.escapeHtml(s)}">${MentorApp.escapeHtml(s)}</button>`).join("");
        chipList.querySelectorAll("[data-subject]").forEach((chip) => {
            chip.addEventListener("click", () => { location.href = `search.html?subject=${encodeURIComponent(chip.dataset.subject)}`; });
        });
        const form = document.getElementById("heroSearchForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = document.getElementById("heroSearchInput").value.trim();
            location.href = q ? `search.html?subject=${encodeURIComponent(q)}` : "search.html";
        });
        wireAutocomplete("heroSearchInput", "heroSearchSuggestions");
    }
    MentorApp.initHome = initHome;
    function renderFeatured(container, state) {
        if (state === "loading") {
            container.innerHTML = Array.from({ length: 4 }).map(() => MentorApp.skeletonCard()).join("");
            return;
        }
        if (state === "error") {
            container.innerHTML = "";
            container.parentElement.style.display = "none"; // graceful degrade per spec, no hard error on homepage
            return;
        }
        if (state === "empty") {
            container.innerHTML = MentorApp.emptyState("🔎", "No featured tutors right now", "Check back soon, or search the full catalog.", '<a class="btn btn-primary" href="search.html">Browse all tutors</a>');
            return;
        }
        container.innerHTML = MentorApp.tutors.slice(0, 6).map((t) => MentorApp.tutorCardHtml(t, "grid")).join("");
        MentorApp.wireTutorCards(container);
    }
    function wireAutocomplete(inputId, listId) {
        const input = document.getElementById(inputId);
        const list = document.getElementById(listId);
        input.addEventListener("input", () => {
            const q = input.value.trim().toLowerCase();
            if (q.length < 2) {
                list.classList.remove("open");
                return;
            }
            const matches = MentorApp.subjects.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
            if (!matches.length) {
                list.classList.remove("open");
                return;
            }
            list.innerHTML = matches.map((s) => `<li><a href="search.html?subject=${encodeURIComponent(s)}">${MentorApp.escapeHtml(s)}</a></li>`).join("");
            list.classList.add("open");
        });
        document.addEventListener("click", (e) => { if (e.target !== input)
            list.classList.remove("open"); });
    }
    // ---------------------------------------------------------- Become tutor
    function initBecomeTutor() {
        var _a;
        const slider = document.getElementById("estHours");
        const rate = document.getElementById("estRate");
        const out = document.getElementById("estOutput");
        const recalc = () => {
            const monthly = Number(slider.value) * Number(rate.value) * 4.33;
            out.textContent = `$${Math.round(monthly).toLocaleString()}/month`;
        };
        slider.addEventListener("input", recalc);
        rate.addEventListener("input", recalc);
        recalc();
        document.querySelectorAll(".accordion-item button").forEach((btn) => {
            btn.addEventListener("click", () => btn.parentElement.classList.toggle("open"));
        });
        (_a = document.getElementById("applyNowBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            location.href = "become-tutor-apply.html";
        });
    }
    MentorApp.initBecomeTutor = initBecomeTutor;
    // ---------------------------------------------------------- Settings
    function initSettings() {
        var _a, _b;
        if (!MentorApp.requireAuth("settings.html")) {
            location.href = "index.html";
            return;
        }
        const s = MentorApp.Store.get();
        document.getElementById("settingsName").value = s.name;
        (_a = document.getElementById("settingsForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("settingsName").value.trim();
            if (!name) {
                MentorApp.toast("Name can't be empty.", "error");
                return;
            }
            MentorApp.Store.set({ name });
            MentorApp.toast("Settings saved", "success");
            MentorApp.renderHeaderInPlace();
        });
        (_b = document.getElementById("deleteAccountBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
            const ok = await MentorApp.confirmDialog({ title: "Delete your account?", body: "This can't be undone. Type DELETE to confirm in a real flow — simplified here for the demo.", confirmLabel: "Delete account", danger: true });
            if (ok) {
                MentorApp.Store.reset();
                MentorApp.toast("Account deleted (demo).", "success");
                setTimeout(() => location.href = "index.html", 800);
            }
        });
    }
    MentorApp.initSettings = initSettings;
    // ------------------------------------------------------------ Notifications
    function initNotifications() {
        var _a, _b;
        if (!MentorApp.requireAuth("notifications.html")) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        const list = document.getElementById("notifList");
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        if (state === "loading") {
            list.innerHTML = Array.from({ length: 4 }).map(() => MentorApp.skeletonRow()).join("");
            return;
        }
        if (state === "error") {
            list.innerHTML = MentorApp.errorState("We couldn't load your notifications.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            return;
        }
        if (state === "empty") {
            list.innerHTML = MentorApp.emptyState("🎉", "You're all caught up!", "New activity will show up here.");
            return;
        }
        const items = MentorApp.Store.get().notifications;
        list.innerHTML = items.map((n) => `
      <a class="notification-item ${n.unread ? "unread" : ""}" href="${n.href}" data-notif-id="${n.id}">
        <div class="icon">${n.icon}</div>
        <div style="flex:1;">
          <div>${MentorApp.escapeHtml(n.text)}</div>
          <div style="font-size:12px; color:var(--color-text-muted); margin-top:4px;">${n.time}</div>
        </div>
      </a>
    `).join("");
        list.querySelectorAll("[data-notif-id]").forEach((el) => {
            el.addEventListener("click", () => {
                MentorApp.Store.update((st) => ({ ...st, notifications: st.notifications.map((n) => n.id === el.dataset.notifId ? { ...n, unread: false } : n) }));
            });
        });
        (_b = document.getElementById("markAllReadBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            MentorApp.Store.update((st) => ({ ...st, notifications: st.notifications.map((n) => ({ ...n, unread: false })) }));
            MentorApp.toast("All notifications marked as read", "success");
            initNotifications();
        });
    }
    MentorApp.initNotifications = initNotifications;
})(MentorApp || (MentorApp = {}));
