# 4. Screen Specifications

Each screen below lists: purpose, available features, UI components, states (loading/empty/error/success), validation rules, and related API endpoints (REST-style, illustrative). Endpoints assume a `Bearer` JWT for authenticated routes and `GET /api/me` to resolve current user/role.

---

## S1 — Home / Landing (`/`)

**Purpose:** Convert a visitor into a searcher within one action; communicate trust and value proposition.

**Features**
- Hero search bar (subject/goal autocomplete, e.g. "English", "Guitar", "Calculus").
- Popular subjects grid (quick-filter chips).
- "How it works" 3-step explainer (Find → Book a trial → Learn).
- Featured/top-rated tutors carousel.
- Social proof: aggregate stats (e.g., "12,000+ tutors", review count), testimonials.
- Secondary CTA: "Become a tutor".

**UI components:** `HeaderNav(guest)`, `SearchBar+Autocomplete`, `ChipList`, `TutorCard` carousel, `StatBadge`, `TestimonialCard`, `Footer`.

**States**
- *Loading:* skeleton cards in the featured-tutors carousel while fetched.
- *Empty:* n/a (static marketing content always renders); if featured tutors fail to load, section is hidden gracefully (not a hard error).
- *Error:* banner only if critical config fails to load (rare) — "Something went wrong loading this page. Retry."
- *Success:* fully rendered landing page.

**Validation:** Search input — min 2 characters before showing autocomplete suggestions; empty submit redirects to `/search` with no filters (browse-all).

**API endpoints**
- `GET /api/subjects/popular`
- `GET /api/tutors/featured?limit=8`
- `GET /api/search/suggestions?q=`

---

## S2 — Search Results (`/search`)

**Purpose:** Let the student narrow down thousands of tutors to a shortlist worth opening.

**Features**
- Filter sidebar: subject, price range (slider), availability (day/time), tutor's spoken languages, speaks-natively toggle, rating minimum, tags (e.g., "Business", "Kids", "Exam prep"), instant-book only toggle.
- Sort: Best match, Price (low→high / high→low), Rating, Newest.
- Tutor result card: photo, name, flag(s)/languages, headline, price/hr, rating + review count, short video preview on hover, "Message" and "View profile" actions, availability snippet ("Next available: today 18:00").
- Pagination / infinite scroll.
- Saved search / "Notify me" for new matching tutors (secondary).

**UI components:** `HeaderNav`, `FilterSidebar`, `SortDropdown`, `TutorCard(list variant)`, `Pagination`, `EmptyState`, `SkeletonCard`.

**States**
- *Loading:* 6 skeleton `TutorCard`s while results fetch; filters remain interactive (disabled submit until loaded).
- *Empty:* "No tutors match your filters" illustration + **Reset filters** button + 3 suggested tutors from a relaxed query.
- *Error:* inline error panel "We couldn't load tutors. [Retry]" — filters persist so the user doesn't lose their query.
- *Success:* result grid/list with result count ("238 tutors found").

**Validation**
- Price range: min ≤ max, both within platform bounds (e.g., $5–$100/hr); invalid range auto-clamps.
- At least one subject must be selected to filter by subject-specific tags.
- URL query params are the source of truth (shareable/bookmarkable search).

**API endpoints**
- `GET /api/tutors/search?subject=&priceMin=&priceMax=&availability=&language=&rating=&sort=&page=`
- `POST /api/saved-searches` (optional, auth required)

---

## S3 — Tutor Profile (`/tutors/:id`)

**Purpose:** Give the student enough confidence to message or book.

**Features**
- Video introduction player (fallback to photo if no video).
- Headline, subjects taught, languages spoken (native/fluent levels), price per lesson length, response time, lessons-completed count, "Super tutor"/badge indicators.
- Tabs: **About** (bio, education, certificates), **Reviews** (list + rating breakdown by stars), **Availability/Schedule** (calendar widget read-only preview), **Resume/Experience**.
- Sticky booking panel: price, duration options, "Book a trial lesson" primary CTA, "Message" secondary CTA, "Add to favorites" (heart icon).
- Similar tutors section.

**UI components:** `HeaderNav`, `VideoPlayer`, `Tabs`, `ReviewList+RatingBreakdown`, `CalendarPreview`, `StickyBookingPanel`, `FavoriteButton`, `TutorCard` carousel (similar tutors).

