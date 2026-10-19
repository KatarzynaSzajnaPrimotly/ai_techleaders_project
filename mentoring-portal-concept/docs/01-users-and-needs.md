# 1. System Users and Their Needs

The mentoring portal connects people who want to learn a skill with people who teach it, in live 1:1 (and optionally small-group) online sessions. The functional/UX benchmark is Preply.com: search & filter tutors, book a trial lesson, pay, message, take lessons, leave reviews, manage a teaching business.

## 1.1 Primary personas

### Student (Learner)
A person looking for a tutor/mentor in a given subject (language, programming, music, exam prep, etc.).

**Needs**
- Quickly find a tutor that matches subject, level, budget, schedule and language of instruction.
- Compare tutors via video intro, price, rating, reviews, availability.
- Try a tutor with low commitment (trial lesson) before buying a package.
- Pay safely and see transparent pricing (no hidden fees).
- Communicate with a tutor before/after booking (questions, rescheduling).
- Keep track of upcoming/past lessons, homework, progress.
- Join the lesson at the right time with a reliable video room.
- Leave/read reviews to build trust.
- Manage subscriptions/packages, invoices, refunds/cancellations.
- Get reminders/notifications (upcoming lesson, message received, payment due).

### Tutor (Mentor)
An expert who wants to teach, build a student base and earn money.

**Needs**
- Create a compelling public profile (bio, video, credentials, specialties, pricing).
- Define availability/calendar and lesson types (trial, single, packages).
- Get discovered by the right students (search ranking, filters).
- Accept/decline/reschedule booking requests; manage calendar conflicts.
- Communicate with prospective and current students.
- Deliver lessons (video room, shared materials).
- Track earnings, payouts, invoices, completed lesson history.
- Manage reviews and respond to feedback.
- Grow: see profile performance (views, conversion from view → trial → package).

### Guest (Anonymous visitor)
Not yet registered; browsing the marketplace.

**Needs**
- Understand the value proposition quickly (landing page).
- Browse/search tutors without friction before committing to sign up.
- See enough tutor/pricing/review information to decide to register.
- Low-friction sign up (email, Google/Apple OAuth) at the point they need it (e.g., when booking).

### Admin / Platform Operator
Internal staff moderating and operating the marketplace.

**Needs**
- Moderate tutor applications (approve/reject new tutors, verify credentials).
- Moderate content: reviews, messages flagged for abuse, profile content.
- Handle disputes (refunds, cancellations, no-shows) between students and tutors.
- Monitor platform health: bookings, payments, churn, support tickets.
- Manage platform configuration: subjects/categories, commission rates, promotions.

### Support Agent (secondary, can be modeled as a restricted Admin role)
**Needs**
- Look up a user's account, bookings and payment history to resolve tickets.
- Issue refunds/credits within policy limits.
- Communicate with users via internal notes/macros.

## 1.2 Needs → capability mapping (summary)

| Need | Student | Tutor | Guest | Admin |
|---|---|---|---|---|
| Discover/search | ✔ | — | ✔ (limited) | — |
| Public profile | view | create/edit | view | moderate |
| Booking & calendar | ✔ | ✔ | — | view (support) |
| Messaging | ✔ | ✔ | — | moderate |
| Payments | pay | get paid | — | oversee/refund |
| Video lesson room | join | host | — | — |
| Reviews | write | receive/respond | read | moderate |
| Notifications | ✔ | ✔ | marketing only | system alerts |
| Dashboard/analytics | progress | earnings & performance | — | platform metrics |

This mapping drives the screen list in `03-screen-and-navigation-map.md`.
