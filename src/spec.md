# Specification

## Summary
**Goal:** Add non-payment monetization features by letting users earn unlock credits via an in-app “watch ad” flow, gating at least one premium generator action behind those credits, and adding a scan-friendly affiliate resources section.

**Planned changes:**
- Add backend support for per-user unlock/credit state: fetch current state, grant credits on completed in-app ad watch, and (optionally) consume a credit when performing a premium unlock.
- Add a frontend “Watch an ad to unlock” timed in-app flow that grants credits and handles loading/error states with English messaging.
- Gate at least one clearly identified advanced/premium action in the Generators experience behind unlock credits, with a blocking prompt when credits are insufficient and an automatic retry after credits are earned.
- Add an authenticated Monetization page section (“Affiliate Resources” or similar) that lists affiliate items (name, short description, outbound link) with an affiliate disclosure and links opening in a new tab using `rel="noopener noreferrer"`.
- Centralize affiliate link definitions in a single maintainable frontend constant/list.

**User-visible outcome:** Authenticated users can watch an in-app “ad” to earn persistent unlock credits, use those credits to access a premium generator action without navigating away after unlocking, and browse an “Affiliate Resources” section with disclosed outbound links that open in a new tab.