**States**
- *Loading:* skeleton for header block + tabs content while profile data fetches.
- *Empty:* "No reviews yet" inside Reviews tab for a new tutor (with encouraging copy, no error tone); "No upcoming availability" inside Availability tab if the tutor hasn't set a schedule.
- *Error:* "Tutor not found or no longer available" (404-style) with a link back to Search; generic fetch error has Retry.
- *Success:* fully rendered profile with live calendar availability.

**Validation:** "Book a trial lesson" / "Message" require authentication — unauthenticated click opens Auth modal with `redirectTo=/tutors/:id/book` (or `/messages/new?tutor=:id`), not a dead click.

**API endpoints**
- `GET /api/tutors/:id`
- `GET /api/tutors/:id/reviews?page=`
- `GET /api/tutors/:id/availability?from=&to=`
- `POST /api/favorites/:tutorId` / `DELETE /api/favorites/:tutorId`

---

## S4/S5 — Auth: Login & Sign up (`/login`, `/signup`, rendered as a modal when triggered mid-flow)

**Purpose:** Frictionless identity creation/verification without losing the user's place in the funnel.

**Features**
- Tabs/toggle between Login and Sign up within one modal.
- Email + password fields; OAuth buttons (Google, Apple — mocked in prototype).
- Sign up: role hint ("I want to learn" vs "I want to teach") influences post-auth redirect.
- "Forgot password?" link → reset flow (email sent confirmation).
- Terms acceptance checkbox on sign up.

**UI components:** `Modal`, `TabSwitcher`, `TextField`, `PasswordField(with show/hide)`, `OAuthButton`, `Checkbox`, `InlineError`.

**States**
- *Loading:* submit button shows spinner, fields disabled during request.
- *Empty:* n/a (form always has fields).
- *Error:* inline field errors (e.g., "Invalid email or password"); OAuth failure shows a toast "Could not continue with Google. Try again."
- *Success:* modal closes, user is redirected to the original `redirectTo` target (or dashboard by default); a welcome toast shows on first sign up.

**Validation**
- Email: required, valid format.
- Password: required, min 8 chars, at least 1 number (sign up only; login just requires non-empty).
- Terms checkbox required on sign up.
- Duplicate email on sign up → inline error "An account with this email already exists. [Log in instead]".

**API endpoints**
- `POST /api/auth/login`
- `POST /api/auth/signup`
- `POST /api/auth/oauth/:provider`
- `POST /api/auth/forgot-password`
- `GET /api/me`

---

## S6 — Booking (`/tutors/:id/book`)

**Purpose:** Convert interest into a scheduled lesson with minimum friction and clear expectations.

**Features**
- Lesson type selector: Trial lesson (reduced price, one-time) vs Single lesson vs Package (4/8/12 lessons with per-lesson discount).
- Live availability calendar (week view) in the student's local timezone (auto-detected, overridable).
- Slot selection → shows end time based on duration.
- Optional note to tutor (textarea, e.g., "I'm a beginner, want conversational practice").
- Price summary (updates live with lesson type/package selection).
- "Continue to payment" CTA.

**UI components:** `HeaderNav(minimal)`, `LessonTypeSelector`, `CalendarWeekView`, `TimezoneSelect`, `Textarea`, `PriceSummaryCard`, `StickyCTA`.

**States**
- *Loading:* calendar shows skeleton grid while availability loads.
- *Empty:* no slots in the selected week → "No availability this week" + arrows to jump to the next available week (auto-suggested) and a "Message tutor instead" link.
- *Error:* "Couldn't load this tutor's calendar. [Retry]"; if the slot becomes unavailable between selection and submit (race condition) → inline error "This slot was just booked. Please choose another." and calendar refreshes.
- *Success:* slot held (soft-lock) and user proceeds to Checkout.

**Validation**
- A slot must be selected before "Continue to payment" is enabled.
- Note field max length 500 characters with live counter.
- Package selection requires choosing a package size before continuing.

**API endpoints**
- `GET /api/tutors/:id/availability?week=`
- `POST /api/bookings/hold` (soft-locks a slot for N minutes while checkout completes)
- `GET /api/pricing/:tutorId?lessonType=&packageSize=`

---

## S7 — Checkout (`/checkout/:bookingId`)

**Purpose:** Securely capture payment with full price transparency (a known Preply trust factor: no surprise fees).

