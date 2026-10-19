# 2. Main Use Cases and Complete User Flows

Each flow lists the trigger, steps, decision points, and the system states involved (loading/empty/error/success are detailed per-screen in doc 04).

## UC-1 Student finds and books a trial lesson with a tutor (core acquisition flow)

**Actor:** Guest/Student
**Trigger:** Visitor lands on homepage wanting to learn a subject.

1. **Home** → enters subject/goal in the search bar ("Learn Spanish", "Learn React") → `Search Results`.
2. **Search Results** → applies filters (price range, availability, native speaker, rating, price) → browses tutor cards (photo, intro video thumbnail, price/hr, rating, tags).
3. Clicks a tutor card → **Tutor Profile**.
4. On **Tutor Profile**: watches intro video, reads bio/reviews/credentials, checks calendar availability widget.
5. Clicks **"Book a trial lesson"** → if not authenticated → **Auth (Sign up/Login)** modal/page (can use Google/Apple OAuth or email). On success, returns to the booking flow (deep-link preserved).
6. **Booking** screen: picks date/time slot from tutor's live calendar, selects lesson type (trial vs package), optionally adds a note to the tutor.
7. Confirms → **Checkout**: reviews price (trial lesson usually low/fixed price), enters payment method, confirms purchase.
8. On success → **Booking Confirmation** (success state) with option to add to personal calendar, message the tutor, see lesson room link countdown.
9. System sends confirmation notification/email to both Student and Tutor.

**Alternate/edge paths**
- No slots available that match the student's timezone → empty state on calendar → suggest "message tutor to request another time" or recommend similar tutors.
- Payment fails → error state on Checkout with retry / different payment method.
- Tutor requires approval for the requested slot → booking goes to **Pending** state; Student sees "Awaiting tutor confirmation" instead of instant confirmation.

## UC-2 Student takes the lesson and leaves a review

1. **Notifications**/Student Dashboard reminds student 15 min before lesson.
2. Student clicks **"Join lesson"** → **Lesson Room** (video call, shared notes/whiteboard placeholder, chat).
3. After the lesson ends → system returns student to **Leave a Review** screen (star rating + comment, tags like "Patient", "Well prepared").
4. Review is published to the Tutor Profile (subject to moderation rules) and recorded in Student's lesson history.

## UC-3 Student messages a tutor before booking (pre-sales question)

1. From **Tutor Profile**, clicks **"Message"**.
2. If unauthenticated → prompted to sign up/login (lightweight, can send after registering).
3. Opens **Messages** (conversation thread with that tutor) → types question → sends.
4. Tutor receives a notification and replies; Student sees unread badge and reply in the thread.

## UC-4 Student manages an ongoing subscription/package

1. **Student Dashboard** → **My Lessons** tab shows upcoming/past lessons and remaining lesson credits in the package.
2. Student can **reschedule** (subject to tutor's cancellation policy) or **cancel** a lesson from the lesson card (confirmation dialog explains refund/credit policy).
3. **Billing/Settings** → view invoices, update payment method, cancel auto-renew of a package.

## UC-5 Tutor applies to join the platform and creates a profile

**Actor:** Guest → becomes pending Tutor.

1. Landing page → **"Become a tutor"** → **Become a Tutor** intro/landing (value prop, earnings estimator).
2. **Sign up** (if not already a student account) → **Tutor Application form**: subjects taught, experience, video upload, certificates, intro pitch, pricing, availability.
3. Submits → **Application Submitted** (pending/success state: "Your application is under review").
4. **Admin** reviews in **Admin → Tutor Applications** → approve or reject (with feedback).
5. On approval, Tutor receives notification → gains access to **Tutor Dashboard** and their profile becomes publicly searchable.
6. On rejection, Tutor receives reason + can resubmit after edits.

## UC-6 Tutor manages availability and bookings

1. **Tutor Dashboard → Calendar**: sets weekly recurring availability and blocks out exceptions (vacation).
2. Receives a **booking request notification** (instant-book or request-to-book depending on tutor settings).
3. If request-to-book: Tutor **Accepts/Declines** from **Bookings** tab; decline requires a reason, system suggests alternate slots to the student.
4. Tutor can **propose a reschedule** for an existing booking; Student must accept.

## UC-7 Tutor delivers a lesson and manages earnings

1. Tutor joins **Lesson Room** at scheduled time (host controls: mute student mic request N/A, screen share, end lesson).
2. After lesson, Tutor marks lesson **completed** (or flags a **no-show**, which triggers the no-show policy).
3. **Tutor Dashboard → Earnings**: sees per-lesson payout, pending balance, payout history, can request payout / set payout method.

## UC-8 Tutor responds to a review

1. **Tutor Dashboard → Reviews**: sees new reviews, can post one public reply per review.
2. Can flag a review as inappropriate → goes to **Admin moderation queue**.

## UC-9 Admin moderates the marketplace

1. **Admin → Tutor Applications**: approve/reject pending tutors (UC-5 step 4).
2. **Admin → Reported Content**: review flagged reviews/messages/profiles → remove, warn user, or dismiss.
3. **Admin → Disputes**: review a booking dispute (e.g., no-show claim) → issue refund/credit or deny, with an internal note.
4. **Admin → Platform metrics**: dashboard of bookings, GMV, active tutors/students, conversion funnel (view → trial → package).

## UC-10 Authentication & account management (cross-cutting)

1. **Sign up** via email/password or OAuth (Google/Apple) — Student or Tutor track chosen at signup or inferred from entry point ("Become a tutor" vs "Find a tutor").
2. **Login**, **forgot password / reset password**.
3. **Account Settings**: profile info, notification preferences, language/timezone, payment methods, delete account.
4. **Logout** from any authenticated screen via the top navigation user menu.

## 2.1 Flow diagram (textual)

```
Guest
 └─ Home ──search──> Search Results ──select──> Tutor Profile
                                                   ├─ Message ──(auth gate)──> Messages
                                                   └─ Book trial ──(auth gate)──> Booking
                                                                                     └─> Checkout ──pay──> Confirmation
                                                                                                              ├─> Student Dashboard
                                                                                                              └─> (reminder) Lesson Room ──end──> Leave Review

Guest ── "Become a tutor" ──> Become-Tutor Landing ──apply──> Tutor Application ──submit──> Pending screen
                                                                                                 └─(Admin approves)─> Tutor Dashboard

Tutor Dashboard ── tabs ──> Calendar | Bookings | Messages | Earnings | Reviews | Settings
Student Dashboard ── tabs ──> My Lessons | Messages | Favorites | Billing | Settings

Admin ── sections ──> Tutor Applications | Reported Content | Disputes | Platform Metrics
```
