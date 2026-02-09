# Specification

## Summary
**Goal:** Add a simple first-time user onboarding experience that introduces the app and routes authenticated users into the main tools.

**Planned changes:**
- Create a new onboarding UI (route or modal) with brief English copy describing the app and highlighting key sections: Generators, Trends, Library, Calendar.
- Add primary and secondary actions (e.g., “Start Creating” and “Skip for now”) that both route the user to `/generators`.
- Show onboarding only to authenticated users *after* profile setup is complete (i.e., only when `userProfile` is not null), and persist completion/dismissal in browser storage so it does not reappear.
- Add an obvious way to re-open onboarding from an authenticated area (e.g., a small link/button), and document the browser storage key used in code.
- Register onboarding navigation within the existing TanStack Router flow (update `frontend/src/App.tsx` only as needed for routing).

**User-visible outcome:** First-time authenticated users who have completed profile setup see a brief onboarding screen once, can start creating or skip directly to Generators, and can later re-open onboarding via a link/button.