**Features**
- Order summary (tutor, lesson type/date/time, duration, price breakdown incl. any service fee, total).
- Payment method: card form (mocked) or saved method; promo code field.
- Billing details (name, country — for tax/invoice).
- "Pay & confirm booking" CTA; held-slot countdown timer (e.g., "Slot reserved for 8:45").

**UI components:** `HeaderNav(minimal)`, `OrderSummaryCard`, `PaymentMethodSelector`, `CardForm`, `PromoCodeField`, `CountdownBadge`, `PrimaryButton(loading)`.

**States**
- *Loading:* "Processing payment…" overlay with disabled form after submit.
- *Empty:* n/a.
- *Error:* "Payment declined — check your card details or try another method" (inline + non-blocking, form stays filled); "Your reserved slot expired, please pick a new time" if the hold timer runs out — routes back to Booking.
- *Success:* redirects to Booking Confirmation.

**Validation**
- Card number/expiry/CVC format validation (client-side pattern checks in the mock).
- Promo code checked against a mock list; invalid code shows inline error without blocking checkout.
- Required billing fields (name, country) before enabling Pay button.

**API endpoints**
- `GET /api/bookings/:id`
- `POST /api/payments/charge`
- `POST /api/promo-codes/validate`
- `POST /api/bookings/:id/confirm`

---

## S8 — Booking Confirmation (`/bookings/:id/confirmed`)

**Purpose:** Reassure the student the booking is real and tell them exactly what happens next.

**Features**
- Success banner with lesson details (tutor, date/time in local timezone, how to join).
- "Add to calendar" (Google/Apple/ICS — mocked), "Message your tutor", "Go to my dashboard" actions.
- Receipt/invoice download link.

**UI components:** `SuccessState(illustration)`, `BookingSummaryCard`, `ButtonGroup`, `LinkList`.

**States**
- *Loading:* brief spinner while confirmation data loads (usually instantaneous after redirect).
- *Empty:* n/a.
- *Error:* if booking record can't be found (e.g., bad link) → "We couldn't find this booking" + link to Dashboard.
- *Success:* (primary/default state of this screen).

**Validation:** n/a (read-only confirmation screen).

**API endpoints**
- `GET /api/bookings/:id`
- `GET /api/bookings/:id/invoice`

---

## S9 — Student Dashboard / My Lessons (`/dashboard`)

**Purpose:** Single home base for a student's ongoing learning activity.

**Features**
- Tabs: **Upcoming**, **Past**, **Favorites**.
- Lesson card: tutor avatar/name, date/time countdown, subject, "Join lesson" (enabled 10 min before start), "Reschedule", "Cancel", "Message tutor".
- Package credit indicator ("3 of 8 lessons remaining").
- Quick links to Billing and Settings.

**UI components:** `HeaderNav(student)`, `Tabs`, `LessonCard`, `CountdownBadge`, `ConfirmDialog(cancel/reschedule)`, `EmptyState`.

**States**
- *Loading:* skeleton lesson cards.
- *Empty:* Upcoming tab empty → "No upcoming lessons yet" + "Find a tutor" CTA; Favorites empty → "You haven't saved any tutors yet" + CTA to Search.
- *Error:* "Couldn't load your lessons. [Retry]".
- *Success:* populated lesson list grouped by date.

**Validation**
- Cancel action requires confirmation and shows the applicable refund/credit policy (e.g., "Free cancellation up to 4 hours before the lesson") before the user confirms.
- Reschedule requires selecting a new valid slot (reuses the Booking calendar component) and tutor acceptance if the tutor requires approval.

**API endpoints**
- `GET /api/students/me/lessons?status=upcoming|past`
- `GET /api/students/me/favorites`
- `POST /api/bookings/:id/cancel`
- `POST /api/bookings/:id/reschedule`

---

## S10 — Messages (`/messages`, `/messages/:threadId`)

**Purpose:** Enable pre-sales questions and ongoing coordination without leaving the platform.

**Features**
- Thread list (left panel): avatar, name, last message preview, unread badge, timestamp.
- Active thread (right panel): message bubbles, timestamp, read receipts, text input with send button, attachment (mocked), quick-reply suggestions for tutors ("Share availability").
- Search/filter threads.

**UI components:** `HeaderNav`, `ThreadList`, `ThreadListItem(unreadBadge)`, `MessageBubble`, `MessageComposer`, `EmptyState`.

