namespace MentorApp {

  interface MockLesson { id: string; tutorId: string; day: string; time: string; status: "upcoming" | "past"; subject: string; }

  function mockLessons(): MockLesson[] {
    const list: MockLesson[] = [
      { id: "l-past-1", tutorId: "t-ana-ruiz", day: "2026-10-05", time: "18:00", status: "past", subject: "Spanish" },
      { id: "l-past-2", tutorId: "t-james-oliver", day: "2026-09-28", time: "09:00", status: "past", subject: "Programming" },
    ];
    const lastRaw = localStorage.getItem("mentorapp_last_booking");
    if (lastRaw) {
      const last = JSON.parse(lastRaw);
      if (last.day) list.unshift({ id: "l-upcoming-1", tutorId: last.tutorId, day: last.day, time: last.time, status: "upcoming", subject: tutorById(last.tutorId)?.subjects[0] || "" });
    }
    list.push({ id: "l-upcoming-2", tutorId: "t-sara-kim", day: "2026-10-24", time: "16:00", status: "upcoming", subject: "Mathematics" });
    return list;
  }

  // ------------------------------------------------------------ Student dashboard
  export function initDashboard(): void {
    if (!requireAuth("dashboard.html", ["student"])) { location.href = "index.html"; return; }
    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    const tabs = document.querySelectorAll<HTMLElement>("#dashboardTabs button");
    tabs.forEach((btn) => btn.addEventListener("click", () => {
      tabs.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderDashboardTab(btn.dataset.tab as any, state);
    }));
    renderDashboardTab("upcoming", state);
  }

