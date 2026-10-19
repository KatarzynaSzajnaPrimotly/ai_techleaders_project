# 3. Screen and Navigation Map

## 3.1 Top-level information architecture

```
Public (Guest) nav:  Logo | Find a tutor | Become a tutor | (Search bar) | Log in | Sign up
Student nav (auth):  Logo | Find a tutor | (Search bar) | Messages | Notifications | Avatar menu ▾
                                                                                   ├─ Dashboard
                                                                                   ├─ My Lessons
                                                                                   ├─ Billing
                                                                                   ├─ Settings
                                                                                   └─ Log out
Tutor nav (auth):     Logo | [Switch: Teaching] | Calendar | Bookings | Messages | Notifications | Avatar menu ▾
                                                                                   ├─ Tutor Dashboard
                                                                                   ├─ Earnings
                                                                                   ├─ Reviews
                                                                                   ├─ Public profile (preview)
                                                                                   ├─ Settings
                                                                                   └─ Log out
Admin nav:            Logo [Admin] | Tutor Applications | Reported Content | Disputes | Metrics | Avatar menu ▾
```

## 3.2 Full screen list

| # | Screen | Route | Audience | Entry points |
|---|---|---|---|---|
| S1 | Home / Landing | `/` | Guest | direct, logo click |
| S2 | Search Results | `/search?subject=&...` | Guest, Student | S1 search bar, nav search |
| S3 | Tutor Profile | `/tutors/:id` | Guest, Student | S2 card click, direct link |
| S4 | Auth – Login | `/login` | Guest | nav, auth gates |
| S5 | Auth – Sign up | `/signup` | Guest | nav, auth gates, S10 |
| S6 | Booking | `/tutors/:id/book` | Student | S3 "Book trial"/"Book lesson" |
| S7 | Checkout | `/checkout/:bookingId` | Student | S6 confirm |
| S8 | Booking Confirmation | `/bookings/:id/confirmed` | Student | S7 success |
| S9 | Student Dashboard – My Lessons | `/dashboard` | Student | nav avatar menu, post-login default |
| S10 | Messages (shared shell, student & tutor) | `/messages[/:threadId]` | Student, Tutor | nav icon, S3 "Message" |
| S11 | Lesson Room | `/lessons/:id/room` | Student, Tutor | dashboard "Join", notification |
| S12 | Leave a Review | `/lessons/:id/review` | Student | post-lesson redirect, dashboard |
| S13 | Billing & Invoices | `/dashboard/billing` | Student | avatar menu |
| S14 | Account Settings | `/settings` | Student, Tutor | avatar menu |
| S15 | Notifications | `/notifications` | Student, Tutor | nav bell icon |
| S16 | Become a Tutor – Landing | `/become-a-tutor` | Guest | footer/nav CTA |
| S17 | Tutor Application Form | `/become-a-tutor/apply` | Guest/Student | S16 CTA |
| S18 | Application Submitted | `/become-a-tutor/submitted` | applicant | S17 submit |
| S19 | Tutor Dashboard – Overview | `/tutor/dashboard` | Tutor | post-approval default |
| S20 | Tutor Calendar & Availability | `/tutor/calendar` | Tutor | tutor nav |
| S21 | Tutor Bookings (requests) | `/tutor/bookings` | Tutor | tutor nav, notification |
| S22 | Tutor Earnings | `/tutor/earnings` | Tutor | tutor nav/avatar menu |
| S23 | Tutor Reviews | `/tutor/reviews` | Tutor | tutor nav/avatar menu |
| S24 | Admin – Tutor Applications queue | `/admin/applications` | Admin | admin nav |
| S25 | Admin – Reported Content | `/admin/reports` | Admin | admin nav |
| S26 | Admin – Disputes | `/admin/disputes` | Admin | admin nav |
| S27 | Admin – Platform Metrics | `/admin/metrics` | Admin | admin nav, default |

For the clickable mockup (see `/mockups`), the following subset covers **all key paths** end-to-end and is fully implemented: **S1, S2, S3, S4/S5 (combined auth modal), S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23**. Admin screens (S24–S27) are included as one representative **Admin Overview** screen to demonstrate the moderation pattern without duplicating full CRUD mockups.

## 3.3 Navigation graph

```
                               ┌────────────────────────────────────────────┐
                               │                  Header nav                │
                               │  (changes by auth state / role, see 3.1)   │
                               └────────────────────────────────────────────┘

[Home] --search--> [Search Results] --card--> [Tutor Profile] --Book--> [Booking] --> [Checkout] --> [Confirmation]
   |                      |                        |  \                                                   |
   |                      | filters (stay)         |   \--Message--> [Messages]                           v
   |                                                |                                             [Student Dashboard]
   |                                                 \--auth gate--> [Login/Signup] --back to flow--        |
   |                                                                                                         ├─> [My Lessons tab] -> lesson card -> [Lesson Room] -> [Leave a Review]
   |                                                                                                         ├─> [Messages]
   |                                                                                                         ├─> [Billing]
   |                                                                                                         └─> [Settings]
   |
   └--"Become a tutor"--> [Become-Tutor Landing] --Apply--> [Tutor Application] --Submit--> [Submitted]
                                                                                                  |
                                                                                   (admin approves, simulated)
                                                                                                  v
                                                                                       [Tutor Dashboard Overview]
                                                                                        ├─> [Calendar]
                                                                                        ├─> [Bookings requests]
                                                                                        ├─> [Messages]
                                                                                        ├─> [Earnings]
                                                                                        ├─> [Reviews]
                                                                                        └─> [Settings]

Bell icon (any authenticated screen) -> [Notifications] -> deep-links back into the relevant screen above.
Admin entry (role switch in mockup) -> [Admin Overview] -> (Applications / Reports / Disputes / Metrics tabs)
```

## 3.4 Navigation rules

- **Auth gating**: Booking, Messaging, Dashboards, Settings, Reviews require authentication. Attempting to access them as a Guest opens the Auth modal with a `redirectTo` preserved; on success the user lands exactly where they intended to go (no dead-ends).
- **Role switching**: a user can hold both a Student and a Tutor identity on the same account (like Preply). The nav exposes a "Switch to teaching / Switch to learning" control in the avatar menu once the user has an approved tutor profile.
- **Breadcrumb-free, back-button friendly**: all flows rely on the browser back button; deep states (e.g., a specific calendar slot selected) are reflected in the mockup's client-side state so returning doesn't lose context where feasible, and is clearly called out as a simplification otherwise.
- **Persistent global elements**: header (logo, nav, search where relevant, messages/notifications icons, avatar menu) and footer (About, Help Center, Terms, Become a tutor) are present on every screen except the focused flows (Checkout, Lesson Room, Auth modal) which use a minimal header to reduce drop-off/distraction — a pattern taken directly from Preply's checkout and classroom UX.