**States**
- *Loading:* skeleton thread list and skeleton message bubbles on open.
- *Empty:* no threads yet → "No messages yet. Find a tutor to start a conversation." (student) / "No messages yet" (tutor); selected thread with no messages (new conversation) → composer only, no bubbles.
- *Error:* "Couldn't load messages. [Retry]"; send failure shows a retry affordance on the failed bubble ("Failed to send — Tap to retry").
- *Success:* live thread rendered, auto-scrolled to latest message.

**Validation:** message body required (non-empty, max 2000 chars) to enable Send; rapid-fire rate limiting feedback (mock) if needed.

**API endpoints**
- `GET /api/messages/threads`
- `GET /api/messages/threads/:id`
- `POST /api/messages/threads/:id/messages`
- `POST /api/messages/threads` (start new thread with a tutor/student id)

---

## S11 — Lesson Room (`/lessons/:id/room`)

**Purpose:** Host the actual 1:1 lesson (video-call UX shell; real-time video infra is out of scope for the mockup and is represented with placeholders).

**Features**
- Video tiles (self + remote, mocked placeholders), mute/camera toggle, leave-call button.
- Shared notes/whiteboard panel (static mock).
- In-call chat panel.
- Pre-join "device check" screen (camera/mic preview) before entering.
- Lesson timer / time remaining.

**UI components:** `DeviceCheckPanel`, `VideoTile`, `CallControls`, `SidePanel(Notes/Chat tabs)`, `Timer`.

**States**
- *Loading:* "Connecting to your lesson…" while the room initializes.
- *Empty:* the other participant hasn't joined yet → "Waiting for [name] to join…".
- *Error:* "Camera/microphone blocked — check your browser permissions"; "Connection lost — Reconnecting…" with automatic retry.
- *Success:* both participants connected, call controls active.

**Validation:** device check must confirm camera/mic availability (or explicit "Join without camera") before enabling "Join lesson".

**API endpoints**
- `GET /api/lessons/:id/room-token`
- `POST /api/lessons/:id/complete`
- `POST /api/lessons/:id/no-show`

---

## S12 — Leave a Review (`/lessons/:id/review`)

**Purpose:** Capture trust-building social proof right after value was delivered.

**Features**
- Star rating (1–5, required).
- Optional tags (multi-select chips: "Patient", "Well prepared", "Fun lessons"...).
- Free-text comment.
- "Skip for now" option (non-blocking, can remind later via notification).

**UI components:** `StarRatingInput`, `ChipMultiSelect`, `Textarea`, `PrimaryButton`, `SecondaryLink(skip)`.

**States**
- *Loading:* submit spinner.
- *Empty:* n/a.
- *Error:* "Couldn't submit your review. [Retry]" (form content preserved).
- *Success:* "Thanks for your feedback!" confirmation + redirect to Dashboard.

**Validation:** star rating required to submit; comment optional but max 1000 chars; profanity/abuse basic client-side warning (mock) before submit for admin-safety awareness.

**API endpoints**
- `POST /api/lessons/:id/review`
- `GET /api/lessons/:id` (to show lesson/tutor context on the form)

---

## S13 — Billing & Invoices (`/dashboard/billing`)

**Purpose:** Transparency and self-service for payments.

**Features**
- Saved payment methods (add/remove/set default — mocked).
- Invoice/receipt history with download links.
- Active package/subscription status with "Cancel auto-renew" toggle.

**UI components:** `PaymentMethodCard`, `InvoiceTable`, `ToggleSwitch`, `ConfirmDialog`.

**States**
- *Loading:* skeleton table rows.
- *Empty:* "No invoices yet".
- *Error:* "Couldn't load billing information. [Retry]".
- *Success:* populated table + payment methods.

**Validation:** removing the only payment method with an active auto-renew package prompts a warning before allowing it.

**API endpoints**
- `GET /api/billing/payment-methods`
- `POST /api/billing/payment-methods` / `DELETE /api/billing/payment-methods/:id`
- `GET /api/billing/invoices`
- `POST /api/subscriptions/:id/cancel-renewal`

---

## S14 — Account Settings (`/settings`)

**Purpose:** Manage identity, preferences and account lifecycle.

**Features**
- Profile fields: name, photo, timezone, spoken language(s), email, password change.
- Notification preferences (email/push toggles per event type).
- Danger zone: deactivate/delete account.

