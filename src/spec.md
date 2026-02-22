# Specification

## Summary
**Goal:** Add a Resend OTP feature with countdown timer and attempt limit to the login page.

**Planned changes:**
- Add "Resend OTP" button below OTP input fields with pearl blue text (#7FB3D5)
- Implement 60-second countdown timer that disables the button during countdown
- Enable OTP resend functionality when timer expires, sending new OTP to same mobile number
- Style button with gold underline/glow on hover and subtle pulse animation when enabled
- Track resend attempts using localStorage with maximum 3 attempts per 10-minute window
- Display "Too many attempts. Try again after 10 minutes" message when limit exceeded
- Show "New OTP sent!" toast notification on successful resend with gold border and pearl off-white text
- Maintain dark luxury theme and mobile responsiveness

**User-visible outcome:** Users can request a new OTP after 60 seconds if they don't receive it, with a visible countdown timer and clear feedback. The system prevents abuse by limiting resends to 3 attempts per 10 minutes.
