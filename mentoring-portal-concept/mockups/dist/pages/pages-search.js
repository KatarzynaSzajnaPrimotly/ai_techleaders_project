"use strict";
var MentorApp;
(function (MentorApp) {
    // ------------------------------------------------------------ Search
    function initSearch() {
        var _a, _b, _c;
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        const params = new URLSearchParams(location.search);
        const subjectFilter = params.get("subject") || "";
        const searchInput = document.getElementById("searchInput");
        searchInput.value = subjectFilter;
        renderResults(state, subjectFilter, params.get("sort") || "best");
        (_a = document.getElementById("searchForm")) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", (e) => {
            e.preventDefault();
            const q = searchInput.value.trim();
            const p = new URLSearchParams(location.search);
            if (q)
                p.set("subject", q);
            else
                p.delete("subject");
            p.delete("state");
            location.search = p.toString();
        });
        (_b = document.getElementById("sortSelect")) === null || _b === void 0 ? void 0 : _b.addEventListener("change", (e) => {
            const p = new URLSearchParams(location.search);
            p.set("sort", e.target.value);
            location.search = p.toString();
        });
        (_c = document.getElementById("resetFiltersBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            location.href = "search.html";
        });
        const priceRange = document.getElementById("priceRange");
        const priceOut = document.getElementById("priceRangeOut");
        priceRange === null || priceRange === void 0 ? void 0 : priceRange.addEventListener("input", () => { if (priceOut)
            priceOut.textContent = `up to $${priceRange.value}/hr`; });
    }
    MentorApp.initSearch = initSearch;
    function renderResults(state, subjectFilter, sort) {
        var _a, _b;
        const list = document.getElementById("resultsList");
        const count = document.getElementById("resultsCount");
        if (state === "loading") {
            list.innerHTML = Array.from({ length: 4 }).map(() => MentorApp.skeletonRow()).join("");
            count.textContent = "Searching…";
            return;
        }
        if (state === "error") {
            list.innerHTML = MentorApp.errorState("We couldn't load tutors for this search.");
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            count.textContent = "";
            return;
        }
        let results = MentorApp.tutors.filter((t) => !subjectFilter || t.subjects.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase())));
        if (state === "empty")
            results = [];
        if (sort === "price-asc")
            results = [...results].sort((a, b) => a.pricePerHour - b.pricePerHour);
        if (sort === "price-desc")
            results = [...results].sort((a, b) => b.pricePerHour - a.pricePerHour);
        if (sort === "rating")
            results = [...results].sort((a, b) => b.rating - a.rating);
        if (!results.length) {
            count.textContent = "0 tutors found";
            list.innerHTML = MentorApp.emptyState("🔍", "No tutors match your filters", "Try widening your price range or removing a filter.", '<button class="btn btn-primary" id="resetFiltersBtn2">Reset filters</button>');
            (_b = document.getElementById("resetFiltersBtn2")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => { location.href = "search.html"; });
            return;
        }
        count.textContent = `${results.length} tutor${results.length === 1 ? "" : "s"} found${subjectFilter ? ` for "${MentorApp.escapeHtml(subjectFilter)}"` : ""}`;
        list.innerHTML = results.map((t) => MentorApp.tutorCardHtml(t, "row")).join("");
        MentorApp.wireTutorCards(list);
    }
    // ------------------------------------------------------------ Tutor profile
    function initTutorProfile() {
        var _a, _b, _c, _d, _e, _f;
        const params = new URLSearchParams(location.search);
        const id = params.get("id") || MentorApp.tutors[0].id;
        const tutor = MentorApp.tutorById(id);
        const root = document.getElementById("profileRoot");
        if (!tutor) {
            root.innerHTML = MentorApp.emptyState("🚫", "Tutor not found", "This tutor profile is no longer available.", '<a class="btn btn-primary" href="search.html">Back to search</a>');
            return;
        }
        const state = MentorApp.demoStateFromUrl() || "success";
        document.getElementById("devToolbarSlot").innerHTML = MentorApp.renderDevToolbar(state);
        MentorApp.wireDevToolbar();
        if (state === "loading") {
            root.innerHTML = `<div class="container">${MentorApp.skeletonLine("40%")}${MentorApp.skeletonCard()}</div>`;
            return;
        }
        if (state === "error") {
            root.innerHTML = `<div class="container" style="padding:48px 0;">${MentorApp.errorState("Couldn't load this tutor's profile.")}</div>`;
            (_a = document.getElementById("retryBtn")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => MentorApp.setDemoState("success"));
            return;
        }
        const isNewTutor = state === "empty" || tutor.isNew;
        const tutorReviews = isNewTutor ? [] : MentorApp.reviewsForTutor(tutor.id);
        const isFav = MentorApp.Store.get().favorites.includes(tutor.id);
        root.innerHTML = `
      <div class="container profile-hero">
        <div>
          <div class="profile-video" id="playIntroVideo">▶ Watch intro video</div>
          <div class="profile-header">
            <div class="avatar">${tutor.avatarEmoji}</div>
            <div>
              <div class="profile-title">${MentorApp.escapeHtml(tutor.name)}</div>
              <div class="profile-sub">${MentorApp.escapeHtml(tutor.headline)}</div>
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
            <p>${MentorApp.escapeHtml(tutor.bio)}</p>
            <h3 style="margin-top:20px; font-size:14px;">Languages</h3>
            <p>${tutor.languages.join(", ")}</p>
            <h3 style="margin-top:20px; font-size:14px;">Subjects</h3>
            <div class="badge-row">${tutor.subjects.map((s) => `<span class="badge">${MentorApp.escapeHtml(s)}</span>`).join("")}</div>
          </div>
          <div class="tab-panel" data-panel="reviews">
            ${tutorReviews.length ? `
              <div class="rating-summary" style="margin-bottom:20px;">
                <div class="big">${tutor.rating.toFixed(1)}</div>
                <div style="flex:1;">
                  ${MentorApp.ratingDistribution(tutor.id).map((count, i) => `
                    <div class="dist-bar"><span>${5 - i}★</span><div class="bar"><span style="width:${tutorReviews.length ? (count / tutorReviews.length) * 100 : 0}%"></span></div><span>${count}</span></div>
                  `).join("")}
                </div>
              </div>
              ${tutorReviews.map((r) => `
                <div class="review-item">
                  <div class="review-item__head"><strong>${MentorApp.escapeHtml(r.studentName)}</strong><span class="stars">${MentorApp.starsHtml(r.rating)}</span><span style="color:var(--color-text-muted); font-size:12px;">${r.date}</span></div>
                  <p style="font-size:13px;">${MentorApp.escapeHtml(r.comment)}</p>
                  ${r.tags.length ? `<div class="badge-row">${r.tags.map((t) => `<span class="badge">${MentorApp.escapeHtml(t)}</span>`).join("")}</div>` : ""}
                </div>
              `).join("")}
            ` : MentorApp.emptyState("📝", "No reviews yet", "This tutor is new to Mentora — be the first to book a trial lesson and leave a review!")}
          </div>
          <div class="tab-panel" data-panel="availability">
            ${isNewTutor
            ? MentorApp.emptyState("🗓️", "No upcoming availability", "This tutor hasn't published their schedule yet. Send a message to ask about availability.", '<button class="btn btn-secondary" id="msgFromAvailability">Message tutor</button>')
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
        document.querySelectorAll("#profileTabs button").forEach((btn) => {
            btn.addEventListener("click", () => {
                var _a;
                document.querySelectorAll("#profileTabs button").forEach((b) => b.classList.remove("active"));
                document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
                btn.classList.add("active");
                (_a = document.querySelector(`.tab-panel[data-panel="${btn.dataset.tab}"]`)) === null || _a === void 0 ? void 0 : _a.classList.add("active");
            });
        });
        (_b = document.getElementById("playIntroVideo")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => MentorApp.toast("Video playback is simulated in this concept prototype.", "info"));
        (_c = document.getElementById("bookTrialBtn")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
            MentorApp.Store.update((s) => ({ ...s, bookingDraft: { tutorId: tutor.id, lessonType: "trial" } }));
            if (!MentorApp.requireAuth(`tutor-profile.html?id=${tutor.id}`))
                return;
            location.href = `booking.html?tutor=${tutor.id}`;
        });
        const goMessage = () => {
            if (!MentorApp.requireAuth("messages.html"))
                return;
            location.href = `messages.html?tutor=${tutor.id}`;
        };
        (_d = document.getElementById("messageTutorBtn")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", goMessage);
        (_e = document.getElementById("msgFromAvailability")) === null || _e === void 0 ? void 0 : _e.addEventListener("click", goMessage);
        (_f = document.getElementById("favToggleBtn")) === null || _f === void 0 ? void 0 : _f.addEventListener("click", (e) => {
            if (!MentorApp.requireAuth(`tutor-profile.html?id=${tutor.id}`))
                return;
            const nowFav = MentorApp.toggleFavorite(tutor.id);
            e.target.textContent = nowFav ? "❤️ Saved to favorites" : "🤍 Save to favorites";
            MentorApp.toast(nowFav ? "Added to favorites" : "Removed from favorites", "success");
        });
        const similar = MentorApp.tutors.filter((t) => t.id !== tutor.id && t.subjects.some((s) => tutor.subjects.includes(s))).slice(0, 4);
        const fallbackSimilar = similar.length ? similar : MentorApp.tutors.filter((t) => t.id !== tutor.id).slice(0, 4);
        const similarHost = document.getElementById("similarTutors");
        similarHost.innerHTML = fallbackSimilar.map((t) => MentorApp.tutorCardHtml(t, "grid")).join("");
        MentorApp.wireTutorCards(similarHost);
    }
    MentorApp.initTutorProfile = initTutorProfile;
    function renderMiniCalendarPreview() {
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
})(MentorApp || (MentorApp = {}));
