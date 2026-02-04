# Storefront Login Verification Checklist

This document provides a comprehensive checklist for verifying the updated storefront login functionality after deployment.

## Deployment URL
After deployment, record the updated draft/live URL here:
- **Draft URL**: [To be filled from deployment output]
- **Live URL**: [To be filled from deployment output]

## Verification Checklist

### 1. Country Code Dropdown (Compact Design)
- [ ] Country selector trigger is visibly narrower (120px width) than phone input
- [ ] Trigger shows small flag icon + dial code only (e.g., 🇮🇳 +91)
- [ ] Dropdown panel is compact (300px width, 240px height)
- [ ] Dropdown list is scrollable and searchable
- [ ] Each dropdown item shows flag, country name, and dial code
- [ ] Golden hover/glow effect appears on country selector button
- [ ] Auto-detection defaults to India (+91) or detected country on first load

### 2. Sign In / Sign Up Button Navigation
- [ ] Clicking "Sign In" button in header navigates to `/login?tab=signin`
- [ ] Sign In tab is active immediately on page load
- [ ] Sign In form (phone input + Send OTP) is visible instantly (no blank state)
- [ ] Clicking "Sign Up" button in header navigates to `/login?tab=signup`
- [ ] Sign Up tab is active immediately on page load
- [ ] Sign Up form (name, email, phone + Send OTP) is visible instantly (no blank state)
- [ ] Switching between tabs works smoothly without stuck states
- [ ] Mobile menu Sign In / Sign Up buttons work correctly

### 3. Internet Identity Login (Passkey)
- [ ] "Login with Internet Identity" button is visible below OTP forms
- [ ] Helper text "Secure password-less login with your device" is displayed
- [ ] Clicking button opens Internet Identity authentication flow
- [ ] Button shows spinner/loading state during authentication
- [ ] Button is disabled during authentication (no double-submit)
- [ ] Successful authentication redirects to `/dashboard`
- [ ] No error messages appear when already authenticated
- [ ] No repeated "authenticated" messages during navigation

### 4. OTP Flow (Simulated)
- [ ] Send OTP button triggers OTP generation
- [ ] OTP is logged to console (for testing)
- [ ] Alert shows OTP in test mode
- [ ] OTP entry UI has 6 slots with auto-advance
- [ ] 2-minute countdown timer displays correctly
- [ ] Expired OTP shows error message and blocks verification
- [ ] Incorrect OTP shows remaining attempts (3 total)
- [ ] After 3 failed attempts, lockout modal appears
- [ ] Lockout modal shows 10-minute countdown
- [ ] During lockout, Send OTP and Verify OTP are blocked
- [ ] Correct OTP verification redirects to `/dashboard`
- [ ] Golden hover/glow on Send OTP and Verify OTP buttons

### 5. Sign Up Additional Fields
- [ ] Sign Up tab shows Name input (optional)
- [ ] Sign Up tab shows Email input (optional)
- [ ] Name validation: if provided, must be 2+ characters
- [ ] Email validation: if provided, must be valid email format
- [ ] Validation errors display inline below fields
- [ ] Send OTP is blocked if validation fails
- [ ] Switching from Sign Up to Sign In resets form state

### 6. Phone Number Validation
- [ ] India (+91) requires exactly 10 digits
- [ ] India numbers must start with 6-9
- [ ] Changing country updates validation rules immediately
- [ ] Validation error displays inline with pearl blue text and gold border
- [ ] Invalid phone blocks Send OTP button

### 7. Responsive Design
- [ ] Login page is responsive on mobile (320px+)
- [ ] Country selector and phone input align cleanly on mobile
- [ ] No horizontal overflow on small screens
- [ ] Buttons are touch-friendly on mobile
- [ ] Modals (lockout, permission) display correctly on mobile

### 8. Golden Hover/Glow Effects
- [ ] Sign In button has gold-pulse-glow animation
- [ ] Sign Up button has gold-pulse-glow animation
- [ ] Send OTP button has gold-pulse-glow animation
- [ ] Verify OTP button has gold-pulse-glow animation
- [ ] Login with Internet Identity button has gold-pulse-glow animation
- [ ] Country selector has golden hover glow
- [ ] Logout button has gold-pulse-glow animation

### 9. Error Handling
- [ ] Auth errors display in premium styled alerts
- [ ] No layout jumps when errors appear
- [ ] "Already authenticated" errors are suppressed
- [ ] Network errors show user-friendly messages
- [ ] Lockout errors trigger modal and toast

### 10. Accessibility & Motion
- [ ] All buttons are keyboard accessible
- [ ] Tab navigation works correctly
- [ ] Reduced motion users see simplified animations
- [ ] Screen readers can navigate forms
- [ ] Focus indicators are visible

## Notes
- OTP flow is currently simulated (no real SMS delivery)
- Backend integration for OTP verification is pending
- Internet Identity uses @dfinity/auth-client for passkey authentication
- All authentication state is managed via localStorage and Internet Identity

## Deployment Output Reference
After running deployment, capture the following from the output:
- Draft canister URL
- Live canister URL
- Any deployment warnings or errors
