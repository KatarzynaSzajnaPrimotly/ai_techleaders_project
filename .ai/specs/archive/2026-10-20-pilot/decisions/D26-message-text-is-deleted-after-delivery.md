# D26 — The relay deletes message text after delivery and keeps only metadata
- Date, owner: 2026-10-21, founder A (Oliwia), confirmed in the om-discover refresh
- Context and the options weighed: the platform could keep message text until deletion on request, or delete it after delivery and keep the time, the sender role and the request. D18 and R02 mean the coordinator does not read text and nothing is published without approval. Origin: agent recommendation, accepted by founder A.
- Decision and why: after a message is delivered the platform deletes its text and keeps only metadata: time, sender role and request.
- Consequences, and what would make us revisit it: the text cannot be shown in a dispute, and a failed delivery can be retried only while the text is still held; the retry period is open (Q24). The privacy notice (D10) has to say that text passes through the platform and is deleted after delivery.
- Status: active
