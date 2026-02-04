# Specification

## Summary
**Goal:** Upgrade the /login phone number entry to a premium international phone input with country auto-detection, searchable country selection, and per-country validation while preserving the existing OTP flow and styling.

**Planned changes:**
- Replace the plain phone number input in both Sign In and Sign Up tabs on /login with a responsive two-part control: a left country selector (flag + country name + dial code) and a right phone number input, including a searchable dropdown with at least 20 popular countries (must include India +91, US +1, UK +44, UAE +971).
- Auto-detect and pre-select the user’s country on /login page load using browser-based hints; if unsupported/unknown, default to India (+91) and show the flag + dial code immediately on render.
- Add per-country phone validation on blur and on “Send OTP” click; block OTP progression when invalid and show an inline error under the phone input group with exact text: “Please enter a valid [country] mobile number”, styled with pearl-blue text and a gold border treatment.
- Update styling of the new phone input group to match the existing dark luxury theme (black/dark backgrounds, pearl-blue #7FB3D5 accents, gold #D4AF37 hover/glow), keep the existing continuous gold pulse/glow on the Send OTP button, and ensure the control is fully responsive with no overflow on mobile.
- Keep the existing OTP login flow behavior intact (including attempt counting and 10-minute lockout), and store/use the full international phone number with leading “+” and selected dial code for the OTP session.
- Append a brief internal QA checklist to frontend/RELEASE_NOTES.md covering auto-detect fallback, dropdown content/selection, per-country validation, UI/hover/animation regressions, and end-to-end OTP flow.

**User-visible outcome:** On /login, users see a country-aware phone input with a searchable flag/name/dial-code selector that auto-fills their country (defaults to India if unknown), validates numbers per selected country with an inline error, and successfully continues through the existing OTP login flow using a full international (+) phone number.