**UI components:** `AvatarUploader`, `TextField`, `TimezoneSelect`, `ToggleSwitch list`, `DangerZoneCard+ConfirmDialog`.

**States**
- *Loading:* form skeleton on first load.
- *Empty:* n/a.
- *Error:* inline field errors on save failure; toast "Couldn't save changes. [Retry]".
- *Success:* toast "Settings saved" after successful update.

**Validation:** email format + uniqueness check; password change requires current password + new password meeting the same rules as sign up; delete account requires typing "DELETE" to confirm.

**API endpoints**
- `GET /api/me/settings`
- `PATCH /api/me/settings`
- `POST /api/me/change-password`
- `DELETE /api/me`

---

## S15 — Notifications (`/notifications`)

**Purpose:** Central, chronological feed of everything actionable.

**Features**
- List grouped by Today/Earlier: new message, booking request, booking confirmed/cancelled, upcoming lesson reminder, review received, application status update.
- Mark as read (single/all), click-through deep link to the relevant screen.

**UI components:** `HeaderNav`, `NotificationListItem(icon,unreadDot)`, `EmptyState`, `MarkAllReadButton`.

**States**
- *Loading:* skeleton list.
- *Empty:* "You're all caught up!" illustration.
- *Error:* "Couldn't load notifications. [Retry]".
- *Success:* populated, unread items visually distinct.

**Validation:** n/a (read-only list with click actions).

**API endpoints**
- `GET /api/notifications`
- `POST /api/notifications/:id/read`
- `POST /api/notifications/read-all`

---

## S16 — Become a Tutor Landing (`/become-a-tutor`)

**Purpose:** Pitch the earning opportunity and funnel qualified applicants into the application form.

**Features**
- Value proposition (set your own price/hours, reach students worldwide).
- Earnings estimator (simple slider: hours/week × rate → est. monthly earnings).
- Steps to get started (Apply → Get approved → Start teaching).
- FAQ accordion.
- "Apply now" CTA.

**UI components:** `HeaderNav`, `HeroSection`, `EarningsEstimatorSlider`, `StepList`, `Accordion(FAQ)`.

**States:** static marketing page — *Loading* only applies to the (optional) dynamic "average tutor earnings" stat; *Error* hides that stat gracefully; no empty/success distinction beyond normal render.

**Validation:** estimator slider bounds (hours 1–40, rate from platform min/max).

**API endpoints**
- `GET /api/stats/tutor-earnings-benchmark` (optional/decorative)

---

## S17 — Tutor Application Form (`/become-a-tutor/apply`)

**Purpose:** Collect everything Admin needs to vet a new tutor, in a guided multi-step form.

**Features**
- Step 1: Subjects & experience (multi-select subjects, years of experience, education).
- Step 2: Profile (headline, bio, profile photo, intro video upload — mocked file input).
- Step 3: Pricing & availability (hourly rate, initial weekly availability).
- Step wizard with progress indicator, back/next navigation, autosave draft.

**UI components:** `StepWizard`, `MultiSelect`, `FileUpload(mock)`, `TextField`, `Textarea`, `RangeInput(price)`, `AvailabilityGrid`.

**States**
- *Loading:* submit spinner on final step.
- *Empty:* n/a (guided form).
- *Error:* per-step inline validation errors block advancing; submit failure shows a toast and keeps the user on the review step with data intact.
- *Success:* redirects to Application Submitted (S18).

**Validation**
- Step 1: at least one subject required; experience required.
- Step 2: bio min 100 characters (quality bar), photo required, video optional but recommended (shows a tip, not blocking).
- Step 3: hourly rate within platform bounds; at least 3 available time slots per week required to submit.

**API endpoints**
- `POST /api/tutor-applications/draft` (autosave)
- `POST /api/tutor-applications/submit`
- `GET /api/subjects` (for the multi-select)

---

## S18 — Application Submitted (`/become-a-tutor/submitted`)

**Purpose:** Set expectations for the review timeline and keep the applicant engaged.

**Features:** confirmation message, expected review time ("2–3 business days"), link to edit application while still pending, link back to Home.

**UI components:** `SuccessState`, `InfoCallout`, `ButtonGroup`.

