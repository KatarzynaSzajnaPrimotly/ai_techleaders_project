namespace MentorApp {

  const LESSON_TYPES = [
    { id: "trial", name: "Trial lesson", desc: "30 min · one-time, discounted price to try the tutor", priceFactor: 0.5 },
    { id: "single", name: "Single lesson", desc: "60 min · pay as you go", priceFactor: 1 },
    { id: "package", name: "Package", desc: "Save up to 15% · buy multiple lessons upfront", priceFactor: 1 },
  ] as const;

  function weekDays(): { label: string; date: string }[] {
    const base = new Date();
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      return { label: d.toLocaleDateString(undefined, { weekday: "short" }), date: d.toISOString().slice(0, 10) };
    });
  }

  // ------------------------------------------------------------ Booking
  export function initBooking(): void {
    if (!requireAuth(location.pathname.split("/").pop() + location.search)) { location.href = "index.html"; return; }
    const params = new URLSearchParams(location.search);
    const tutorId = params.get("tutor") || Store.get().bookingDraft.tutorId || tutors[0].id;
    const tutor = tutorById(tutorId)!;

    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    document.getElementById("bookingTutorName")!.textContent = tutor.name;
    document.getElementById("bookingTutorAvatar")!.textContent = tutor.avatarEmoji;

    let lessonType: "trial" | "single" | "package" = (Store.get().bookingDraft.lessonType as any) || "trial";
    let packageSize: 4 | 8 | 12 = (Store.get().bookingDraft.packageSize as any) || 4;
    let selectedDay: string | null = null;
    let selectedTime: string | null = null;

    const typeHost = document.getElementById("lessonTypeOptions")!;
    function renderTypeOptions(): void {
      typeHost.innerHTML = LESSON_TYPES.map((lt) => `
        <div class="lesson-type-option ${lessonType === lt.id ? "selected" : ""}" data-lesson-type="${lt.id}">
          <div><div class="name">${lt.name}</div><div class="desc">${lt.desc}</div></div>
          <div><strong>$${Math.round(tutor.pricePerHour * lt.priceFactor)}</strong>${lt.id !== "package" ? "" : "<div style='font-size:11px;color:var(--color-text-muted);'>per lesson</div>"}</div>
        </div>
      `).join("") + (lessonType === "package" ? `
        <div class="field" style="margin-top:12px;">
          <label for="packageSizeSelect">Package size</label>
          <select id="packageSizeSelect">
            <option value="4" ${packageSize === 4 ? "selected" : ""}>4 lessons</option>
            <option value="8" ${packageSize === 8 ? "selected" : ""}>8 lessons (10% off)</option>
            <option value="12" ${packageSize === 12 ? "selected" : ""}>12 lessons (15% off)</option>
          </select>
        </div>` : "");
      typeHost.querySelectorAll<HTMLElement>("[data-lesson-type]").forEach((el) => {
        el.addEventListener("click", () => { lessonType = el.dataset.lessonType as any; renderTypeOptions(); updateSummary(); });
      });
      document.getElementById("packageSizeSelect")?.addEventListener("change", (e) => {
        packageSize = Number((e.target as HTMLSelectElement).value) as any;
        updateSummary();
      });
    }

    const calendarHost = document.getElementById("calendarHost")!;
    function renderCalendar(): void {
      if (state === "loading") { calendarHost.innerHTML = `<div class="skeleton" style="height:220px;border-radius:12px;"></div>`; return; }
      if (state === "error") {
        calendarHost.innerHTML = errorState("Couldn't load this tutor's calendar.");
        document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
        return;
      }
      if (state === "empty") {
        calendarHost.innerHTML = emptyState("🗓️", "No availability this week", "Try next week, or message the tutor to ask about other times.", '<button class="btn btn-secondary" id="msgInstead">Message tutor instead</button>');
        document.getElementById("msgInstead")?.addEventListener("click", () => { location.href = `messages.html?tutor=${tutor.id}`; });
        return;
      }
      const days = weekDays();
      calendarHost.innerHTML = `
        <div class="calendar-nav">
          <strong>This week</strong>
          <span style="font-size:12px; color:var(--color-text-muted);">Times shown in your local timezone</span>
        </div>
        <div class="calendar-week">
          ${days.map((d, i) => {
            const slots = i === 1 ? [] : ["09:00", "14:00", "18:00"].filter((_, idx) => (i + idx) % 3 !== 0);
            return `
            <div class="calendar-day">
              <div class="calendar-day__label">${d.label}</div>
              ${slots.length ? slots.map((t) => `<button class="calendar-slot" data-day="${d.date}" data-time="${t}">${t}</button>`).join("") : `<div style="font-size:11px;color:var(--color-text-muted);text-align:center;">—</div>`}
            </div>`;
          }).join("")}
        </div>
      `;
      calendarHost.querySelectorAll<HTMLElement>("[data-day]").forEach((btn) => {
        btn.addEventListener("click", () => {
          calendarHost.querySelectorAll(".calendar-slot").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          selectedDay = btn.dataset.day!;
          selectedTime = btn.dataset.time!;
          updateSummary();
        });
      });
    }

    function updateSummary(): void {
      const lt = LESSON_TYPES.find((l) => l.id === lessonType)!;
      const unitPrice = Math.round(tutor.pricePerHour * lt.priceFactor);
      const qty = lessonType === "package" ? packageSize : 1;
      const discount = lessonType === "package" ? (packageSize === 8 ? 0.9 : packageSize === 12 ? 0.85 : 1) : 1;
      const total = Math.round(unitPrice * qty * discount);
      document.getElementById("summaryBody")!.innerHTML = `
        <div class="summary-row"><span>${lt.name}${lessonType === "package" ? ` × ${qty}` : ""}</span><span>$${unitPrice}${lessonType === "package" ? " ea." : ""}</span></div>
        <div class="summary-row"><span>Scheduled for</span><span>${selectedDay ? `${selectedDay} at ${selectedTime}` : "—"}</span></div>
        <div class="summary-row total"><span>Total</span><span>$${total}</span></div>
      `;
      const cta = document.getElementById("continueToPaymentBtn") as HTMLButtonElement;
      cta.disabled = !selectedDay;
    }

    const noteEl = document.getElementById("bookingNote") as HTMLTextAreaElement;
    const noteCounter = document.getElementById("noteCounter")!;
    noteEl.addEventListener("input", () => {
      if (noteEl.value.length > 500) noteEl.value = noteEl.value.slice(0, 500);
      noteCounter.textContent = `${noteEl.value.length}/500`;
    });

    document.getElementById("continueToPaymentBtn")?.addEventListener("click", () => {
      if (!selectedDay) { toast("Please select a time slot first.", "error"); return; }
      Store.set({
        bookingDraft: {
          tutorId: tutor.id, lessonType, packageSize: lessonType === "package" ? packageSize : undefined,
          day: selectedDay, time: selectedTime || undefined, note: noteEl.value,
        },
      });
      location.href = "checkout.html";
    });

    renderTypeOptions();
    renderCalendar();
    updateSummary();
  }

  // ------------------------------------------------------------ Checkout
  export function initCheckout(): void {
    if (!requireAuth("checkout.html")) { location.href = "index.html"; return; }
    const draft = Store.get().bookingDraft;
    const tutor = tutorById(draft.tutorId || tutors[0].id)!;
    const lt = LESSON_TYPES.find((l) => l.id === (draft.lessonType || "trial"))!;
    const qty = draft.lessonType === "package" ? (draft.packageSize || 4) : 1;
    const discount = draft.lessonType === "package" ? (draft.packageSize === 8 ? 0.9 : draft.packageSize === 12 ? 0.85 : 1) : 1;
    const unitPrice = Math.round(tutor.pricePerHour * lt.priceFactor);
    const total = Math.round(unitPrice * qty * discount);

    document.getElementById("orderSummary")!.innerHTML = `
      <div style="display:flex; gap:10px; align-items:center; margin-bottom:14px;">
        <div class="avatar">${tutor.avatarEmoji}</div>
        <div><strong>${escapeHtml(tutor.name)}</strong><div style="font-size:12px;color:var(--color-text-muted);">${lt.name}${draft.day ? ` · ${draft.day} ${draft.time || ""}` : ""}</div></div>
      </div>
      <div class="summary-row"><span>${lt.name}${draft.lessonType === "package" ? ` × ${qty}` : ""}</span><span>$${unitPrice}${draft.lessonType === "package" ? " ea." : ""}</span></div>
      <div class="summary-row"><span>Service fee</span><span>$0</span></div>
      <div class="summary-row total"><span>Total</span><span>$${total}</span></div>
    `;

    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    let secondsLeft = 9 * 60 + 47;
    const countdownEl = document.getElementById("countdownBadge")!;
    const tick = () => {
      if (state !== "success") return;
      const m = Math.floor(secondsLeft / 60), s = secondsLeft % 60;
      countdownEl.textContent = `Slot reserved for ${m}:${s.toString().padStart(2, "0")}`;
      secondsLeft--;
      if (secondsLeft < 0) { clearInterval(timer); }
    };
    tick();
    const timer = setInterval(tick, 1000);

    if (state === "empty") {
      countdownEl.textContent = "Slot expired";
      document.getElementById("checkoutForm")!.style.display = "none";
      document.getElementById("checkoutErrorHost")!.innerHTML = errorState("Your reserved slot expired. Please pick a new time.", "retryBookingBtn");
      document.getElementById("retryBookingBtn")?.addEventListener("click", () => { location.href = `booking.html?tutor=${tutor.id}`; });
      return;
    }

    document.getElementById("checkoutForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = (document.getElementById("billingName") as HTMLInputElement).value.trim();
      const country = (document.getElementById("billingCountry") as HTMLSelectElement).value;
      const card = (document.getElementById("cardNumber") as HTMLInputElement).value.replace(/\s/g, "");
      const expiry = (document.getElementById("cardExpiry") as HTMLInputElement).value;
      const cvc = (document.getElementById("cardCvc") as HTMLInputElement).value;

      let valid = true;
      valid = setValidity("field-billingName", !!name) && valid;
      valid = setValidity("field-billingCountry", !!country) && valid;
      valid = setValidity("field-cardNumber", /^\d{16}$/.test(card)) && valid;
      valid = setValidity("field-cardExpiry", /^\d{2}\/\d{2}$/.test(expiry)) && valid;
      valid = setValidity("field-cardCvc", /^\d{3}$/.test(cvc)) && valid;
      if (!valid) return;

      const promo = (document.getElementById("promoCode") as HTMLInputElement).value.trim();
      const promoMsg = document.getElementById("promoMsg")!;
      if (promo && promo.toUpperCase() !== "WELCOME10") {
        promoMsg.textContent = "Invalid promo code.";
        promoMsg.style.color = "var(--color-error)";
      } else if (promo) {
        promoMsg.textContent = "Promo applied: 10% off your first lesson.";
        promoMsg.style.color = "var(--color-success)";
      }

      if (state === "error" || card.startsWith("0000")) {
        document.getElementById("checkoutErrorHost")!.innerHTML = errorState("Payment declined — check your card details or try another method.", "");
        toast("Payment declined", "error");
        return;
      }

      const submitBtn = document.getElementById("payBtn") as HTMLButtonElement;
      submitBtn.disabled = true; submitBtn.innerHTML = "Processing payment…";
      clearInterval(timer);
      setTimeout(() => {
        Store.set({
          bookingDraft: {},
        });
        (window as any).__lastConfirmedBooking = { tutor: tutor.id, day: draft.day, time: draft.time, lessonType: draft.lessonType, total };
        localStorage.setItem("mentorapp_last_booking", JSON.stringify({ tutorId: tutor.id, day: draft.day, time: draft.time, lessonType: draft.lessonType, total }));
        location.href = "booking-confirmation.html";
      }, 1200);
    });
  }

  function setValidity(fieldId: string, valid: boolean): boolean {
    document.getElementById(fieldId)?.classList.toggle("invalid", !valid);
    return valid;
  }

  // ------------------------------------------------------------ Confirmation
  export function initBookingConfirmation(): void {
    const raw = localStorage.getItem("mentorapp_last_booking");
    const root = document.getElementById("confirmationRoot")!;
    if (!raw) {
      root.innerHTML = emptyState("🔍", "We couldn't find this booking", "It may have expired or the link is incorrect.", '<a class="btn btn-primary" href="dashboard.html">Go to dashboard</a>');
      return;
    }
    const data = JSON.parse(raw);
    const tutor = tutorById(data.tutorId)!;
    root.innerHTML = `
      <div class="state-panel" style="background:var(--color-success-bg); border:none; max-width:560px; margin:0 auto;">
        <div class="state-icon">✅</div>
        <h3>Your lesson is booked!</h3>
        <p>You're all set with <strong>${escapeHtml(tutor.name)}</strong>${data.day ? ` on <strong>${data.day} at ${data.time}</strong>` : ""}. A confirmation has been sent to your email.</p>
        <div style="display:flex; gap:8px; flex-wrap:wrap; justify-content:center; margin-top:8px;">
          <button class="btn btn-primary" id="addToCalendarBtn">Add to calendar</button>
          <a class="btn btn-secondary" href="messages.html?tutor=${tutor.id}">Message tutor</a>
          <a class="btn btn-ghost" href="dashboard.html">Go to my dashboard</a>
        </div>
        <a class="btn-link" href="#" id="downloadReceiptLink" style="margin-top:10px; font-size:13px;">Download receipt</a>
      </div>
    `;
    document.getElementById("addToCalendarBtn")?.addEventListener("click", () => toast("Calendar invite downloaded (demo).", "success"));
    document.getElementById("downloadReceiptLink")?.addEventListener("click", (e) => { e.preventDefault(); toast("Receipt PDF generated (demo).", "success"); });

    Store.update((s) => ({
      ...s,
      notifications: [{ id: `n-${Date.now()}`, icon: "✅", text: `Your lesson with ${tutor.name} is confirmed.`, time: "Just now", unread: true, href: "dashboard.html" }, ...s.notifications],
    }));
  }
}
