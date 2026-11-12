# E03 first booking and checkout slices

## Tasks

| Phase | Step | Title | Exec | Status | Commit |
|---|---|---|---|---|---|
| Design | 0.1 | Finalize E03 spec and contracts against existing stories | inline | todo | |
| Booking | 1.1 | Booking model, transactional slot hold and migration | inline | done | pending |
| Booking | 1.2 | Booking service/API, 120-minute lead rule and 10-minute expiry | inline | done | pending |
| Booking | 1.3 | Concurrency and route integration coverage | inline | done | pending |
| Checkout | 2.1 | Payment gateway port and test-mode checkout start | inline | todo | |
| Checkout | 2.2 | Verified idempotent webhook and late-payment refund | inline | todo | |
| Final | 3.1 | Review, integration/browser QA and full validation gate | inline | todo | |

## Goal

Implement the first E03 slices on a new stacked branch based on `feat/e02-bookable-slices` (PR #61): booking with a 10-minute transactional slot hold, then a test-mode payment checkout. Confirm bookings only from verified payment events. A late payment after hold expiry is refunded. Production payment collection and payouts remain disabled pending the legal/Stripe launch check in the product brief.

## Scope

- Build on E02 availability/pricing and existing session, CSRF, API, DI and database patterns.
- Use EUR integer cents and snapshot the server-computed price.
- Require 120-minute lead time; lazily expire stale holds in the booking transaction without a scheduler.
- Add deterministic fake gateway for tests; no production gateway activation.

## Non-goals

- Cancellation/refunds initiated by user (E03-S05), notifications/upcoming views (E03-S04), automated Connect payouts (E03-S06), discovery/search, chat, or real-money production payment processing.

## Risks

- Payment handling and slot exclusivity are high risk; integration tests must cover concurrent claims, webhook retry/order, late success, and refund idempotency.
- Existing issue #49 has a legal/Stripe verification gate before the first real payout; preserve it.
- No scheduler is permitted in this slice; ensure expiry is enforced transactionally at every slot-claim boundary.

## References

- `.ai/specs/2026-11-12-bookings-payments.md` (working design; reconcile into this branch before implementation)
- E03 issues #31 and #45–#49
- `.ai/specs/product-brief.md`
