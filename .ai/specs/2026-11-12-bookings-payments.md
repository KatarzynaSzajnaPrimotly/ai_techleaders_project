# E03 — Booking and payment

**Date:** 2026-11-12  
**Status:** skeleton — awaiting answers to Open Questions  
**Epic:** [#31](https://github.com/open-mercato/ai_techleaders_project/issues/31)  
**Stories:** #45–#49  
**Depends on:** E02 bookable mentors (#30); E02-S05 Stripe Connect onboarding (#43) is required before the first payout, not before checkout.

## Problem statement

Mentees need to reserve a mentor's published time at the displayed price and pay before the session. Mentors need predictable booking, cancellation and payout handling. E02 provides published profiles, prices and availability; E03 adds booking and payment lifecycle behavior. The product brief identifies willingness to pay as an assumption to validate, not an established fact.

## Goals

- Let a mentee choose an eligible published mentor slot and a 25- or 50-minute session.
- Prevent two bookings from claiming the same slot.
- Collect payment through Stripe Checkout and confirm a booking only after verified payment.
- Notify both parties and expose upcoming sessions.
- Support the agreed cancellation/refund rule and record payout obligations.

## Non-goals

- Mentor discovery/search beyond existing E02 share links.
- Automated mentor payouts in the first iteration; the brief says payouts are manual until the payout capability ships.
- Stripe Connect onboarding itself (E02-S05), operator fee configuration (E05-S02), and dispute resolution (E05-S03).
- Video calls or a new messaging product.

## Decisions

- **Slot hold:** atomically hold the slot when checkout begins, for 10 minutes. A hold is not a confirmed booking.
- **Abandoned/failed checkout:** expire the hold after 10 minutes and release the slot. Payment/webhook processing must be idempotent and reconcile late success safely.
- **Cancellation:** full refund when cancellation occurs at least 24 hours before session start; after that, no automatic refund and the fee is forfeited, matching E03-S05 (#48).
- **Stripe Connect:** checkout can ship before Connect; Connect must be ready before the first payout. First-iteration payouts remain manual per the existing brief and E03-S06 (#49).
- **Late payment after hold expiry:** automatically refund; never confirm solely because a late success webhook arrived. Confirmation requires the original hold still to be valid.
- **Late cancellation proceeds:** the full session fee is owed to the mentor; record it for manual payout. No automatic refund after the 24-hour cutoff.
- **Session channel:** text session uses the external channel/link supplied by the mentor; no in-product chat in E03. Reveal contact/link details only to booking participants after payment confirmation.
- **Checkout retry:** allow a new checkout after hold expiry; expire the previous provider checkout session when supported. Database booking/hold state remains authoritative.
- **Notifications:** use the existing mailer for booking lifecycle e-mails; local development/QA uses `MAILER_TRANSPORT=log`.
- **Booking-to-start metric:** measure from verified payment confirmation to session start.
- **Manual payout audit:** record amount, mentor, session, operator and timestamp for every manual payout.
- **Session link:** require an HTTPS URL and show it only to the confirmed booking participants.

## User flows

1. Mentee opens a mentor share page, chooses an available slot and duration, reviews the price, and starts checkout.
2. The system atomically creates a 10-minute hold and a pending booking/payment record before redirecting to Stripe Checkout.
3. A verified payment event confirms the booking exactly once; failure, abandonment or timeout releases the slot.
4. Mentee and mentor see the confirmed session and receive the agreed notification.
5. Mentee cancels; system applies the 24-hour rule and records/refunds the payment as applicable. After confirmation, both participants can see the mentor-provided external text-session details.

## Contracts and architecture — draft

- `core` owns booking/payment states, validation, time rules and service ports.
- `db` owns booking/hold persistence and transaction-safe slot exclusivity.
- `app` routes authenticate/authorize, require `x-devmentor-request` for mutations, validate with Zod and use shared API helpers.
- A payment-gateway port isolates Stripe Checkout and webhook verification; tests use a deterministic fake.
- Webhooks are signature-verified, idempotent and safe under retries; never trust a browser redirect as proof of payment.
- No scheduler is assumed. Expiry is enforced lazily in transactional slot/booking reads and booking attempts; a late successful payment triggers an idempotent refund path.
- Enforce the existing E03-S02 rule: session starts at least 120 minutes after booking start; store the server-computed EUR-cent price and a price snapshot.
- Active slot exclusivity applies only to an unexpired pending hold or a confirmed booking. Expired/cancelled rows must not permanently reserve the slot. Prefer a transaction-safe repository claim; do not hand-edit generated schema snapshots or migrations.
- Expire stale pending holds inside the same transaction that claims the slot. E02 public availability excludes only slots with unexpired pending holds or confirmed bookings.
- Cancellation is decided at request time using server time. Exactly 24 hours before start is eligible for full refund. If the refund outcome has changed since the user reviewed it, require reconfirmation before changing money state.
- Refund processing is idempotent and reconciled by webhook. Without a worker, pending/failed refunds remain visible for operator retry/manual resolution.

## State model — draft

Booking: `pending_payment` → `confirmed` → `completed`; `pending_payment` may become `expired` or `payment_failed`; `confirmed` may become `cancelled`. Payment: `requires_payment` → `paid`, `failed`, `expired`, `refund_pending` → `refunded` (or `refund_failed`). State transitions must be idempotent and auditable. Persist provider event IDs to deduplicate webhooks.

## Security and privacy

- Scope every booking query and mutation to the authenticated mentee, mentor owner, or authorized operator.
- Verify webhook signatures and deduplicate provider event IDs.
- Use exact integer EUR cents and snapshot the agreed session price at booking time.
- Do not store card data; Stripe handles payment details.
- Redact checkout URLs, tokens, webhook secrets and personal data from logs.

## Acceptance criteria — draft

- Concurrent attempts for one slot create at most one active hold/confirmed booking.
- Holds expire after 10 minutes; retries and late webhook delivery cannot double-book or double-charge.
- A booking is confirmed only by a verified successful payment event.
- The charged amount is the price snapshot shown before checkout.
- Cancellation at least 24 hours before start triggers a full refund; later cancellation does not trigger an automatic refund and records the full session fee as owed to the mentor.
- Session contact/link details remain hidden before confirmation and are visible only to the booking participants afterwards.
- Only authorized participants can view booking details or perform allowed state changes.
- Notifications and upcoming-session views reflect confirmed bookings only.

## Edge cases

- Payment succeeds at the same moment as hold expiry.
- Duplicate, delayed, out-of-order or invalid-signature webhook.
- Stripe Checkout creation fails after the hold is persisted.
- User closes checkout, retries, or opens multiple checkout sessions.
- Mentor unpublishes/removes availability after a hold exists.
- Cancellation races with session start or refund processing.
- A mentor has not completed Connect onboarding when a session is paid.
- Daylight-saving/time-zone boundaries and minimum two-hour lead time.

## Open Questions

## Resolved design details

- Checkout retry is permitted after hold expiry; expire the old provider checkout session where supported and trust persisted booking state over redirects.
- Booking lifecycle notifications use the existing mailer; local QA uses the `log` transport. Delivery retry/dead-letter policy must not change booking/payment state and belongs to the notification adapter.
- Booking-to-start is measured from verified payment confirmation to scheduled session start; the product outcome threshold remains the brief's D16 target.
- Manual payout audit records amount, mentor, session, operator and timestamp. First-iteration payouts remain manual.
- The mentor supplies an HTTPS session URL; validate it and expose it only to the confirmed booking participants.

## Implementation phases — preliminary

1. Booking domain, schema, transactional slot hold, expiry and API.
2. Stripe Checkout creation, payment state and verified idempotent webhooks.
3. Confirmation notifications and upcoming-session views.
4. Cancellation/refund workflow and operator-visible audit trail.
5. Connect readiness/payout handoff and operational verification; automated payouts remain out of scope unless the brief changes.

## Validation plan — draft

- Unit tests for state transitions, price snapshots, expiry boundaries and cancellation policy.
- PostgreSQL integration tests for concurrent slot claims, transactional rollback, migrations and idempotent webhook processing.
- Route tests for authentication, ownership, CSRF/request header, validation and API envelopes.
- Browser walkthrough for booking success, checkout cancellation/failure, timeout, duplicate attempt and cancellation/refund states.
- Run repository lint, typecheck, coverage, build and integration gates.

## Risks and dependencies

- Money movement, race conditions and webhook ordering make this high-risk.
- E02 price bounds and availability contracts must remain authoritative.
- Stripe behavior, platform liability and the forfeited-fee allocation require verification/owner decisions; do not treat assumptions as legal or provider facts.
- Confirm E02 #30 and E02-S05 #43 are merged/available before implementation.