**States**
- *Success* (default): "Application submitted".
- Revisit-after-decision states are actually separate notifications/emails, but the mockup also demonstrates an **Approved** and a **Rejected** variant of this same screen reachable via dev toolbar, to show both outcomes without a real backend:
  - *Approved:* CTA "Go to your Tutor Dashboard".
  - *Rejected (error-adjacent, not a technical error):* reason text + "Edit & resubmit" CTA.

**Validation:** n/a.

**API endpoints**
- `GET /api/tutor-applications/me`

---

## S19 — Tutor Dashboard Overview (`/tutor/dashboard`)

**Purpose:** At-a-glance snapshot of a tutor's business.

**Features**
- Today's/this-week's upcoming lessons widget.
- Pending booking requests counter with quick accept/decline.
- Earnings-to-date snapshot + link to full Earnings.
- Profile completeness / performance tips ("Add a video to get 2x more views").
- Latest reviews preview.

**UI components:** `HeaderNav(tutor)`, `StatCard`, `LessonCard(compact)`, `RequestCard(accept/decline)`, `TipCallout`, `ReviewCard(compact)`.

**States**
- *Loading:* skeleton stat cards + lists.
- *Empty:* no bookings yet → "No bookings yet — make sure your profile stands out" + link to edit profile/Settings.
- *Error:* per-widget retry (so one failing widget doesn't block the whole dashboard).
- *Success:* populated overview.

**Validation:** accept/decline actions on a request require it to still be pending (handles race condition where student cancels first — shows a toast "This request is no longer available").

**API endpoints**
- `GET /api/tutors/me/dashboard-summary`
- `POST /api/bookings/:id/accept`
- `POST /api/bookings/:id/decline`

---

## S20 — Tutor Calendar & Availability (`/tutor/calendar`)

**Purpose:** Let the tutor control when they can be booked.

**Features**
- Weekly recurring availability grid (click/drag to toggle available hours).
- Exceptions/time-off blocking (date range picker).
- Lesson duration defaults, buffer time between lessons.
- Toggle: "Instant book" vs "Require approval".
- Calendar sync (Google Calendar — mocked connect button).

**UI components:** `AvailabilityGrid(editable)`, `DateRangePicker`, `ToggleSwitch`, `SelectField(duration)`, `ConnectAccountButton`.

**States**
- *Loading:* grid skeleton on first load.
- *Empty:* brand-new tutor sees an all-blank grid with onboarding tooltip "Click and drag to add your available hours".
- *Error:* "Couldn't save availability changes. [Retry]" — optimistic UI reverts on failure.
- *Success:* toast "Availability updated" on save; autosave indicator.

**Validation:** at least one available slot required to remain publicly bookable (warning, not hard block, if a tutor clears everything); time-off end date must be after start date.

**API endpoints**
- `GET /api/tutors/me/availability`
- `PUT /api/tutors/me/availability`
- `POST /api/tutors/me/time-off`
- `PATCH /api/tutors/me/booking-settings`

---

## S21 — Tutor Bookings / Requests (`/tutor/bookings`)

**Purpose:** Manage the full lifecycle of booking requests and scheduled lessons.

**Features**
- Tabs: **Pending requests**, **Upcoming**, **Past**, **Cancelled**.
- Accept/decline (with reason) pending requests.
- Propose reschedule on an upcoming lesson.
- Mark completed / flag no-show after a lesson's time has passed.

**UI components:** `Tabs`, `RequestCard`, `LessonCard`, `ConfirmDialog(decline reason)`, `EmptyState`.

**States**
- *Loading:* skeleton cards per tab.
- *Empty:* "No pending requests" / "No upcoming lessons" per tab, each with a relevant tip (e.g., link to Calendar to widen availability).
- *Error:* "Couldn't load bookings. [Retry]".
- *Success:* populated, actionable list.

**Validation:** decline requires a reason (select from short list + optional note); no-show flag only enabled after the scheduled end time has passed.

**API endpoints**
- `GET /api/tutors/me/bookings?status=`
- `POST /api/bookings/:id/accept` / `decline` / `reschedule-proposal`
- `POST /api/lessons/:id/complete` / `no-show`

---

## S22 — Tutor Earnings (`/tutor/earnings`)

**Purpose:** Financial transparency and payout control.

**Features**
- Balance summary: available, pending (in holding period), lifetime earnings.
- Earnings table per completed lesson (student, date, amount, platform fee, net).
- Payout method management + "Request payout" action.
- Export to CSV (mocked).

**UI components:** `StatCard`, `EarningsTable`, `PayoutMethodCard`, `PrimaryButton(request payout)`.

**States**
- *Loading:* skeleton stat cards + table rows.
- *Empty:* "No earnings yet — your completed lessons will appear here".
- *Error:* "Couldn't load earnings. [Retry]"; payout request failure → inline error with reason (e.g., "Minimum payout is $20").
- *Success:* populated figures; toast on successful payout request.

**Validation:** payout request disabled below minimum threshold; payout method required before the action is enabled.

**API endpoints**
- `GET /api/tutors/me/earnings/summary`
- `GET /api/tutors/me/earnings/transactions?page=`
- `GET /api/tutors/me/payout-methods` / `POST .../payout-methods`
- `POST /api/tutors/me/payouts/request`

---

## S23 — Tutor Reviews (`/tutor/reviews`)

**Purpose:** Let tutors monitor reputation and engage with feedback.

**Features**
- Rating summary (average + distribution bar chart).
- Review list with filter (all / with-reply-needed).
- Reply to a review (one public reply per review).
- Flag a review as inappropriate → Admin queue.

**UI components:** `RatingSummaryCard`, `DistributionBarChart`, `ReviewCard+ReplyForm`, `FlagButton+ConfirmDialog`.

**States**
- *Loading:* skeleton summary + list.
- *Empty:* "No reviews yet — reviews appear after your first completed lesson".
- *Error:* "Couldn't load reviews. [Retry]"; reply submit failure shows inline retry on that review card.
- *Success:* populated; toast "Reply posted" / "Review reported".

**Validation:** reply max 1000 chars, required (non-empty) to submit; flagging requires selecting a reason.

**API endpoints**
- `GET /api/tutors/me/reviews`
- `POST /api/reviews/:id/reply`
- `POST /api/reviews/:id/flag`

---

## S24–S27 — Admin (represented in the mockup as one combined **Admin Overview**, `/admin`)

**Purpose:** Demonstrate the moderation/ops pattern: queues of actionable items + platform health metrics.

**Features (combined overview)**
- KPI row: active students, active tutors, bookings this week, GMV this week, pending applications count, open disputes count.
- **Tutor Applications** queue: approve/reject with a feedback note (mirrors UC-5 step 4).
- **Reported Content** queue: review flagged item (review/message/profile) → remove / warn / dismiss.
- **Disputes** queue: booking dispute detail → refund / deny with internal note.

**UI components:** `AdminNav`, `KpiCard`, `QueueList+DetailDrawer`, `ApproveRejectButtons+NoteField`, `ResolutionButtons`.

**States**
- *Loading:* skeleton KPI cards + queue lists.
- *Empty:* "No pending applications 🎉" / "No reports to review" / "No open disputes" per queue.
- *Error:* "Couldn't load this queue. [Retry]" per section (isolated failures).
- *Success:* populated queues; action buttons show optimistic update + toast confirmation, item leaves the queue once resolved.

**Validation:** rejecting an application or denying a dispute requires a note (kept internal or sent to the user depending on the action); refund amount (if partial) must be ≤ original charge.

**API endpoints**
- `GET /api/admin/metrics/overview`
- `GET /api/admin/tutor-applications?status=pending`
- `POST /api/admin/tutor-applications/:id/approve` / `reject`
- `GET /api/admin/reports?status=open`
- `POST /api/admin/reports/:id/resolve`
- `GET /api/admin/disputes?status=open`
- `POST /api/admin/disputes/:id/resolve`

---

## 4.1 Shared/global components used across screens

- `HeaderNav` (guest/student/tutor/admin variants), `Footer`
- `Toast` (success/error transient feedback)
- `Modal`, `ConfirmDialog`
- `Skeleton*` loaders (card, row, text block)
- `EmptyState` (icon + message + optional CTA, reused with different copy per screen)
- `ErrorState` / inline retry pattern (reused with different copy per screen)
- `Avatar`, `Badge`, `StarRating(display)`, `Pagination`, `Tabs`, `ToggleSwitch`

Keeping these as shared components is what makes the states (loading/empty/error/success) consistent platform-wide — the same visual language is reused for a `LessonCard` empty state and a `ReviewList` empty state, which is also how the clickable mockup in `/mockups` is implemented (see `mockups/src/components.ts`).
