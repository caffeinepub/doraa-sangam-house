# Specification

## Summary
**Goal:** Add a reliable client-side “full clean boot” reset and fix the blank-screen/redirect issues around login and first-load of `/dashboard`.

**Planned changes:**
- Implement a full clean-boot reset that clears all client-side persisted auth/storefront state (OTP session/lockout, flash/return path, cart, wishlist, related local/session storage), logs the user out in the app’s Internet Identity context, clears in-memory caches (including React Query), and navigates to Sign In.
- Add an emergency reset entry point reachable via URL (e.g., `/reset` or a `/login` query flag) that runs the full reset even when routing/auth is broken, then lands on `/login?tab=signin` (or equivalent Sign In state).
- Fix post-login navigation so both OTP and Internet Identity logins consistently redirect to `/dashboard` by default, or to a stored safe return path when present, and then clear that return path.
- Harden `/dashboard` first-load behavior so it never becomes a permanent blank screen during auth restoration or while dependencies/data are not ready; show explicit loading and error fallback UI with recovery actions (retry, go to login, run reset).
- Ensure protected route behavior provides visible feedback during auth restoration instead of rendering `null`/blank.

**User-visible outcome:** Users can always recover from broken auth/routing via a URL-triggered reset, and after login they are reliably redirected to `/dashboard` (or a safe return path) without blank screens—even after a hard refresh.
