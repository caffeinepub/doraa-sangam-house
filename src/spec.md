# Specification

## Summary
**Goal:** Add a minimal, reusable global error toast that appears top-right with a gold border, pearl off-white text (#F5F5F0), and auto-dismisses after ~4 seconds.

**Planned changes:**
- Implement a small reusable frontend error-toast helper that shows an English error message (default like “Error: Please try again”) with gold border, text color #F5F5F0, and 4-second fade/dismiss, preserving the existing Toaster placement.
- Wire the error-toast helper into existing error paths: invalid OTP entry, OTP send/verify failures, Internet Identity login failures, and dashboard profile save failures (including network/actor errors).
- Keep UI/routing/auth behavior unchanged and avoid adding new notification UI or heavy logic.

**User-visible outcome:** When an error occurs (e.g., wrong OTP, failed login, or failed profile save), a styled toast appears in the top-right and fades out after about 4 seconds without any layout shifts or changes to navigation/auth flow.
