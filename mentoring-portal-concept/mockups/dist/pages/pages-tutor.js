"use strict";
var MentorApp;
(function (MentorApp) {
    // ------------------------------------------------------------ Tutor application wizard
    function initTutorApply() {
        var _a, _b;
        let step = 1;
        const totalSteps = 3;
        const data = { subjects: [], experience: "", bio: "", rate: 20, slots: new Set() };
        function renderSteps() {
            document.querySelectorAll(".wizard-step").forEach((el) => {
                const n = Number(el.dataset.step);
                el.classList.toggle("active", n === step);
                el.classList.toggle("done", n < step);
            });
            document.querySelectorAll(".wizard-panel").forEach((el) => {
                el.style.display = Number(el.dataset.panel) === step ? "block" : "none";
            });
            document.getElementById("wizardBackBtn").style.visibility = step === 1 ? "hidden" : "visible";
            const nextBtn = document.getElementById("wizardNextBtn");
            nextBtn.textContent = step === totalSteps ? "Submit application" : "Continue";
        }
        const subjectHost = document.getElementById("subjectCheckboxes");
        subjectHost.innerHTML = MentorApp.subjects.map((s) => `<label class="checkbox-row" style="margin-bottom:8px;"><input type="checkbox" value="${s}" class="subject-cb"/> ${s}</label>`).join("");
        const availHost = document.getElementById("availabilityGrid");
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9:00", "12:00", "15:00", "18:00", "21:00"];
        availHost.innerHTML = `<div class="cell head"></div>${days.map((d) => `<div class="cell head">${d}</div>`).join("")}` +
            hours.map((h) => `<div class="cell head">${h}</div>${days.map((d) => `<div class="cell" data-slot="${d}-${h}"></div>`).join("")}`).join("");
        availHost.querySelectorAll("[data-slot]").forEach((cell) => {
            cell.addEventListener("click", () => {
                const slot = cell.dataset.slot;
                if (data.slots.has(slot)) {
                    data.slots.delete(slot);
                    cell.classList.remove("on");
                }
                else {
                    data.slots.add(slot);
                    cell.classList.add("on");
                }
            });
        });
        function validateStep() {
            if (step === 1) {
                const checked = Array.from(subjectHost.querySelectorAll(".subject-cb:checked")).map((c) => c.value);
                const experience = document.getElementById("experienceSelect").value;
                const ok1 = checked.length > 0;
                const ok2 = !!experience;
                setValidityBlock("field-subjects", ok1, "Select at least one subject.");
                setValidityBlock("field-experience", ok2, "Select your experience level.");
                if (ok1 && ok2) {
                    data.subjects = checked;
                    data.experience = experience;
                }
                return ok1 && ok2;
            }
            if (step === 2) {
                const bio = document.getElementById("bioTextarea").value;
                const ok = bio.trim().length >= 100;
                setValidityBlock("field-bio", ok, "Bio must be at least 100 characters so students know what to expect.");
                if (ok)
                    data.bio = bio;
                return ok;
            }
            if (step === 3) {
                const rate = Number(document.getElementById("rateInput").value);
                const okRate = rate >= 5 && rate <= 100;
                const okSlots = data.slots.size >= 3;
                setValidityBlock("field-rate", okRate, "Rate must be between $5 and $100.");
                setValidityBlock("field-availability", okSlots, "Select at least 3 available time slots per week.");
                if (okRate)
                    data.rate = rate;
                return okRate && okSlots;
            }
            return true;
        }
        function setValidityBlock(fieldId, valid, _msg) {
            var _a;
            (_a = document.getElementById(fieldId)) === null || _a === void 0 ? void 0 : _a.classList.toggle("invalid", !valid);
        }
        (_a = document.getElementById("wizardNextBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            if (!validateStep())
                return;
            if (step < totalSteps) {
                step++;
                renderSteps();
                return;
            }
            const btn = document.getElementById("wizardNextBtn");
            btn.disabled = true;
            btn.textContent = "Submitting…";
            setTimeout(() => {
                MentorApp.Store.set({ applicationStatus: "pending" });
                if (!MentorApp.Store.get().auth)
                    MentorApp.login("tutor", "Jordan (Tutor)");
                location.href = "become-tutor-submitted.html";
            }, 700);
        });
        (_b = document.getElementById("wizardBackBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { if (step > 1) {
            step--;
            renderSteps();
        } });
        renderSteps();
    }
    MentorApp.initTutorApply = initTutorApply;
    function initApplicationSubmitted() {
        const status = MentorApp.demoStateFromUrl() === "error" ? "rejected" : MentorApp.demoStateFromUrl() === "empty" ? "approved" : (MentorApp.Store.get().applicationStatus === "none" ? "pending" : MentorApp.Store.get().applicationStatus);
        document.getElementById("devToolbarSlot").innerHTML = `
      <div class="dev-toolbar">
        <span>Simulate outcome:</span>
        <button data-outcome="pending" class="${status === "pending" ? "active" : ""}">Pending</button>
        <button data-outcome="approved" class="${status === "approved" ? "active" : ""}">Approved</button>
        <button data-outcome="rejected" class="${status === "rejected" ? "active" : ""}">Rejected</button>
      </div>
    `;
        document.querySelectorAll("[data-outcome]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const o = btn.dataset.outcome;
                const map = { pending: "success", approved: "empty", rejected: "error" };
                const p = new URLSearchParams(location.search);
                p.set("state", map[o]);
                location.search = p.toString();
            });
        });
        const root = document.getElementById("submittedRoot");
        if (status === "approved") {
            MentorApp.Store.set({ applicationStatus: "approved" });
            root.innerHTML = `
        <div class="state-icon">🎉</div>
        <h3>You're approved!</h3>
        <p>Congratulations — your tutor profile is now live and searchable on Mentora.</p>
        <a class="btn btn-primary" href="tutor-dashboard.html">Go to your Tutor Dashboard</a>
      `;
        }
        else if (status === "rejected") {
            MentorApp.Store.set({ applicationStatus: "rejected" });
            root.innerHTML = `
        <div class="state-icon">📋</div>
        <h3>Your application needs changes</h3>
        <p>Reason: your introduction video is required for approval. Please add one and resubmit.</p>
        <a class="btn btn-primary" href="become-tutor-apply.html">Edit & resubmit</a>
      `;
        }
        else {
            root.innerHTML = `
        <div class="state-icon">⏳</div>
        <h3>Application submitted</h3>
        <p>Thanks for applying! Our team typically reviews new applications within 2–3 business days. We'll email you as soon as there's an update.</p>
        <div style="display:flex; gap:8px; justify-content:center;">
          <a class="btn btn-secondary" href="become-tutor-apply.html">Edit application</a>
          <a class="btn btn-ghost" href="index.html">Back to home</a>
        </div>
      `;
        }
    }
    MentorApp.initApplicationSubmitted = initApplicationSubmitted;
    // ------------------------------------------------------------ Tutor dashboard overview
    function initTutorDashboard() {
        var _a;
        if (!MentorApp.requireAuth("tutor-dashboard.html", ["tutor"])) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const stats = document.getElementById("tutorStats");
        const pending = document.getElementById("pendingRequests");
        const recentReviews = document.getElementById("recentReviews");
        if (state === "loading") {
            stats.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton" style="height:84px;border-radius:12px;"></div>`).join("");
            pending.innerHTML = MentorApp.skeletonRow();
            recentReviews.innerHTML = MentorApp.skeletonRow();
            return;
        }
        if (state === "error") {
            stats.innerHTML = MentorApp.errorState("Couldn't load your dashboard summary.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            pending.innerHTML = "";
            recentReviews.innerHTML = "";
            return;
        }
        stats.innerHTML = `
      <div class="stat-card"><div class="label">Upcoming lessons</div><div class="value">${state === "empty" ? 0 : 4}</div></div>
      <div class="stat-card"><div class="label">Pending requests</div><div class="value">${state === "empty" ? 0 : 2}</div></div>
      <div class="stat-card"><div class="label">Earnings this month</div><div class="value">$${state === "empty" ? 0 : 640}</div></div>
    `;
        if (state === "empty") {
            pending.innerHTML = MentorApp.emptyState("📭", "No bookings yet", "Make sure your profile stands out to get your first student.", '<a class="btn btn-primary" href="settings.html">Edit profile</a>');
            recentReviews.innerHTML = "";
            return;
        }
        pending.innerHTML = [
            { student: "Michael B.", subject: "Spanish", day: "Tomorrow, 10:00" },
            { student: "Elif K.", subject: "Spanish", day: "Fri, 14:00" },
        ].map((r, i) => `
      <div class="request-card" style="margin-bottom:10px;" data-request="${i}">
        <div class="avatar">🧑</div>
        <div class="request-card__body"><strong>${r.student}</strong> wants to book a ${r.subject} lesson — ${r.day}</div>
        <div style="display:flex; gap:6px;">
          <button class="btn btn-primary btn-sm" data-accept="${i}">Accept</button>
          <button class="btn btn-ghost btn-sm" data-decline="${i}">Decline</button>
        </div>
      </div>
    `).join("");
        pending.querySelectorAll("[data-accept]").forEach((b) => b.addEventListener("click", () => {
            var _a;
            MentorApp.toast("Booking accepted", "success");
            (_a = b.closest(".request-card")) === null || _a === void 0 ? void 0 : _a.remove();
        }));
        pending.querySelectorAll("[data-decline]").forEach((b) => b.addEventListener("click", async () => {
            var _a;
            const ok = await MentorApp.confirmDialog({ title: "Decline this request?", body: "The student will be notified and shown alternate times.", confirmLabel: "Decline", danger: true });
            if (ok) {
                MentorApp.toast("Booking declined", "success");
                (_a = b.closest(".request-card")) === null || _a === void 0 ? void 0 : _a.remove();
            }
        }));
        recentReviews.innerHTML = MentorApp.reviewsForTutor("t-ana-ruiz").slice(0, 2).map((r) => `
      <div class="review-item"><div class="review-item__head"><strong>${r.studentName}</strong><span class="stars">${MentorApp.starsHtml(r.rating)}</span></div><p style="font-size:13px;">${MentorApp.escapeHtml(r.comment)}</p></div>
    `).join("");
    }
    MentorApp.initTutorDashboard = initTutorDashboard;
    // ------------------------------------------------------------ Tutor calendar
    function initTutorCalendar() {
        var _a, _b, _c;
        if (!MentorApp.requireAuth("tutor-calendar.html", ["tutor"])) {
            location.href = "index.html";
            return;
        }
        const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const hours = ["9:00", "12:00", "15:00", "18:00", "21:00"];
        const grid = document.getElementById("tutorAvailGrid");
        const on = new Set(["Mon-9:00", "Mon-18:00", "Wed-9:00", "Fri-15:00"]);
        grid.innerHTML = `<div class="cell head"></div>${days.map((d) => `<div class="cell head">${d}</div>`).join("")}` +
            hours.map((h) => `<div class="cell head">${h}</div>${days.map((d) => `<div class="cell ${on.has(`${d}-${h}`) ? "on" : ""}" data-slot="${d}-${h}"></div>`).join("")}`).join("");
        grid.querySelectorAll("[data-slot]").forEach((cell) => {
            cell.addEventListener("click", () => cell.classList.toggle("on"));
        });
        (_a = document.getElementById("saveAvailabilityBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.toast("Availability updated", "success"));
        (_b = document.getElementById("instantBookToggle")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (e) => {
            MentorApp.toast(e.target.checked ? "Instant book enabled" : "Requests now require your approval", "info");
        });
        (_c = document.getElementById("connectGoogleBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => MentorApp.toast("Connected to Google Calendar (demo).", "success"));
    }
    MentorApp.initTutorCalendar = initTutorCalendar;
    // ------------------------------------------------------------ Tutor bookings
    function initTutorBookings() {
        if (!MentorApp.requireAuth("tutor-bookings.html", ["tutor"])) {
            location.href = "index.html";
            return;
        }
        const tabs = document.querySelectorAll("#tutorBookingTabs button");
        const host = document.getElementById("tutorBookingContent");
        const data = {
            pending: [{ name: "Michael B.", info: "Spanish · Tomorrow 10:00" }],
            upcoming: [{ name: "Elena R.", info: "Spanish · Fri 14:00" }],
            past: [{ name: "Julia T.", info: "Spanish · Oct 5, 18:00" }],
            cancelled: [],
        };
        function render(tab) {
            const items = data[tab] || [];
            if (!items.length) {
                host.innerHTML = MentorApp.emptyState("📭", `No ${tab} bookings`, tab === "pending" ? "New requests will appear here." : "Nothing to show yet.");
                return;
            }
            host.innerHTML = items.map((it) => `
        <div class="request-card" style="margin-bottom:10px;">
          <div class="avatar">🧑</div>
          <div class="request-card__body"><strong>${it.name}</strong><div style="font-size:12px;color:var(--color-text-muted);">${it.info}</div></div>
          ${tab === "pending" ? `<div style="display:flex;gap:6px;"><button class="btn btn-primary btn-sm" data-ok>Accept</button><button class="btn btn-ghost btn-sm" data-no>Decline</button></div>` :
                tab === "upcoming" ? `<button class="btn btn-ghost btn-sm" data-reschedule>Propose reschedule</button>` :
                    tab === "past" ? `<button class="btn btn-ghost btn-sm" data-complete>Mark completed</button>` : ""}
        </div>
      `).join("");
            host.querySelectorAll("[data-ok]").forEach((b) => b.addEventListener("click", () => { var _a; MentorApp.toast("Accepted", "success"); (_a = b.closest(".request-card")) === null || _a === void 0 ? void 0 : _a.remove(); }));
            host.querySelectorAll("[data-no]").forEach((b) => b.addEventListener("click", () => { var _a; MentorApp.toast("Declined", "success"); (_a = b.closest(".request-card")) === null || _a === void 0 ? void 0 : _a.remove(); }));
            host.querySelectorAll("[data-reschedule]").forEach((b) => b.addEventListener("click", () => MentorApp.toast("Reschedule proposal sent to student.", "success")));
            host.querySelectorAll("[data-complete]").forEach((b) => b.addEventListener("click", () => MentorApp.toast("Lesson marked as completed.", "success")));
        }
        tabs.forEach((btn) => btn.addEventListener("click", () => {
            tabs.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            render(btn.dataset.tab);
        }));
        render("pending");
    }
    MentorApp.initTutorBookings = initTutorBookings;
    // ------------------------------------------------------------ Tutor earnings
    function initTutorEarnings() {
        var _a, _b;
        if (!MentorApp.requireAuth("tutor-earnings.html", ["tutor"])) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const summary = document.getElementById("earningsSummary");
        const table = document.getElementById("earningsTableBody");
        if (state === "loading") {
            summary.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton" style="height:84px;border-radius:12px;"></div>`).join("");
            table.innerHTML = `<tr><td colspan="4">${MentorApp.skeletonLine()}</td></tr>`;
            return;
        }
        if (state === "error") {
            summary.innerHTML = MentorApp.errorState("Couldn't load earnings.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            table.innerHTML = "";
            return;
        }
        summary.innerHTML = `
      <div class="stat-card"><div class="label">Available balance</div><div class="value">$${state === "empty" ? 0 : 212}</div></div>
      <div class="stat-card"><div class="label">Pending</div><div class="value">$${state === "empty" ? 0 : 64}</div></div>
      <div class="stat-card"><div class="label">Lifetime earnings</div><div class="value">$${state === "empty" ? 0 : 4820}</div></div>
    `;
        if (state === "empty") {
            table.innerHTML = `<tr><td colspan="4">${MentorApp.emptyState("💳", "No earnings yet", "Your completed lessons will appear here.")}</td></tr>`;
            return;
        }
        const rows = [
            { student: "Michael B.", date: "2026-10-12", amount: 18, fee: 3.6 },
            { student: "Julia T.", date: "2026-10-05", amount: 18, fee: 3.6 },
            { student: "Devon P.", date: "2026-09-28", amount: 18, fee: 3.6 },
        ];
        table.innerHTML = rows.map((r) => `
      <tr><td>${r.student}</td><td>${r.date}</td><td>$${r.amount.toFixed(2)}</td><td>$${(r.amount - r.fee).toFixed(2)}</td></tr>
    `).join("");
        (_b = document.getElementById("requestPayoutBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
            MentorApp.toast("Payout requested — funds typically arrive in 3–5 business days.", "success");
        });
    }
    MentorApp.initTutorEarnings = initTutorEarnings;
    // ------------------------------------------------------------ Tutor reviews
    function initTutorReviews() {
        var _a;
        if (!MentorApp.requireAuth("tutor-reviews.html", ["tutor"])) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const host = document.getElementById("tutorReviewsList");
        const summaryHost = document.getElementById("tutorRatingSummary");
        if (state === "loading") {
            summaryHost.innerHTML = MentorApp.skeletonRow();
            host.innerHTML = Array.from({ length: 2 }).map(() => MentorApp.skeletonLine()).join("");
            return;
        }
        if (state === "error") {
            summaryHost.innerHTML = MentorApp.errorState("Couldn't load reviews.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            host.innerHTML = "";
            return;
        }
        const myReviews = state === "empty" ? [] : MentorApp.reviewsForTutor("t-ana-ruiz");
        if (!myReviews.length) {
            summaryHost.innerHTML = "";
            host.innerHTML = MentorApp.emptyState("⭐", "No reviews yet", "Reviews appear here after your first completed lesson.");
            return;
        }
        const avg = myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length;
        summaryHost.innerHTML = `
      <div class="rating-summary">
        <div class="big">${avg.toFixed(1)}</div>
        <div style="flex:1;">${MentorApp.ratingDistribution("t-ana-ruiz").map((c, i) => `<div class="dist-bar"><span>${5 - i}★</span><div class="bar"><span style="width:${(c / myReviews.length) * 100}%"></span></div><span>${c}</span></div>`).join("")}</div>
      </div>
    `;
        host.innerHTML = myReviews.map((r) => `
      <div class="review-item" data-review="${r.id}">
        <div class="review-item__head"><strong>${r.studentName}</strong><span class="stars">${MentorApp.starsHtml(r.rating)}</span><span style="color:var(--color-text-muted); font-size:12px;">${r.date}</span></div>
        <p style="font-size:13px;">${MentorApp.escapeHtml(r.comment)}</p>
        <div class="reply-host"></div>
        <div style="display:flex; gap:10px; margin-top:6px;">
          <button class="btn-link" style="font-size:12px;" data-reply="${r.id}">Reply</button>
          <button class="btn-link" style="font-size:12px; color:var(--color-error);" data-flag="${r.id}">Flag</button>
        </div>
      </div>
    `).join("");
        host.querySelectorAll("[data-reply]").forEach((btn) => {
            btn.addEventListener("click", () => {
                const container = btn.closest(".review-item").querySelector(".reply-host");
                container.innerHTML = `
          <textarea class="reply-textarea" rows="2" placeholder="Write a public reply…" style="width:100%; margin-top:8px; padding:8px; border:1px solid var(--color-border); border-radius:8px; font-family:inherit;"></textarea>
          <button class="btn btn-primary btn-sm" style="margin-top:6px;" data-submit-reply="${btn.dataset.reply}">Post reply</button>
        `;
            });
        });
        host.addEventListener("click", (e) => {
            const target = e.target;
            if (target.dataset.submitReply) {
                const textarea = target.parentElement.querySelector("textarea");
                if (!textarea.value.trim()) {
                    MentorApp.toast("Reply can't be empty.", "error");
                    return;
                }
                target.parentElement.innerHTML = `<p style="font-size:12px; color:var(--color-text-muted); margin-top:6px;">Your reply: "${MentorApp.escapeHtml(textarea.value)}"</p>`;
                MentorApp.toast("Reply posted", "success");
            }
        });
        host.querySelectorAll("[data-flag]").forEach((btn) => {
            btn.addEventListener("click", async () => {
                const ok = await MentorApp.confirmDialog({ title: "Flag this review?", body: "It will be sent to our moderation team for review.", confirmLabel: "Flag review", danger: true });
                if (ok)
                    MentorApp.toast("Review reported to moderators.", "success");
            });
        });
    }
    MentorApp.initTutorReviews = initTutorReviews;
})(MentorApp || (MentorApp = {}));
