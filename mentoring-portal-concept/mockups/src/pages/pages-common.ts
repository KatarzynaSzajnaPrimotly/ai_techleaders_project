namespace MentorApp {

  // ---------------------------------------------------------------- Home
  export function initHome(): void {
    const carousel = document.getElementById("featuredTutors")!;
    const state = demoStateFromUrl() || "success";
    renderFeatured(carousel, state);
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    const chipList = document.getElementById("subjectChips")!;
    chipList.innerHTML = subjects.map((s) => `<button class="chip" data-subject="${escapeHtml(s)}">${escapeHtml(s)}</button>`).join("");
    chipList.querySelectorAll<HTMLElement>("[data-subject]").forEach((chip) => {
      chip.addEventListener("click", () => { location.href = `search.html?subject=${encodeURIComponent(chip.dataset.subject!)}`; });
    });

    const form = document.getElementById("heroSearchForm") as HTMLFormElement;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = (document.getElementById("heroSearchInput") as HTMLInputElement).value.trim();
      location.href = q ? `search.html?subject=${encodeURIComponent(q)}` : "search.html";
    });
    wireAutocomplete("heroSearchInput", "heroSearchSuggestions");
  }

  function renderFeatured(container: HTMLElement, state: DemoState): void {
    if (state === "loading") {
      container.innerHTML = Array.from({ length: 4 }).map(() => skeletonCard()).join("");
      return;
    }
    if (state === "error") {
      container.innerHTML = "";
      container.parentElement!.style.display = "none"; // graceful degrade per spec, no hard error on homepage
      return;
    }
    if (state === "empty") {
      container.innerHTML = emptyState("🔎", "No featured tutors right now", "Check back soon, or search the full catalog.", '<a class="btn btn-primary" href="search.html">Browse all tutors</a>');
      return;
    }
    container.innerHTML = tutors.slice(0, 6).map((t) => tutorCardHtml(t, "grid")).join("");
    wireTutorCards(container);
  }

  function wireAutocomplete(inputId: string, listId: string): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const list = document.getElementById(listId) as HTMLElement;
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      if (q.length < 2) { list.classList.remove("open"); return; }
      const matches = subjects.filter((s) => s.toLowerCase().includes(q)).slice(0, 6);
      if (!matches.length) { list.classList.remove("open"); return; }
      list.innerHTML = matches.map((s) => `<li><a href="search.html?subject=${encodeURIComponent(s)}">${escapeHtml(s)}</a></li>`).join("");
      list.classList.add("open");
    });
    document.addEventListener("click", (e) => { if (e.target !== input) list.classList.remove("open"); });
  }

  // ---------------------------------------------------------- Become tutor
  export function initBecomeTutor(): void {
    const slider = document.getElementById("estHours") as HTMLInputElement;
    const rate = document.getElementById("estRate") as HTMLInputElement;
    const out = document.getElementById("estOutput")!;
    const recalc = () => {
      const monthly = Number(slider.value) * Number(rate.value) * 4.33;
      out.textContent = `$${Math.round(monthly).toLocaleString()}/month`;
    };
    slider.addEventListener("input", recalc);
    rate.addEventListener("input", recalc);
    recalc();

    document.querySelectorAll<HTMLElement>(".accordion-item button").forEach((btn) => {
      btn.addEventListener("click", () => btn.parentElement!.classList.toggle("open"));
    });

    document.getElementById("applyNowBtn")?.addEventListener("click", () => {
      location.href = "become-tutor-apply.html";
    });
  }

  // ---------------------------------------------------------- Settings
  export function initSettings(): void {
    if (!requireAuth("settings.html")) { location.href = "index.html"; return; }
    const s = Store.get();
    (document.getElementById("settingsName") as HTMLInputElement).value = s.name;
    document.getElementById("settingsForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("settingsName") as HTMLInputElement).value.trim();
      if (!name) { toast("Name can't be empty.", "error"); return; }
      Store.set({ name });
      toast("Settings saved", "success");
      renderHeaderInPlace();
    });
    document.getElementById("deleteAccountBtn")?.addEventListener("click", async () => {
      const ok = await confirmDialog({ title: "Delete your account?", body: "This can't be undone. Type DELETE to confirm in a real flow — simplified here for the demo.", confirmLabel: "Delete account", danger: true });
      if (ok) { Store.reset(); toast("Account deleted (demo).", "success"); setTimeout(() => location.href = "index.html", 800); }
    });
  }

  // ------------------------------------------------------------ Notifications
  export function initNotifications(): void {
    if (!requireAuth("notifications.html")) { location.href = "index.html"; return; }
    const state = demoStateFromUrl() || "success";
    const list = document.getElementById("notifList")!;
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    if (state === "loading") { list.innerHTML = Array.from({ length: 4 }).map(() => skeletonRow()).join(""); return; }
    if (state === "error") { list.innerHTML = errorState("We couldn't load your notifications."); document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success")); return; }
    if (state === "empty") { list.innerHTML = emptyState("🎉", "You're all caught up!", "New activity will show up here."); return; }

    const items = Store.get().notifications;
    list.innerHTML = items.map((n) => `
      <a class="notification-item ${n.unread ? "unread" : ""}" href="${n.href}" data-notif-id="${n.id}">
        <div class="icon">${n.icon}</div>
        <div style="flex:1;">
          <div>${escapeHtml(n.text)}</div>
          <div style="font-size:12px; color:var(--color-text-muted); margin-top:4px;">${n.time}</div>
        </div>
      </a>
    `).join("");
    list.querySelectorAll<HTMLElement>("[data-notif-id]").forEach((el) => {
      el.addEventListener("click", () => {
        Store.update((st) => ({ ...st, notifications: st.notifications.map((n) => n.id === el.dataset.notifId ? { ...n, unread: false } : n) }));
      });
    });
    document.getElementById("markAllReadBtn")?.addEventListener("click", () => {
      Store.update((st) => ({ ...st, notifications: st.notifications.map((n) => ({ ...n, unread: false })) }));
      toast("All notifications marked as read", "success");
      initNotifications();
    });
  }
}