  function renderDashboardTab(tab: "upcoming" | "past" | "favorites", state: DemoState): void {
    const host = document.getElementById("dashboardContent")!;
    if (state === "loading") { host.innerHTML = Array.from({ length: 3 }).map(() => skeletonRow()).join(""); return; }
    if (state === "error") {
      host.innerHTML = errorState("Couldn't load your lessons.");
      document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
      return;
    }

    if (tab === "favorites") {
      const favIds = state === "empty" ? [] : Store.get().favorites;
      const favTutors = tutors.filter((t) => favIds.includes(t.id));
      host.innerHTML = favTutors.length
        ? `<div class="grid-cards static">${favTutors.map((t) => tutorCardHtml(t, "grid")).join("")}</div>`
        : emptyState("🤍", "You haven't saved any tutors yet", "Browse tutors and tap the heart icon to save your favorites.", '<a class="btn btn-primary" href="search.html">Find a tutor</a>');
      wireTutorCards(host);
      return;
    }

    const lessons = state === "empty" ? [] : mockLessons().filter((l) => l.status === tab);
    if (!lessons.length) {
      host.innerHTML = tab === "upcoming"
        ? emptyState("📅", "No upcoming lessons yet", "Find a tutor and book your first trial lesson.", '<a class="btn btn-primary" href="search.html">Find a tutor</a>')
        : emptyState("🗂️", "No past lessons yet", "Your completed lessons will show up here.");
      return;
    }

    host.innerHTML = lessons.map((l) => {
      const t = tutorById(l.tutorId)!;
      return `
        <div class="lesson-card" style="margin-bottom:12px;" data-lesson-id="${l.id}">
          <div class="avatar">${t.avatarEmoji}</div>
          <div>
            <strong>${escapeHtml(t.name)}</strong> — ${escapeHtml(l.subject)}
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

    host.querySelectorAll<HTMLElement>("[data-join]").forEach((b) => b.addEventListener("click", () => location.href = `lesson-room.html?lesson=${b.dataset.join}`));
    host.querySelectorAll<HTMLElement>("[data-reschedule]").forEach((b) => b.addEventListener("click", () => {
      const lesson = mockLessons().find((l) => l.id === b.dataset.reschedule)!;
      location.href = `booking.html?tutor=${lesson.tutorId}`;
    }));
    host.querySelectorAll<HTMLElement>("[data-cancel]").forEach((b) => b.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Cancel this lesson?", body: "Free cancellation up to 4 hours before the lesson. After that, the lesson credit will be used.", confirmLabel: "Cancel lesson", danger: true });
      if (ok) {
        if (b.dataset.cancel === "l-upcoming-1") localStorage.removeItem("mentorapp_last_booking");
        toast("Lesson cancelled.", "success");
        renderDashboardTab("upcoming", "success");
      }
    }));
  }

  // ------------------------------------------------------------ Billing
  export function initBilling(): void {
    if (!requireAuth("billing.html", ["student"])) { location.href = "index.html"; return; }
    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    const methodsHost = document.getElementById("paymentMethods")!;
    const invoicesHost = document.getElementById("invoicesTableBody")!;

    if (state === "loading") {
      methodsHost.innerHTML = skeletonRow();
      invoicesHost.innerHTML = `<tr><td colspan="4">${skeletonLine()}</td></tr>`;
      return;
    }
    if (state === "error") {
      methodsHost.innerHTML = errorState("Couldn't load billing information.");
      document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
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
    document.getElementById("removeCardBtn")?.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Remove this payment method?", body: "You have an active package with auto-renew enabled. Removing your only payment method will pause auto-renew.", confirmLabel: "Remove anyway", danger: true });
      if (ok) toast("Payment method removed.", "success");
    });

    if (state === "empty") {
      invoicesHost.innerHTML = `<tr><td colspan="4">${emptyState("🧾", "No invoices yet", "Invoices appear here after your first paid lesson.")}</td></tr>`;
      return;
    }
    const rows = [
      { desc: "Trial lesson — Ana Ruiz", date: "2026-10-05", amount: 9 },
      { desc: "4-lesson package — James Oliver", date: "2026-09-20", amount: 128 },
    ];
    invoicesHost.innerHTML = rows.map((r) => `
      <tr><td>${escapeHtml(r.desc)}</td><td>${r.date}</td><td>$${r.amount.toFixed(2)}</td><td><a class="btn-link" href="#" onclick="return false;">Download</a></td></tr>
    `).join("");

    document.getElementById("cancelRenewalToggle")?.addEventListener("change", (e) => {
      toast((e.target as HTMLInputElement).checked ? "Auto-renew re-enabled." : "Auto-renew cancelled — your package stays active until it runs out.", "success");
    });
  }

  // ------------------------------------------------------------ Messages
  export function initMessages(): void {
    if (!requireAuth("messages.html")) { location.href = "index.html"; return; }
    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    const params = new URLSearchParams(location.search);
    const targetTutor = params.get("tutor");
    let threads = Store.get().threads;

    if (targetTutor && !threads.some((t) => t.tutorId === targetTutor)) {
      const t = tutorById(targetTutor);
      if (t) {
        Store.update((s) => ({ ...s, threads: [{ id: `th-${t.id}`, tutorId: t.id, tutorName: t.name, unread: false, messages: [] }, ...s.threads] }));
        threads = Store.get().threads;
      }
    }
    let activeId = (targetTutor && threads.find((t) => t.tutorId === targetTutor)?.id) || threads[0]?.id;

    function renderThreadList(): void {
      const listHost = document.getElementById("threadList")!;
      if (state === "loading") { listHost.innerHTML = Array.from({ length: 3 }).map(() => `<div class="skeleton" style="height:64px;margin:8px;border-radius:8px;"></div>`).join(""); return; }
      if (state === "empty" || !threads.length) {
        listHost.innerHTML = emptyState("💬", "No messages yet", "Find a tutor to start a conversation.", '<a class="btn btn-primary btn-sm" href="search.html">Find a tutor</a>');
        document.getElementById("threadView")!.innerHTML = "";
        return;
      }
      listHost.innerHTML = threads.map((t) => `
        <div class="thread-item ${t.id === activeId ? "active" : ""}" data-thread="${t.id}">
          <div class="avatar">${tutorById(t.tutorId)?.avatarEmoji || "🧑"}</div>
          <div class="thread-item__body">
            <div class="thread-item__name">${escapeHtml(t.tutorName)} ${t.unread ? '<span class="badge-dot" style="position:static;display:inline-block;"></span>' : ""}</div>
            <div class="thread-item__preview">${escapeHtml(t.messages[t.messages.length - 1]?.text || "Start the conversation…")}</div>
          </div>
        </div>
      `).join("");
      listHost.querySelectorAll<HTMLElement>("[data-thread]").forEach((el) => {
        el.addEventListener("click", () => {
          activeId = el.dataset.thread!;
          Store.update((s) => ({ ...s, threads: s.threads.map((t) => t.id === activeId ? { ...t, unread: false } : t) }));
          threads = Store.get().threads;
          renderThreadList();
          renderThreadView();
        });
      });
    }

    function renderThreadView(): void {
      const view = document.getElementById("threadView")!;
      if (state === "error") {
        view.innerHTML = errorState("Couldn't load messages.");
        document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
        return;
      }
      const thread = threads.find((t) => t.id === activeId);
      if (!thread) { view.innerHTML = ""; return; }
      const t = tutorById(thread.tutorId)!;
      view.innerHTML = `
        <div class="thread-header"><div class="avatar">${t.avatarEmoji}</div><div><strong>${escapeHtml(t.name)}</strong><div style="font-size:12px;color:var(--color-text-muted);">${escapeHtml(t.headline)}</div></div></div>
        <div class="thread-messages" id="threadMessages">
          ${thread.messages.length ? thread.messages.map((m) => `
            <div class="msg-bubble ${m.from === "me" ? "mine" : ""}">${escapeHtml(m.text)}<span class="time">${m.time}</span></div>
          `).join("") : `<div style="margin:auto; color:var(--color-text-muted); font-size:13px;">Say hello to start the conversation.</div>`}
        </div>
        <form class="thread-composer" id="composerForm">
          <textarea id="composerInput" rows="1" placeholder="Write a message… (max 2000 characters)" maxlength="2000"></textarea>
          <button class="btn btn-primary" type="submit">Send</button>
        </form>
      `;
      const msgsHost = document.getElementById("threadMessages")!;
      msgsHost.scrollTop = msgsHost.scrollHeight;
      document.getElementById("composerForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("composerInput") as HTMLTextAreaElement;
        const text = input.value.trim();
        if (!text) return;
        const time = new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
        Store.update((s) => ({ ...s, threads: s.threads.map((th) => th.id === activeId ? { ...th, messages: [...th.messages, { from: "me", text, time }] } : th) }));
        threads = Store.get().threads;
        input.value = "";
        renderThreadView();
        renderThreadList();
        setTimeout(() => {
          Store.update((s) => ({ ...s, threads: s.threads.map((th) => th.id === activeId ? { ...th, messages: [...th.messages, { from: "them", text: "Thanks for your message! I'll get back to you shortly.", time: new Date().toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) }] } : th) }));
          threads = Store.get().threads;
          if (activeId === (new URLSearchParams(location.search)).get("thread")) renderThreadView();
          renderThreadView();
          renderThreadList();
        }, 1000);
      });
    }

    renderThreadList();
    renderThreadView();
  }

  // ------------------------------------------------------------ Lesson room
  export function initLessonRoom(): void {
    if (!requireAuth(location.pathname.split("/").pop() + location.search)) { location.href = "index.html"; return; }
    const stage = document.getElementById("roomStage")!;
    const connecting = document.getElementById("connectingOverlay")!;
    setTimeout(() => { connecting.style.display = "none"; stage.style.visibility = "visible"; }, 1200);

    let micOn = true, camOn = true;
    document.getElementById("toggleMic")?.addEventListener("click", (e) => {
      micOn = !micOn; (e.currentTarget as HTMLElement).textContent = micOn ? "🎤" : "🔇";
      toast(micOn ? "Microphone on" : "Microphone muted", "info");
    });
    document.getElementById("toggleCam")?.addEventListener("click", (e) => {
      camOn = !camOn; (e.currentTarget as HTMLElement).textContent = camOn ? "📷" : "🚫";
      toast(camOn ? "Camera on" : "Camera off", "info");
    });
    document.getElementById("leaveCallBtn")?.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Leave the lesson?", body: "You can mark this lesson as completed after leaving.", confirmLabel: "Leave" });
      if (ok) {
        const params = new URLSearchParams(location.search);
        const lessonId = params.get("lesson") || "l-upcoming-1";
        const tutorId = mockLessons().find((l) => l.id === lessonId)?.tutorId || tutors[0].id;
        location.href = `review.html?lesson=${lessonId}&tutor=${tutorId}`;
      }
    });

    const sidePanel = document.getElementById("sidePanelTabs");
    sidePanel?.querySelectorAll<HTMLElement>("button").forEach((btn) => {
      btn.addEventListener("click", () => {
        sidePanel.querySelectorAll("button").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".side-panel-content").forEach((p) => p.classList.remove("active"));
        document.getElementById(`sidePanel-${btn.dataset.panel}`)?.classList.add("active");
      });
    });
  }

  // ------------------------------------------------------------ Review
  export function initReview(): void {
    if (!requireAuth(location.pathname.split("/").pop() + location.search)) { location.href = "index.html"; return; }
    const params = new URLSearchParams(location.search);
    const tutorId = params.get("tutor") || tutors[0].id;
    const tutor = tutorById(tutorId)!;
    document.getElementById("reviewTutorName")!.textContent = tutor.name;
    document.getElementById("reviewTutorAvatar")!.textContent = tutor.avatarEmoji;

    let rating = 0;
    const starHost = document.getElementById("starInput")!;
    starHost.innerHTML = [1, 2, 3, 4, 5].map((i) => `<button type="button" data-star="${i}">★</button>`).join("");
    starHost.querySelectorAll<HTMLElement>("[data-star]").forEach((btn) => {
      btn.addEventListener("click", () => {
        rating = Number(btn.dataset.star);
        starHost.querySelectorAll("button").forEach((b) => b.classList.toggle("filled", Number((b as HTMLElement).dataset.star) <= rating));
        document.getElementById("ratingError")!.style.display = "none";
      });
    });

    const tagOptions = ["Patient", "Well prepared", "Fun lessons", "Knowledgeable", "Flexible"];
    const tagsHost = document.getElementById("reviewTags")!;
    const selectedTags = new Set<string>();
    tagsHost.innerHTML = tagOptions.map((t) => `<button type="button" class="chip" data-tag="${t}">${t}</button>`).join("");
    tagsHost.querySelectorAll<HTMLElement>("[data-tag]").forEach((chip) => {
      chip.addEventListener("click", () => {
        const tag = chip.dataset.tag!;
        if (selectedTags.has(tag)) { selectedTags.delete(tag); chip.classList.remove("active"); }
        else { selectedTags.add(tag); chip.classList.add("active"); }
      });
    });

    document.getElementById("reviewForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      if (rating === 0) { document.getElementById("ratingError")!.style.display = "block"; return; }
      const btn = document.getElementById("submitReviewBtn") as HTMLButtonElement;
      btn.disabled = true; btn.textContent = "Submitting…";
      setTimeout(() => {
        document.getElementById("reviewFormCard")!.innerHTML = `
          <div class="state-icon">🎉</div>
          <h3>Thanks for your feedback!</h3>
          <p>Your review helps other students choose the right tutor.</p>
          <a class="btn btn-primary" href="dashboard.html">Back to dashboard</a>
        `;
      }, 700);
    });
    document.getElementById("skipReviewLink")?.addEventListener("click", (e) => { e.preventDefault(); location.href = "dashboard.html"; });
  }
}
