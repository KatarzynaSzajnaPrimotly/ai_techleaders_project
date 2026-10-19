"use strict";
var MentorApp;
(function (MentorApp) {
    function initAdmin() {
        var _a, _b;
        const s = MentorApp.Store.get();
        if (s.role !== "admin") {
            document.getElementById("adminRoot").innerHTML = `
        <div class="state-panel" style="max-width:480px; margin:60px auto;">
          <div class="state-icon">🛡️</div>
          <h3>Admin area</h3>
          <p>This is an internal operator role, not part of the public sign-up flow. Enter the demo as an admin to see the moderation pattern.</p>
          <button class="btn btn-primary" id="enterAdminDemoBtn">Enter as Admin (demo)</button>
        </div>
      `;
            (_a = document.getElementById("enterAdminDemoBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
                MentorApp.login("admin", "Priya (Admin)");
                location.reload();
            });
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const kpis = document.getElementById("adminKpis");
        if (state === "loading") {
            kpis.innerHTML = Array.from({ length: 5 }).map(() => `<div class="skeleton" style="height:76px;border-radius:12px;"></div>`).join("");
        }
        else if (state === "error") {
            kpis.innerHTML = MentorApp.errorState("Couldn't load platform metrics.");
            (_b = document.getElementById("retryBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => MentorApp.setDemoState("success"));
        }
        else {
            kpis.innerHTML = `
        <div class="stat-card"><div class="label">Active students</div><div class="value">${state === "empty" ? 0 : "8,412"}</div></div>
        <div class="stat-card"><div class="label">Active tutors</div><div class="value">${state === "empty" ? 0 : 926}</div></div>
        <div class="stat-card"><div class="label">Bookings this week</div><div class="value">${state === "empty" ? 0 : 1340}</div></div>
        <div class="stat-card"><div class="label">GMV this week</div><div class="value">$${state === "empty" ? 0 : "28,110"}</div></div>
        <div class="stat-card"><div class="label">Open disputes</div><div class="value">${state === "empty" ? 0 : 3}</div></div>
      `;
        }
        renderQueue("applicationsQueue", state === "empty" ? [] : [
            { id: "a1", title: "Noah Bernard — French", sub: "Applied 2 days ago · 1 subject · video missing" },
            { id: "a2", title: "Kenji Watanabe — Programming", sub: "Applied today · 2 subjects · complete profile" },
        ], "application", state);
        renderQueue("reportsQueue", state === "empty" ? [] : [
            { id: "r1", title: "Reported review on Ana Ruiz's profile", sub: "Reason: spam · reported by a tutor" },
        ], "report", state);
        renderQueue("disputesQueue", state === "empty" ? [] : [
            { id: "d1", title: "No-show dispute — booking #4821", sub: "Student claims tutor didn't join the lesson" },
        ], "dispute", state);
    }
    MentorApp.initAdmin = initAdmin;
    function renderQueue(hostId, items, kind, state) {
        const host = document.getElementById(hostId);
        if (state === "loading") {
            host.innerHTML = MentorApp.skeletonRow();
            return;
        }
        if (state === "error") {
            host.innerHTML = "";
            return;
        }
        if (!items.length) {
            const copy = { application: "No pending applications 🎉", report: "No reports to review", dispute: "No open disputes" };
            host.innerHTML = MentorApp.emptyState("✅", copy[kind], "Nothing needs your attention here right now.");
            return;
        }
        host.innerHTML = items.map((it) => `
      <div class="queue-item" data-item="${it.id}">
        <div style="flex:1;"><strong>${MentorApp.escapeHtml(it.title)}</strong><div style="font-size:12px; color:var(--color-text-muted);">${MentorApp.escapeHtml(it.sub)}</div></div>
        <div style="display:flex; gap:6px;">
          ${kind === "application" ? `
            <button class="btn btn-primary btn-sm" data-approve="${it.id}">Approve</button>
            <button class="btn btn-ghost btn-sm" data-reject="${it.id}">Reject</button>
          ` : kind === "report" ? `
            <button class="btn btn-danger btn-sm" data-remove="${it.id}">Remove content</button>
            <button class="btn btn-ghost btn-sm" data-dismiss="${it.id}">Dismiss</button>
          ` : `
            <button class="btn btn-primary btn-sm" data-refund="${it.id}">Refund student</button>
            <button class="btn btn-ghost btn-sm" data-deny="${it.id}">Deny claim</button>
          `}
        </div>
      </div>
    `).join("");
        host.querySelectorAll("[data-approve]").forEach((b) => b.addEventListener("click", () => resolveItem(b, "Application approved")));
        host.querySelectorAll("[data-reject]").forEach((b) => b.addEventListener("click", async () => {
            const ok = await MentorApp.confirmDialog({ title: "Reject application?", body: "Add an internal/applicant-facing note in a real flow.", confirmLabel: "Reject", danger: true });
            if (ok)
                resolveItem(b, "Application rejected");
        }));
        host.querySelectorAll("[data-remove]").forEach((b) => b.addEventListener("click", () => resolveItem(b, "Content removed")));
        host.querySelectorAll("[data-dismiss]").forEach((b) => b.addEventListener("click", () => resolveItem(b, "Report dismissed")));
        host.querySelectorAll("[data-refund]").forEach((b) => b.addEventListener("click", () => resolveItem(b, "Refund issued to student")));
        host.querySelectorAll("[data-deny]").forEach((b) => b.addEventListener("click", () => resolveItem(b, "Claim denied")));
    }
    function resolveItem(btn, message) {
        var _a;
        MentorApp.toast(message, "success");
        (_a = btn.closest(".queue-item")) === null || _a === void 0 ? void 0 : _a.remove();
    }
})(MentorApp || (MentorApp = {}));
