"use strict";
var MentorApp;
(function (MentorApp) {
    function mockLessons() {
        var _a;
        const list = [
            { id: "l-past-1", tutorId: "t-ana-ruiz", day: "2026-10-05", time: "18:00", status: "past", subject: "Spanish" },
            { id: "l-past-2", tutorId: "t-james-oliver", day: "2026-09-28", time: "09:00", status: "past", subject: "Programming" },
        ];
        const lastRaw = localStorage.getItem("mentorapp_last_booking");
        if (lastRaw) {
            const last = JSON.parse(lastRaw);
            if (last.day)
                list.unshift({ id: "l-upcoming-1", tutorId: last.tutorId, day: last.day, time: last.time, status: "upcoming", subject: ((_a = MentorApp.tutorById(last.tutorId)) === null || _a === void 0 ? void 0 : _a.subjects[0]) || "" });
        }
        list.push({ id: "l-upcoming-2", tutorId: "t-sara-kim", day: "2026-10-24", time: "16:00", status: "upcoming", subject: "Mathematics" });
        return list;
    }
    // ------------------------------------------------------------ Student dashboard
    function initDashboard() {
        if (!MentorApp.requireAuth("dashboard.html", ["student"])) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const tabs = document.querySelectorAll("#dashboardTabs button");
        tabs.forEach((btn) => btn.addEventListener("click", () => {
            tabs.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            renderDashboardTab(btn.dataset.tab, state);
        }));
        renderDashboardTab("upcoming", state);
    }
    MentorApp.initDashboard = initDashboard;
    function renderDashboardTab(tab, state) {
        var _a;
        const host = document.getElementById("dashboardContent");
        if (state === "loading") {
            host.innerHTML = Array.from({ length: 3 }).map(() => MentorApp.skeletonRow()).join("");
            return;
        }
        if (state === "error") {
            host.innerHTML = MentorApp.errorState("Couldn't load your lessons.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            return;
        }
        if (tab === "favorites") {
            const favIds = state === "empty" ? [] : MentorApp.Store.get().favorites;
            const favTutors = MentorApp.tutors.filter((t) => favIds.includes(t.id));
            host.innerHTML = favTutors.length
                ? `<div class="grid-cards static">${favTutors.map((t) => MentorApp.tutorCardHtml(t, "grid")).join("")}</div>`
                : MentorApp.emptyState("🤍", "You haven't saved any tutors yet", "Browse tutors and tap the heart icon to save your favorites.", '<a class="btn btn-primary" href="search.html">Find a tutor</a>');
            MentorApp.wireTutorCards(host);
            return;
        }
        const lessons = state === "empty" ? [] : mockLessons().filter((l) => l.status === tab);
        if (!lessons.length) {
            host.innerHTML = tab === "upcoming"
                ? MentorApp.emptyState("📅", "No upcoming lessons yet", "Find a tutor and book your first trial lesson.", '<a class="btn btn-primary" href="search.html">Find a tutor</a>')
                : MentorApp.emptyState("🗂️", "No past lessons yet", "Your completed lessons will show up here.");
            return;
        }
        host.innerHTML = lessons.map((l) => {
            const t = MentorApp.tutorById(l.tutorId);
            return `
        <div class="lesson-card" style="margin-bottom:12px;" data-lesson-id="${l.id}">
          <div class="avatar">${t.avatarEmoji}</div>
          <div>
            <strong>${MentorApp.escapeHtml(t.name)}</strong> — ${MentorApp.escapeHtml(l.subject)}
            <div class="lesson-card__meta">${l.day} at ${l.time}</div>
          </div>
          <div class="lesson-card__actions">
            ${tab === "upcoming" ? `
              <button class="btn btn-primary btn-sm" data-join="${l.id}">Join lesson</button>
              <button class="btn btn-ghost btn-sm" data-reschedule="${l.id}">Reschedule</button>
              <button class="btn btn-ghost btn-sm" data-cancel="${l.id}">Cancel</button>
            ` : `
              <a class="btn btn-secondary btn-sm" href="review.html?lesson=${l.id}&tutor=${t.id}">Leave a review</a>
              <a class="btn btn-ghost btn-sm" href="messages.html?tutor=${t.id}">Message</a>
            `}
          </div>
        </div>
      `;
        }).join("");
        host.querySelectorAll("[data-join]").forEach((b) => b.addEventListener("click", () => location.href = `lesson-room.html?lesson=${b.dataset.join}`));
        host.querySelectorAll("[data-reschedule]").forEach((b) => b.addEventListener("click", () => {
            const lesson = mockLessons().find((l) => l.id === b.dataset.reschedule);
            location.href = `booking.html?tutor=${lesson.tutorId}`;
        }));
        host.querySelectorAll("[data-cancel]").forEach((b) => b.addEventListener("click", async () => {
            const ok = await MentorApp.confirmDialog({ title: "Cancel this lesson?", body: "Free cancellation up to 4 hours before the lesson. After that, the lesson credit will be used.", confirmLabel: "Cancel lesson", danger: true });
            if (ok) {
                if (b.dataset.cancel === "l-upcoming-1")
                    localStorage.removeItem("mentorapp_last_booking");
                MentorApp.toast("Lesson cancelled.", "success");
                renderDashboardTab("upcoming", "success");
            }
        }));
    }
    // ------------------------------------------------------------ Billing
    function initBilling() {
        var _a, _b, _c;
        if (!MentorApp.requireAuth("billing.html", ["student"])) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const methodsHost = document.getElementById("paymentMethods");
        const invoicesHost = document.getElementById("invoicesTableBody");
        if (state === "loading") {
            methodsHost.innerHTML = MentorApp.skeletonRow();
            invoicesHost.innerHTML = `<tr><td colspan="4">${MentorApp.skeletonLine()}</td></tr>`;
            return;
        }
        if (state === "error") {
            methodsHost.innerHTML = MentorApp.errorState("Couldn't load billing information.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            invoicesHost.innerHTML = "";
            return;
        }
        methodsHost.innerHTML = `
      <div class="request-card">
        <div style="font-size:24px;">💳</div>
        <div class="request-card__body"><strong>Visa •••• 4242</strong><div style="font-size:12px;color:var(--color-text-muted);">Expires 08/28 · Default</div></div>
        <button class="btn btn-ghost btn-sm" id="removeCardBtn">Remove</button>
      </div>
    `;
        (_b = document.getElementById("removeCardBtn")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", async () => {
            const ok = await MentorApp.confirmDialog({ title: "Remove this payment method?", body: "You have an active package with auto-renew enabled. Removing your only payment method will pause auto-renew.", confirmLabel: "Remove anyway", danger: true });
            if (ok)
                MentorApp.toast("Payment method removed.", "success");
        });
        if (state === "empty") {
            invoicesHost.innerHTML = `<tr><td colspan="4">${MentorApp.emptyState("🧾", "No invoices yet", "Invoices appear here after your first paid lesson.")}</td></tr>`;
            return;
        }
        const rows = [
            { desc: "Trial lesson — Ana Ruiz", date: "2026-10-05", amount: 9 },
            { desc: "4-lesson package — James Oliver", date: "2026-09-20", amount: 128 },
        ];
        invoicesHost.innerHTML = rows.map((r) => `
      <tr><td>${MentorApp.escapeHtml(r.desc)}</td><td>${r.date}</td><td>$${r.amount.toFixed(2)}</td><td><a class="btn-link" href="#" onclick="return false;">Download</a></td></tr>
    `).join("");
        (_c = document.getElementById("cancelRenewalToggle")) === null || _c === void 0 ? void 0 : _c.addEventListener("change", (e) => {
            MentorApp.toast(e.target.checked ? "Auto-renew re-enabled." : "Auto-renew cancelled — your package stays active until it runs out.", "success");
        });
    }
    MentorApp.initBilling = initBilling;
    // ------------------------------------------------------------ Messages
    function initMessages() {
        var _a, _b;
        if (!MentorApp.requireAuth("messages.html")) {
            location.href = "index.html";
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const params = new URLSearchParams(location.search);
        const targetTutor = params.get("tutor");
        let threads = MentorApp.Store.get().threads;
        if (targetTutor && !threads.some((t) => t.tutorId === targetTutor)) {
            const t = MentorApp.tutorById(targetTutor);
            if (t) {
                MentorApp.Store.update((s) => ({ ...s, threads: [{ id: `th-${t.id}`, tutorId: t.id, tutorName: t.name, unread: false, messages: [] }, ...s.threads] }));
                threads = MentorApp.Store.get().threads;
            }
        }
        let activeId = (targetTutor && ((_a = threads.find((t) => t.tutorId === targetTutor)) === null || _a === void 0 ? void 0 : _a.id)) || ((_b = threads[0]) === null || _b === void 0 ? void 0 : _b.id);
        function renderThreadList() {
            const listHost = document.getElementById("threadList");
            if (state === "loading") {
                listHost.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton" style="height:64px;margin:8px;border-radius:8px;"></div>`).join("");
                return;
            }
            if (state === "empty" || !threads.length) {
                listHost.innerHTML = MentorApp.emptyState("💬", "No messages yet", "Find a tutor to start a conversation.", '<a class="btn btn-primary btn-sm" href="search.html">Find a tutor</a>');
                document.getElementById("threadView").innerHTML = "";
                return;
            }
            listHost.innerHTML = threads.map((t) => {
                var _a, _b;
                return `
        <div class="thread-item ${t.id === activeId ? "active" : ""}" data-thread="${t.id}">
          <div class="avatar">${((_a = MentorApp.tutorById(t.tutorId)) === null || _a === void 0 ? void 0 : _a.avatarEmoji) || "🧑"}</div>
          <div class="thread-item__body">
            <div class="thread-item__name">${MentorApp.escapeHtml(t.tutorName)} ${t.unread ? '<span class="badge-dot" style="position:static;display:inline-block;"></span>' : ""}</div>
            <div class="thread-item__preview">${MentorApp.escapeHtml(((_b = t.messages[t.messages.length - 1]) === null || _b === void 0 ? void 0 : _b.text) || "Start the conversation…")}</div>
          </div>
        </div>
      `;
            }).join("");
            listHost.querySelectorAll("[data-thread]").forEach((el) => {
                el.addEventListener("click", () => {
                    activeId = el.dataset.thread;
                    MentorApp.Store.update((s) => ({ ...s, threads: s.threads.map((t) => t.id === activeId ? { ...t, unread: false } : t) }));
                    threads = MentorApp.Store.get().threads;
                    renderThreadList();
                    renderThreadView();
                });
            });
        }
        function renderThreadView() {
            var _a, _b;
            const view = document.getElementById("threadView");
            if (state === "error") {
                view.innerHTML = MentorApp.errorState("Couldn't load messages.");
                (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
                return;
            }
            const thread = threads.find((t) => t.id === activeId);
            if (!thread) {
                view.innerHTML = "";
                return;
            }
            const t = MentorApp.tutorById(thread.tutorId);
            view.innerHTML = `
        <div class="thread-header"><div class="avatar">${t.avatarEmoji}</div><div><strong>${MentorApp.escapeHtml(t.name)}</strong><div style="font-size:12px;color:var(--color-text-muted);">${MentorApp.escapeHtml(t.headline)}</div></div></div>
        <div class="thread-messages" id="threadMessages">
          ${thread.messages.length ? thread.messages.map((m) => `
            <div class="msg-bubble ${m.from === "me" ? "mine" : ""}">${MentorApp.escapeHtml(m.text)}<span class="time">${m.time}</span></div>
          `).join("") : `<div style="margin:auto; color:var(--color-text-muted); font-size:13px;">Say hello to start the conversation.</div>`}
        </div>
        <form class="thread-composer" id="composerForm">
          <textarea id="composerInput" rows="1" placeholder="Write a message… (max 2000 characters)" maxlength="2000"></textarea>
          <button class="btn btn-primary" type="submit">Send</button>
        </form>
      `;
            const msgsHost = document.getElementById("threadMessages");
            msgsHost.scrollTop = msgsHost.scrollHeight;
            (_b = document.getElementById("composerForm")) === null || _b === void 0 ? void 0 : _b.addEventListener("submit", (e) => {
                e.preventDefault();
                const input = document.getElementById("composerInput");
                const text = input.value.trim();
                if (!text)
                    return;
                const time = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
                MentorApp.Store.update((s) => ({ ...s, threads: s.threads.map((th) => th.id === activeId ? { ...th, messages: [...th.messages, { from: "me", text, time }] } : th) }));
                threads = MentorApp.Store.get().threads;
                input.value = "";
                renderThreadView();
                renderThreadList();
                setTimeout(() => {
                    MentorApp.Store.update((s) => ({ ...s, threads: s.threads.map((th) => th.id === activeId ? { ...th, messages: [...th.messages, { from: "them", text: "Thanks for your message! I'll get back to you shortly.", time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) }] } : th) }));
                    threads = MentorApp.Store.get().threads;
                    if (activeId === (new URLSearchParams(location.search)).get("thread"))
                        renderThreadView();
                    renderThreadView();
                    renderThreadList();
                }, 1000);
            });
        }
        renderThreadList();
        renderThreadView();
    }
    MentorApp.initMessages = initMessages;
    // ------------------------------------------------------------ Lesson room
    function initLessonRoom() {
        var _a, _b, _c;
        if (!MentorApp.requireAuth(location.pathname.split("/").pop() + location.search)) {
            location.href = "index.html";
            return;
        }
        const stage = document.getElementById("roomStage");
        const connecting = document.getElementById("connectingOverlay");
        setTimeout(() => { connecting.style.display = "none"; stage.style.visibility = "visible"; }, 1200);
        let micOn = true, camOn = true;
        (_a = document.getElementById("toggleMic")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", (e) => {
            micOn = !micOn;
            e.currentTarget.textContent = micOn ? "🎤" : "🔇";
            MentorApp.toast(micOn ? "Microphone on" : "Microphone muted", "info");
        });
        (_b = document.getElementById("toggleCam")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => {
            camOn = !camOn;
            e.currentTarget.textContent = camOn ? "📷" : "🚫";
            MentorApp.toast(camOn ? "Camera on" : "Camera off", "info");
        });
        (_c = document.getElementById("leaveCallBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", async () => {
            var _a;
            const ok = await MentorApp.confirmDialog({ title: "Leave the lesson?", body: "You can mark this lesson as completed after leaving.", confirmLabel: "Leave" });
            if (ok) {
                const params = new URLSearchParams(location.search);
                const lessonId = params.get("lesson") || "l-upcoming-1";
                const tutorId = ((_a = mockLessons().find((l) => l.id === lessonId)) === null || _a === void 0 ? void 0 : _a.tutorId) || MentorApp.tutors[0].id;
                location.href = `review.html?lesson=${lessonId}&tutor=${tutorId}`;
            }
        });
        const sidePanel = document.getElementById("sidePanelTabs");
        sidePanel === null || sidePanel === void 0 ? void 0 : sidePanel.querySelectorAll("button").forEach((btn) => {
            btn.addEventListener("click", () => {
                var _a;
                sidePanel.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                document.querySelectorAll(".side-panel-content").forEach((p) => p.classList.remove("active"));
                (_a = document.getElementById(`sidePanel-${btn.dataset.panel}`)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
            });
        });
    }
    MentorApp.initLessonRoom = initLessonRoom;
    // ------------------------------------------------------------ Review
    function initReview() {
        var _a, _b;
        if (!MentorApp.requireAuth(location.pathname.split("/").pop() + location.search)) {
            location.href = "index.html";
            return;
        }
        const params = new URLSearchParams(location.search);
        const tutorId = params.get("tutor") || MentorApp.tutors[0].id;
        const tutor = MentorApp.tutorById(tutorId);
        document.getElementById("reviewTutorName").textContent = tutor.name;
        document.getElementById("reviewTutorAvatar").textContent = tutor.avatarEmoji;
        let rating = 0;
        const starHost = document.getElementById("starInput");
        starHost.innerHTML = [1, 2, 3, 4, 5].map((i) => `<button type="button" data-star="${i}">★</button>`).join("");
        starHost.querySelectorAll("[data-star]").forEach((btn) => {
            btn.addEventListener("click", () => {
                rating = Number(btn.dataset.star);
                starHost.querySelectorAll("button").forEach((b) => b.classList.toggle("filled", Number(b.dataset.star) <= rating));
                document.getElementById("ratingError").style.display = "none";
            });
        });
        const tagOptions = ["Patient", "Well prepared", "Fun lessons", "Knowledgeable", "Flexible"];
        const tagsHost = document.getElementById("reviewTags");
        const selectedTags = new Set();
        tagsHost.innerHTML = tagOptions.map((t) => `<button type="button" class="chip" data-tag="${t}">${t}</button>`).join("");
        tagsHost.querySelectorAll("[data-tag]").forEach((chip) => {
            chip.addEventListener("click", () => {
                const tag = chip.dataset.tag;
                if (selectedTags.has(tag)) {
                    selectedTags.delete(tag);
                    chip.classList.remove("active");
                }
                else {
                    selectedTags.add(tag);
                    chip.classList.add("active");
                }
            });
        });
        (_a = document.getElementById("reviewForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
            e.preventDefault();
            if (rating === 0) {
                document.getElementById("ratingError").style.display = "block";
                return;
            }
            const btn = document.getElementById("submitReviewBtn");
            btn.disabled = true;
            btn.textContent = "Submitting…";
            setTimeout(() => {
                document.getElementById("reviewFormCard").innerHTML = `
          <div class="state-icon">🎉</div>
          <h3>Thanks for your feedback!</h3>
          <p>Your review helps other students choose the right tutor.</p>
          <a class="btn btn-primary" href="dashboard.html">Back to dashboard</a>
        `;
            }, 700);
        });
        (_b = document.getElementById("skipReviewLink")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", (e) => { e.preventDefault(); location.href = "dashboard.html"; });
    }
    MentorApp.initReview = initReview;
})(MentorApp || (MentorApp = {}));
