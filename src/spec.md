# Specification

## Summary
**Goal:** Add a new allowlisted admin OTP request/verify flow and an admin-protected example method in `backend/main.mo`, while keeping existing admin OTP/session endpoints unchanged and ensuring upgrade-safe OTP storage.

**Planned changes:**
- Add new public methods `requestOtp(identifier : Text)` and `verifyOtp(identifier : Text, enteredOtp : Text)` to `backend/main.mo` without changing the existing `requestAdminOtp`, `verifyAdminOtp`, or `validateAdminSession` method names/signatures.
- Enforce an identifier allowlist (hardcoded phone/email) for the new `requestOtp`/`verifyOtp` methods, returning English error messages when the identifier is not allowed.
- Implement 6-digit OTP generation, per-identifier storage, and 10-minute expiry using `Time.now()`, including deletion on success or expiry; return a testing success message in English that includes the OTP.
- Make the new OTP storage upgrade-safe by persisting OTP entries in a stable-compatible representation and reconstructing any in-memory structures via upgrade hooks.
- Add an `adminOnlyAction()` example method with a clear authorization rule (not relying on a placeholder principal) and English user-facing text.

**User-visible outcome:** Authorized admin identifiers can request and verify OTPs via the new `requestOtp`/`verifyOtp` methods (with OTP shown in the response for testing), and an admin-protected `adminOnlyAction()` endpoint is available; existing admin OTP/session endpoints continue to work as before.
