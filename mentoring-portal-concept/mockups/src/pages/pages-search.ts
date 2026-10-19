namespace MentorApp {

  // ------------------------------------------------------------ Search
  export function initSearch(): void {
    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    const params = new URLSearchParams(location.search);
    const subjectFilter = params.get("subject") || "";
    const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    searchInput.value = subjectFilter;

    renderResults(state, subjectFilter, params.get("sort") || "best");

    document.getElementById("searchForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const q = searchInput.value.trim();
      const p = new URLSearchParams(location.search);
      if (q) p.set("subject", q); else p.delete("subject");
      p.delete("state");
      location.search = p.toString();
    });

    document.getElementById("sortSelect")?.addEventListener("change", (e) => {
      const p = new URLSearchParams(location.search);
      p.set("sort", (e.target as HTMLSelectElement).value);
      location.search = p.toString();
    });

    document.getElementById("resetFiltersBtn")?.addEventListener("click", () => {
      location.href = "search.html";
    });

    const priceRange = document.getElementById("priceRange") as HTMLInputElement | null;
    const priceOut = document.getElementById("priceRangeOut");
    priceRange?.addEventListener("input", () => { if (priceOut) priceOut.textContent = `up to $${priceRange.value}/hr`; });
  }

  function renderResults(state: DemoState, subjectFilter: string, sort: string): void {
    const list = document.getElementById("resultsList")!;
    const count = document.getElementById("resultsCount")!;

    if (state === "loading") {
      list.innerHTML = Array.from({ length: 4 }).map(() => skeletonRow()).join("");
      count.textContent = "Searching…";
      return;
    }
    if (state === "error") {
      list.innerHTML = errorState("We couldn't load tutors for this search.");
      document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
      count.textContent = "";
      return;
    }

    let results = tutors.filter((t) => !subjectFilter || t.subjects.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase())));
    if (state === "empty") results = [];

    if (sort === "price-asc") results = [...results].sort((a, b) => a.pricePerHour - b.pricePerHour);
    if (sort === "price-desc") results = [...results].sort((a, b) => b.pricePerHour - a.pricePerHour);
    if (sort === "rating") results = [...results].sort((a, b) => b.rating - a.rating);

    if (!results.length) {
      count.textContent = "0 tutors found";
      list.innerHTML = emptyState(
        "🔍", "No tutors match your filters",
        "Try widening your price range or removing a filter.",
        '<button class="btn btn-primary" id="resetFiltersBtn2">Reset filters</button>'
      );
      document.getElementById("resetFiltersBtn2")?.addEventListener("click", () => { location.href = "search.html"; });
      return;
    }

    count.textContent = `${results.length} tutor${results.length === 1 ? "" : "s"} found${subjectFilter ? ` for "${escapeHtml(subjectFilter)}"` : ""}`;
    list.innerHTML = results.map((t) => tutorCardHtml(t, "row")).join("");
    wireTutorCards(list);
  }

  // ------------------------------------------------------------ Tutor profile
  export function initTutorProfile(): void {
    const params = new URLSearchParams(location.search);
    const id = params.get("id") || tutors[0].id;
    const tutor = tutorById(id);
    const root = document.getElementById("profileRoot")!;

    if (!tutor) {
      root.innerHTML = emptyState("🚫", "Tutor not found", "This tutor profile is no longer available.", '<a class="btn btn-primary" href="search.html">Back to search</a>');
      return;
    }

    const state = demoStateFromUrl() || "success";
    document.getElementById("devToolbarSlot")!.innerHTML = renderDevToolbar(state);
    wireDevToolbar();

    if (state === "loading") {
      root.innerHTML = `<div class="container">${skeletonLine("40%")}${skeletonCard()}</div>`;
      return;
    }
    if (state === "error") {
      root.innerHTML = `<div class="container" style="padding:48px 0;">${errorState("Couldn't load this tutor's profile.")}</div>`;
      document.getElementById("retryBtn")?.addEventListener("click", () => setDemoState("success"));
      return;
    }

    const isNewTutor = state === "empty" || tutor.isNew;
    const tutorReviews = isNewTutor ? [] : reviewsForTutor(tutor.id);
    const isFav = Store.get().favorites.includes(tutor.id);

    root.innerHTML = `
      <div class="container profile-hero">
        <div>
          <div class="profile-video" id="playIntroVideo">▶ Watch intro video</div>
          <div class="profile-header">
            <div class="avatar">${tutor.avatarEmoji}</div>
            <div>
              <div class="profile-title">${escapeHtml(tutor.name)}</div>
              <div class="profile-sub">${escapeHtml(tutor.headline)}</div>
              <div class="badge-row">
                ${tutor.badge ? `<span class="badge accent">${tutor.badge}</span>` : ""}
                <span class="badge">★ ${tutor.rating.toFixed(1)} (${tutorReviews.length} reviews)</span>
                <span class="badge">${tutor.lessonsCompleted} lessons completed</span>
              </div>
            </div>
          </div>

          <div class="tabs-nav" id="profileTabs">
            <button class="active" data-tab="about">About</button>
            <button data-tab="reviews">Reviews</button>
            <button data-tab="availability">Availability</button>
          </div>
          <div class="tab-panel active" data-panel="about">
            <p>${escapeHtml(tutor.bio)}</p>
            <h3 style="margin-top:20px; font-size:14px;">Languages</h3>
            <p>${tutor.languages.join(", ")}</p>
            <h3 style="margin-top:20px; font-size:14px;">Subjects</h3>
            <div class="badge-row">${tutor.subjects.map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join("")}</div>
          </div>
          <div class="tab-panel" data-panel="reviews">
            ${tutorReviews.length ? `
              <div class="rating-summary" style="margin-bottom:20px;">
                <div class="big">${tutor.rating.toFixed(1)}</div>
                <div style="flex:1;">
                  ${ratingDistribution(tutor.id).map((count, i) => `
                    <div class="dist-bar"><span>${5 - i}★</span><div class="bar"><span style="width:${tutorReviews.length ? (count / tutorReviews.length) * 100 : 0}%"></span></div><span>${count}</span></div>
                  `).join("")}
                </div>
              </div>
              ${tutorReviews.map((r) => `
                <div class="review-item">
                  <div class="review-item__head"><strong>${escapeHtml(r.studentName)}</strong><span class="stars">${starsHtml(r.rating)}</span><span style="color:var(--color-text-muted); font-size:12px;">${r.date}</span></div>
                  <p style="font-size:13px;">${escapeHtml(r.comment)}</p>
                  ${r.tags.length ? `<div class="badge-row">${r.tags.map((t) => `<span class="badge">${escapeHtml(t)}</span>`).join("")}</div>` : ""}
                </div>
              `).join("")}
            ` : emptyState("📝", "No reviews yet", "This tutor is new to Mentora — be the first to book a trial lesson and leave a review!")}
          </div>
          <div class="tab-panel" data-panel="availability">
            ${isNewTutor
              ? emptyState("🗓️", "No upcoming availability", "This tutor hasn't published their schedule yet. Send a message to ask about availability.", '<button class="btn btn-secondary" id="msgFromAvailability">Message tutor</button>')
              : `<p style="color:var(--color-text-muted); font-size:13px; margin-bottom:12px;">Preview only — pick an exact slot on the booking page.</p>${renderMiniCalendarPreview()}`}
          </div>

          <div class="section-heading" style="margin-top:32px;"><h2 style="font-size:18px;">Similar tutors</h2></div>
          <div class="grid-cards" id="similarTutors"></div>
        </div>

        <aside class="booking-panel">
          <div class="price">$${tutor.pricePerHour}<small>/hour</small></div>
          <p style="font-size:12px; color:var(--color-text-muted); margin:6px 0 16px;">Next available: <strong>${tutor.nextAvailable}</strong></p>
          <button class="btn btn-primary btn-block" id="bookTrialBtn">Book a trial lesson</button>
          <button class="btn btn-ghost btn-block" style="margin-top:8px;" id="messageTutorBtn">Message</button>
          <button class="btn btn-ghost btn-block" style="margin-top:8px;" id="favToggleBtn">${isFav ? "❤️ Saved to favorites" : "🤍 Save to favorites"}</button>
        </aside>
      </div>
    `;

    document.querySelectorAll<HTMLElement>("#profileTabs button").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("#profileTabs button").forEach((b) => b.classList.remove("active"));
        document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");
        document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`)?.classList.add("active");
      });
    });

    document.getElementById("playIntroVideo")?.addEventListener("click", () => toast("Video playback is simulated in this concept prototype.", "info"));
    document.getElementById("bookTrialBtn")?.addEventListener("click", () => {
      Store.update((s) => ({ ...s, bookingDraft: { tutorId: tutor.id, lessonType: "trial" } }));
      if (!requireAuth(`tutor-profile.html?id=${tutor.id}`)) return;
      location.href = `booking.html?tutor=${tutor.id}`;
    });
    const goMessage = () => {
      if (!requireAuth("messages.html")) return;
      location.href = `messages.html?tutor=${tutor.id}`;
    };
    document.getElementById("messageTutorBtn")?.addEventListener("click", goMessage);
    document.getElementById("msgFromAvailability")?.addEventListener("click", goMessage);
    document.getElementById("favToggleBtn")?.addEventListener("click", (e) => {
      if (!requireAuth(`tutor-profile.html?id=${tutor.id}`)) return;
      const nowFav = toggleFavorite(tutor.id);
      (e.target as HTMLElement).textContent = nowFav ? "❤️ Saved to favorites" : "🤍 Save to favorites";
      toast(nowFav ? "Added to favorites" : "Removed from favorites", "success");
    });

    const similar = tutors.filter((t) => t.id !== tutor.id && t.subjects.some((s) => tutor.subjects.includes(s))).slice(0, 4);
    const fallbackSimilar = similar.length ? similar : tutors.filter((t) => t.id !== tutor.id).slice(0, 4);
    const similarHost = document.getElementById("similarTutors")!;
    similarHost.innerHTML = fallbackSimilar.map((t) => tutorCardHtml(t, "grid")).join("");
    wireTutorCards(similarHost);
  }

  function renderMiniCalendarPreview(): string {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return `
      <div class="calendar-week">
        ${days.map((d, i) => `
          <div class="calendar-day">
            <div class="calendar-day__label">${d}</div>
            ${i % 2 === 0 ? `<div class="calendar-slot" style="pointer-events:none;">09:00</div><div class="calendar-slot" style="pointer-events:none;">18:00</div>` : `<div class="calendar-slot" style="pointer-events:none;">14:00</div>`}
          </div>
        `).join("")}
      </div>
    `;
  }
}
