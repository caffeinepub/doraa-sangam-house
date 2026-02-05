# Specification

## Summary
**Goal:** Add the mobile number "+9179056555971" to the backend admin OTP authorization allowlist so it is recognized as an authorized admin identifier.

**Planned changes:**
- Update the admin identifier allowlist in `backend/main.mo` to include the exact string "+9179056555971".
- Ensure `requestAdminOtp("+9179056555971")` and `verifyAdminOtp("+9179056555971", ...)` do not fail due to allowlist rejection.

**User-visible outcome:** Admin OTP requests and verification using "+9179056555971" will no longer be blocked as "not authorized" (OTP may still fail for other reasons, e.g., incorrect code).
