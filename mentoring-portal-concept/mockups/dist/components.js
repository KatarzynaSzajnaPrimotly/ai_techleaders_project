"use strict";
/**
 * Shared UI building blocks (render functions returning HTML strings, plus
 * the small amount of imperative wiring each needs). Kept framework-free
 * on purpose — this is a clickable concept prototype, not production code.
 */
var MentorApp;
(function (MentorApp) {
    function escapeHtml(s) {
        const div = document.createElement("div");
        div.textContent = s;
        return div.innerHTML;
    }
    MentorApp.escapeHtml = escapeHtml;
    function starsHtml(rating) {
        const full = Math.round(rating);
        return "★".repeat(full) + "☆".repeat(5 - full);
    }
    MentorApp.starsHtml = starsHtml;
    // ---------------------------------------------------------------- Header
    function renderHeader(active) {
        const s = MentorApp.Store.get();
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
    MentorApp.renderHeader = renderHeader;
    function renderFooter() {
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
    MentorApp.renderFooter = renderFooter;
    function wireHeader() {
        var _a;
        const btn = document.getElementById("avatarMenuBtn");
        const dropdown = document.getElementById("avatarMenuDropdown");
        if (btn && dropdown) {
            btn.addEventListener("click", (e) => { e.stopPropagation(); dropdown.classList.toggle("open"); });
            document.addEventListener("click", () => dropdown.classList.remove("open"));
        }
        (_a = document.getElementById("logoutBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
            MentorApp.logout();
            location.href = "index.html";
        });
        document.querySelectorAll("[data-open-auth]").forEach((el) => {
            el.addEventListener("click", () => openAuthModal(el.dataset.openAuth === "signup" ? "signup" : "login"));
        });
    }
    MentorApp.wireHeader = wireHeader;
    // ---------------------------------------------------------------- Toasts
    function toast(message, type = "info") {
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
    MentorApp.toast = toast;
    // ---------------------------------------------------------------- Modal
    function ensureModalRoot() {
        let root = document.getElementById("modalRoot");
        if (!root) {
            root = document.createElement("div");
            root.id = "modalRoot";
            root.className = "modal-overlay";
            root.innerHTML = `<div class="modal" id="modalContent"></div>`;
            document.body.appendChild(root);
            root.addEventListener("click", (e) => { if (e.target === root)
                closeModal(); });
        }
        return root;
    }
    MentorApp.ensureModalRoot = ensureModalRoot;
    function openModalHtml(html) {
        var _a;
        const root = ensureModalRoot();
        const content = document.getElementById("modalContent");
        content.innerHTML = `<button class="modal__close" id="modalCloseBtn" aria-label="Close">✕</button>${html}`;
        root.classList.add("open");
        (_a = document.getElementById("modalCloseBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", closeModal);
    }
    MentorApp.openModalHtml = openModalHtml;
    function closeModal() {
        var _a;
        (_a = document.getElementById("modalRoot")) === null || _a === void 0 ? void 0 : _a.classList.remove("open");
    }
    MentorApp.closeModal = closeModal;
    function confirmDialog(opts) {
        return new Promise((resolve) => {
            var _a, _b;
            openModalHtml(`
        <h2>${escapeHtml(opts.title)}</h2>
        <p class="sub">${opts.body}</p>
        <div style="display:flex; gap:8px; justify-content:flex-end; margin-top:20px;">
          <button class="btn btn-ghost" id="confirmCancel">Cancel</button>
          <button class="btn ${opts.danger ? "btn-danger" : "btn-primary"}" id="confirmOk">${opts.confirmLabel || "Confirm"}</button>
        </div>
      `);
            (_a = document.getElementById("confirmCancel")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => { closeModal(); resolve(false); });
            (_b = document.getElementById("confirmOk")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { closeModal(); resolve(true); });
        });
    }
    MentorApp.confirmDialog = confirmDialog;
    // ---------------------------------------------------------- Auth modal
    function openAuthModal(mode, redirectTo) {
        var _a, _b;
        if (redirectTo)
            MentorApp.Store.set({ redirectTo });
        const html = `
      <div class="tab-switch">
        <button id="tabLogin" class="${mode === "login" ? "active" : ""}">Log in</button>
        <button id="tabSignup" class="${mode === "signup" ? "active" : ""}">Sign up</button>
      </div>
      <div id="authFormHost"></div>
    `;
        openModalHtml(html);
        renderAuthForm(mode);
        (_a = document.getElementById("tabLogin")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => switchAuthTab("login"));
        (_b = document.getElementById("tabSignup")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => switchAuthTab("signup"));
    }
    MentorApp.openAuthModal = openAuthModal;
    function switchAuthTab(mode) {
        var _a, _b;
        (_a = document.getElementById("tabLogin")) === null || _a === void 0 ? void 0 : _a.classList.toggle("active", mode === "login");
        (_b = document.getElementById("tabSignup")) === null || _b === void 0 ? void 0 : _b.classList.toggle("active", mode === "signup");
        renderAuthForm(mode);
    }
    function renderAuthForm(mode) {
        var _a, _b, _c, _d;
        const host = document.getElementById("authFormHost");
        if (!host)
            return;
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
        (_a = document.getElementById("oauthGoogle")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => completeAuth(mode, "student"));
        (_b = document.getElementById("oauthApple")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => completeAuth(mode, "student"));
        (_c = document.getElementById("forgotPw")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
            e.preventDefault();
            toast("Password reset link sent (demo only).", "success");
        });
        (_d = document.getElementById("authForm")) === null || _d === void 0 ? void 0 : _d.addEventListener("submit", (e) => {
            e.preventDefault();
            validateAndSubmitAuth(mode);
        });
    }
    function setFieldError(fieldId, invalid) {
        var _a;
        (_a = document.getElementById(fieldId)) === null || _a === void 0 ? void 0 : _a.classList.toggle("invalid", invalid);
    }
    function validateAndSubmitAuth(mode) {
        const email = document.getElementById("authEmail").value.trim();
        const password = document.getElementById("authPassword").value;
        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const passwordValid = mode === "signup" ? (password.length >= 8 && /\d/.test(password)) : password.length > 0;
        setFieldError("field-email", !emailValid);
        setFieldError("field-password", !passwordValid);
        let termsOk = true;
        if (mode === "signup") {
            termsOk = document.getElementById("authTerms").checked;
            setFieldError("field-terms", !termsOk);
        }
        if (!emailValid || !passwordValid || !termsOk)
            return;
        const role = mode === "signup"
            ? document.getElementById("roleSelect").value
            : (MentorApp.Store.get().role === "guest" ? "student" : MentorApp.Store.get().role);
        completeAuth(mode, role === "guest" ? "student" : role);
    }
    function completeAuth(mode, role) {
        const submitBtn = document.getElementById("authSubmit");
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = "Please wait…";
        }
        setTimeout(() => {
            const name = role === "tutor" ? "Jordan (Tutor)" : "Jordan";
            MentorApp.login(role, name);
            closeModal();
            toast(mode === "signup" ? "Account created — welcome to Mentora!" : "Welcome back!", "success");
            const redirect = MentorApp.Store.get().redirectTo;
            if (redirect) {
                MentorApp.Store.set({ redirectTo: "" });
                location.href = redirect;
            }
            else {
                renderHeaderInPlace();
            }
        }, 500);
    }
    function renderHeaderInPlace() {
        const slot = document.getElementById("headerSlot");
        if (slot) {
            slot.innerHTML = renderHeader(document.body.dataset.page || "");
            wireHeader();
        }
    }
    MentorApp.renderHeaderInPlace = renderHeaderInPlace;
    function requireAuth(redirectTo, allowedRoles) {
        const s = MentorApp.Store.get();
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
    MentorApp.requireAuth = requireAuth;
    // ---------------------------------------------------------- Dev toolbar
    function renderDevToolbar(current) {
        const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);
        const states = ["success", "loading", "empty", "error"];
        return `
      <div class="dev-toolbar">
        <span>Simulate:</span>
        ${states.map((s) => `<button data-demo-state="${s}" class="${s === current ? "active" : ""}">${label(s)}</button>`).join("")}
      </div>
    `;
    }
    MentorApp.renderDevToolbar = renderDevToolbar;
    function wireDevToolbar() {
        document.querySelectorAll("[data-demo-state]").forEach((btn) => {
            btn.addEventListener("click", () => MentorApp.setDemoState(btn.dataset.demoState));
        });
    }
    MentorApp.wireDevToolbar = wireDevToolbar;
    // ---------------------------------------------------------- State panels
    function skeletonCard() { return `<div class="skeleton skeleton-card"></div>`; }
    MentorApp.skeletonCard = skeletonCard;
    function skeletonRow() { return `<div class="skeleton skeleton-row"></div>`; }
    MentorApp.skeletonRow = skeletonRow;
    function skeletonLine(width = "100%") { return `<div class="skeleton skeleton-line" style="width:${width}"></div>`; }
    MentorApp.skeletonLine = skeletonLine;
    function emptyState(icon, title, desc, ctaHtml = "") {
        return `
      <div class="state-panel">
        <div class="state-icon">${icon}</div>
        <h3>${escapeHtml(title)}</h3>
        <p>${desc}</p>
        ${ctaHtml}
      </div>
    `;
    }
    MentorApp.emptyState = emptyState;
    function errorState(desc, retryId = "retryBtn") {
        return `
      <div class="state-panel error">
        <div class="state-icon">⚠️</div>
        <h3>Something went wrong</h3>
        <p>${desc}</p>
        <button class="btn btn-primary" id="${retryId}">Retry</button>
      </div>
    `;
    }
    MentorApp.errorState = errorState;
    // ---------------------------------------------------------- Tutor card
    function tutorCardHtml(t, variant = "grid") {
        const isFav = MentorApp.Store.get().favorites.includes(t.id);
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
    MentorApp.tutorCardHtml = tutorCardHtml;
    function wireTutorCards(root = document) {
        root.querySelectorAll("[data-fav-toggle]").forEach((btn) => {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                if (!requireAuth(location.pathname.split("/").pop() || "search.html"))
                    return;
                const id = btn.dataset.favToggle;
                const nowFav = MentorApp.toggleFavorite(id);
                btn.textContent = nowFav ? "❤️" : "🤍";
                toast(nowFav ? "Added to favorites" : "Removed from favorites", "success");
            });
        });
        root.querySelectorAll("[data-message-tutor]").forEach((btn) => {
            btn.addEventListener("click", () => {
                if (!requireAuth("messages.html"))
                    return;
                location.href = `messages.html?tutor=${btn.dataset.messageTutor}`;
            });
        });
    }
    MentorApp.wireTutorCards = wireTutorCards;
})(MentorApp || (MentorApp = {}));
