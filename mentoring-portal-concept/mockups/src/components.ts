/**
 * Shared UI building blocks (render functions returning HTML strings, plus
 * the small amount of imperative wiring each needs). Kept framework-free
 * on purpose — this is a clickable concept prototype, not production code.
 */
namespace MentorApp {

  export function escapeHtml(s: string): string {
    const div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  export function starsHtml(rating: number): string {
    const full = Math.round(rating);
    return "★".repeat(full) + "☆".repeat(5 - full);
  }

  // ---------------------------------------------------------------- Header
  export function renderHeader(active: string): string {
    const s = Store.get();
    const guestNav = `
      <a class="nav-link ${active === "search" ? "active" : ""}" href="search.html">Find a tutor</a>
      <a class="nav-link ${active === "become-tutor" ? "active" : ""}" href="become-tutor.html">Become a tutor</a>
    `;
    const studentExtra = `
      <a class="nav-link ${active === "search" ? "active" : ""}" href="search.html">Find a tutor</a>
    `;
    const tutorExtra = `
      <a class="nav-link ${active === "tutor-calendar" ? "active" : ""}" href="tutor-calendar.html">Calendar</a>
      <a class="nav-link ${active === "tutor-bookings" ? "active" : ""}" href="tutor-bookings.html">Bookings</a>
    `;
    const nav = s.auth
      ? (s.role === "tutor" ? tutorExtra : s.role === "admin" ? "" : studentExtra)
      : guestNav;

    const icons = s.auth ? `
      <a class="icon-btn" href="messages.html" title="Messages">✉️</a>
      <a class="icon-btn" href="notifications.html" title="Notifications">
        🔔${s.notifications.some((n) => n.unread) ? '<span class="badge-dot"></span>' : ""}
      </a>
      <div class="avatar-menu" id="avatarMenu">
        <button class="avatar" id="avatarMenuBtn" aria-label="Account menu">${(s.name || "U").slice(0, 1).toUpperCase()}</button>
        <div class="avatar-menu__dropdown" id="avatarMenuDropdown">
          <div style="padding:8px 12px 4px;">
            <strong style="font-size:13px;">${escapeHtml(s.name || "You")}</strong><br/>
            <span class="role-pill">${s.role}</span>
          </div>
          <div class="avatar-menu__divider"></div>
          ${s.role === "student" ? `
            <a href="dashboard.html">My dashboard</a>
            <a href="billing.html">Billing</a>
          ` : s.role === "tutor" ? `
            <a href="tutor-dashboard.html">Tutor dashboard</a>
            <a href="tutor-earnings.html">Earnings</a>
            <a href="tutor-reviews.html">Reviews</a>
          ` : `
            <a href="admin.html">Admin overview</a>
          `}
          <a href="settings.html">Settings</a>
          <div class="avatar-menu__divider"></div>
          <button id="logoutBtn">Log out</button>
        </div>
      </div>
    ` : `
      <button class="btn btn-ghost btn-sm" data-open-auth="login">Log in</button>
      <button class="btn btn-primary btn-sm" data-open-auth="signup">Sign up</button>
    `;

    return `
      <header class="site-header">
        <div class="container">
          <a class="logo" href="index.html">Mentora<span class="dot"></span></a>
          <nav class="main-nav">${nav}</nav>
          <div class="header-actions">${icons}</div>
        </div>
      </header>
    `;
  }

  export function renderFooter(): string {
    return `
      <footer class="site-footer">
        <div class="container">
          <div>© 2026 Mentora — concept prototype, not a real product.</div>
          <nav>
            <a href="index.html">About</a>
            <a href="become-tutor.html">Become a tutor</a>
            <a href="#" onclick="return false;">Help Center</a>
            <a href="#" onclick="return false;">Terms</a>
          </nav>
        </div>
      </footer>
    `;
  }

  export function wireHeader(): void {
    const btn = document.getElementById("avatarMenuBtn");
    const dropdown = document.getElementById("avatarMenuDropdown");
    if (btn && dropdown) {
      btn.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("open"); });
      document.addEventListener("click", () => dropdown.classList.remove("open"));
    }
    document.getElementById("logoutBtn")?.addEventListener("click", () => {
      logout();
      location.href = "index.html";
    });
    document.querySelectorAll<HTMLElement>("[data-open-auth]").forEach((el) => {
      el.addEventListener("click", () => openAuthModal(el.dataset.openAuth === "signup" ? "signup" : "login"));
    });
  }

  // ---------------------------------------------------------------- Toasts
  export function toast(message: string, type: "success" | "error" | "info" = "info"): void {
    let stack = document.querySelector(".toast-stack");
    if (!stack) {
      stack = document.createElement("div");
      stack.className = "toast-stack";
      document.body.appendChild(stack);
    }
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(() => el.remove(), 3200);
  }

  // ---------------------------------------------------------------- Modal
  export function ensureModalRoot(): HTMLElement {
    let root = document.getElementById("modalRoot");
    if (!root) {
      root = document.createElement("div");
      root.id = "modalRoot";
      root.className = "modal-overlay";
      root.innerHTML = `<div class="modal" id="modalContent"></div>`;
      document.body.appendChild(root);
      root.addEventListener("click", (e) => { if (e.target === root) closeModal(); });
    }
    return root;
  }

  export function openModalHtml(html: string): void {
    const root = ensureModalRoot();
    const content = document.getElementById("modalContent")!;
    content.innerHTML = `<button class="modal__close" id="modalCloseBtn" aria-label="Close">✕</button>${html}`;
    root.classList.add("open");
    document.getElementById("modalCloseBtn")?.addEventListener("click", closeModal);
  }

  export function closeModal(): void {
    document.getElementById("modalRoot")?.classList.remove("open");
  }

  export function confirmDialog(opts: { title: string; body: string; confirmLabel?: string; danger?: boolean }): Promise<boolean> {
    return new Promise((resolve) => {
      openModalHtml(`
        <h2>${escapeHtml(opts.title)}</h2>
        <p class="sub">${opts.body}</p>
        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
          <button class="btn btn-ghost" id="confirmCancel">Cancel</button>
          <button class="btn ${opts.danger ? "btn-danger" : "btn-primary"}" id="confirmOk">${opts.confirmLabel || "Confirm"}</button>
        </div>
      `);
      document.getElementById("confirmCancel")?.addEventListener("click", () => { closeModal(); resolve(false); });
      document.getElementById("confirmOk")?.addEventListener("click", () => { closeModal(); resolve(true); });
    });
  }

  // ---------------------------------------------------------- Auth modal
  export function openAuthModal(mode: "login" | "signup", redirectTo?: string): void {
    if (redirectTo) Store.set({ redirectTo });
    const html = `
      <div class="tab-switch">
        <button id="tabLogin" class="${mode === "login" ? "active" : ""}">Log in</button>
        <button id="tabSignup" class="${mode === "signup" ? "active" : ""}">Sign up</button>
      </div>
      <div id="authFormHost"></div>
    `;
    openModalHtml(html);
    renderAuthForm(mode);
    document.getElementById("tabLogin")?.addEventListener("click", () => switchAuthTab("login"));
    document.getElementById("tabSignup")?.addEventListener("click", () => switchAuthTab("signup"));
  }

  function switchAuthTab(mode: "login" | "signup"): void {
    document.getElementById("tabLogin")?.classList.toggle("active", mode === "login");
    document.getElementById("tabSignup")?.classList.toggle("active", mode === "signup");
    renderAuthForm(mode);
  }

  function renderAuthForm(mode: "login" | "signup"): void {
    const host = document.getElementById("authFormHost");
    if (!host) return;
    host.innerHTML = `
      <h2>${mode === "login" ? "Welcome back" : "Create your account"}</h2>
      <p class="sub">${mode === "login" ? "Log in to continue." : "Join as a student or a tutor — you can always add the other role later."}</p>
      <button class="oauth-btn" id="oauthGoogle">🔵 Continue with Google</button>
      <button class="oauth-btn" id="oauthApple">⚫ Continue with Apple</button>
      <div class="divider-or">or</div>
      <form id="authForm" novalidate>
        ${mode === "signup" ? `
        <div class="field" id="field-role">
          <label>I want to</label>
          <select id="roleSelect">
            <option value="student">Learn (find a tutor)</option>
            <option value="tutor">Teach (become a tutor)</option>
          </select>
        </div>` : ""}
        <div class="field" id="field-email">
          <label for="authEmail">Email</label>
          <input type="email" id="authEmail" placeholder="you@example.com" />
          <div class="error-text">Enter a valid email address.</div>
        </div>
        <div class="field" id="field-password">
          <label for="authPassword">Password</label>
          <input type="password" id="authPassword" placeholder="${mode === "signup" ? "At least 8 characters" : "Your password"}" />
          <div class="error-text">${mode === "signup" ? "Min. 8 characters, at least 1 number." : "Enter your password."}</div>
        </div>
        ${mode === "login" ? `<p style="margin:-8px 0 16px;"><a class="btn-link" href="#" id="forgotPw" style="font-size:12px;">Forgot password?</a></p>` : `
        <div class="field checkbox-row" id="field-terms">
          <input type="checkbox" id="authTerms" />
          <label for="authTerms" style="font-weight:400;">I agree to the Terms of Service and Privacy Policy.</label>
        </div>`}
        <button class="btn btn-primary btn-block" type="submit" id="authSubmit">${mode === "login" ? "Log in" : "Create account"}</button>
      </form>
    `;
    document.getElementById("oauthGoogle")?.addEventListener("click", () => completeAuth(mode, "student"));
    document.getElementById("oauthApple")?.addEventListener("click", () => completeAuth(mode, "student"));
    document.getElementById("forgotPw")?.addEventListener("click", (e) => {
      e.preventDefault();
      toast("Password reset link sent (demo only).", "success");
    });
    document.getElementById("authForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      validateAndSubmitAuth(mode);
    });
  }

  function setFieldError(fieldId: string, invalid: boolean): void {
    document.getElementById(fieldId)?.classList.toggle("invalid", invalid);
  }

  function validateAndSubmitAuth(mode: "login" | "signup"): void {
    const email = (document.getElementById("authEmail") as HTMLInputElement).value.trim();
    const password = (document.getElementById("authPassword") as HTMLInputElement).value;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const passwordValid = mode === "signup" ? (password.length >= 8 && /\d/.test(password)) : password.length > 0;
    setFieldError("field-email", !emailValid);
    setFieldError("field-password", !passwordValid);
    let termsOk = true;
    if (mode === "signup") {
      termsOk = (document.getElementById("authTerms") as HTMLInputElement).checked;
      setFieldError("field-terms", !termsOk);
    }
    if (!emailValid || !passwordValid || !termsOk) return;

    const role = mode === "signup"
      ? ((document.getElementById("roleSelect") as HTMLSelectElement).value as Role)
      : (Store.get().role === "guest" ? "student" : Store.get().role);
    completeAuth(mode, role === "guest" ? "student" : role);
  }

  function completeAuth(mode: "login" | "signup", role: Role): void {
    const submitBtn = document.getElementById("authSubmit") as HTMLButtonElement | null;
    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Please wait…"; }
    setTimeout(() => {
      const name = role === "tutor" ? "Jordan (Tutor)" : "Jordan";
      login(role, name);
      closeModal();
      toast(mode === "signup" ? "Account created — welcome to Mentora!" : "Welcome back!", "success");
      const redirect = Store.get().redirectTo;
      if (redirect) {
        Store.set({ redirectTo: "" });
        location.href = redirect;
      } else {
        renderHeaderInPlace();
      }
    }, 500);
  }

  export function renderHeaderInPlace(): void {
    const slot = document.getElementById("headerSlot");
    if (slot) {
      slot.innerHTML = renderHeader(document.body.dataset.page || "");
      wireHeader();
    }
  }

  export function requireAuth(redirectTo: string, allowedRoles?: Role[]): boolean {
    const s = Store.get();
    if (!s.auth) {
      openAuthModal("login", redirectTo);
      return false;
    }
    if (allowedRoles && !allowedRoles.includes(s.role)) {
      toast("This area isn't available for your current role in this demo.", "error");
      return false;
    }
    return true;
  }

  // ---------------------------------------------------------- Dev toolbar
  export function renderDevToolbar(current: DemoState): string {
    const label = (s: DemoState) => s.charAt(0).toUpperCase() + s.slice(1);
    const states: DemoState[] = ["success", "loading", "empty", "error"];
    return `
      <div class="dev-toolbar">
        <span>Simulate:</span>
        ${states.map((s) => `<button data-demo-state="${s}" class="${s === current ? "active" : ""}">${label(s)}</button>`).join("")}
      </div>
    `;
  }

  export function wireDevToolbar(): void {
    document.querySelectorAll<HTMLElement>("[data-demo-state]").forEach((btn) => {
      btn.addEventListener("click", () => setDemoState(btn.dataset.demoState as DemoState));
    });
  }

  // ---------------------------------------------------------- State panels
  export function skeletonCard(): string { return `<div class="skeleton skeleton-card"></div>`; }
  export function skeletonRow(): string { return `<div class="skeleton skeleton-row"></div>`; }
  export function skeletonLine(width = "100%"): string { return `<div class="skeleton skeleton-line" style="width:${width}"></div>`; }

  export function emptyState(icon: string, title: string, desc: string, ctaHtml = ""): string {
    return `
      <div class="state-panel">
        <div class="state-icon">${icon}</div>
        <h3>${escapeHtml(title)}</h3>
        <p>${desc}</p>
        ${ctaHtml}
      </div>
    `;
  }

  export function errorState(desc: string, retryId = "retryBtn"): string {
    return `
      <div class="state-panel error">
        <div class="state-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${desc}</p>
        <button class="btn btn-primary" id="${retryId}">Retry</button>
      </div>
    `;
  }

  // ---------------------------------------------------------- Tutor card
  export function tutorCardHtml(t: Tutor, variant: "grid" | "row" = "grid"): string {
    const isFav = Store.get().favorites.includes(t.id);
    const badge = t.badge ? `<span class="tutor-card__badge">${t.badge}</span>` : "";
    if (variant === "row") {
      return `
        <div class="tutor-row" data-tutor-id="${t.id}">
          <div class="tutor-row__media">${t.avatarEmoji}</div>
          <div>
            <div class="tutor-card__name"><a href="tutor-profile.html?id=${t.id}">${escapeHtml(t.name)}</a> ${badge}</div>
            <div class="tutor-card__headline">${escapeHtml(t.headline)}</div>
            <div class="tutor-card__meta">
              <span class="tutor-card__rating">★ ${t.rating.toFixed(1)}</span> (${t.reviewCount} reviews) ·
              ${t.languages.join(", ")}
            </div>
            <div class="tutor-card__meta">Next available: <strong>${t.nextAvailable}</strong></div>
          </div>
          <div class="tutor-row__cta">
            <div class="tutor-card__price">$${t.pricePerHour}<small>/hr</small></div>
            <a class="btn btn-primary btn-sm" href="tutor-profile.html?id=${t.id}">View profile</a>
            <button class="btn btn-ghost btn-sm" data-message-tutor="${t.id}">Message</button>
          </div>
        </div>
      `;
    }
    return `
      <div class="tutor-card" data-tutor-id="${t.id}">
        <div class="tutor-card__media">
          ${badge}
          <button class="tutor-card__fav" data-fav-toggle="${t.id}" aria-label="Toggle favorite">${isFav ? "❤️" : "🤍"}</button>
          ${t.avatarEmoji}
        </div>
        <div class="tutor-card__body">
          <div class="tutor-card__name">${escapeHtml(t.name)}</div>
          <div class="tutor-card__headline">${escapeHtml(t.headline)}</div>
          <div class="tutor-card__meta"><span class="tutor-card__rating">★ ${t.rating.toFixed(1)}</span> (${t.reviewCount})</div>
          <div class="tutor-card__footer">
            <div class="tutor-card__price">$${t.pricePerHour}<small>/hr</small></div>
            <a class="btn btn-primary btn-sm" href="tutor-profile.html?id=${t.id}">View profile</a>
          </div>
        </div>
      </div>
    `;
  }

  export function wireTutorCards(root: ParentNode = document): void {
    root.querySelectorAll<HTMLElement>("[data-fav-toggle]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!requireAuth(location.pathname.split("/").pop() || "search.html")) return;
        const id = btn.dataset.favToggle!;
        const nowFav = toggleFavorite(id);
        btn.textContent = nowFav ? "❤️" : "🤍";
        toast(nowFav ? "Added to favorites" : "Removed from favorites", "success");
      });
    });
    root.querySelectorAll<HTMLElement>("[data-message-tutor]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!requireAuth("messages.html")) return;
        location.href = `messages.html?tutor=${btn.dataset.messageTutor}`;
      });
    });
  }
}
