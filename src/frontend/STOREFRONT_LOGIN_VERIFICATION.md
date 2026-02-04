# Storefront Login & Authentication Verification Checklist

## Emergency Reset Entry Points

### /reset Route
- [ ] Navigate to `/reset` in browser
- [ ] Verify reset page loads with progress UI
- [ ] Confirm all localStorage keys are cleared
- [ ] Confirm sessionStorage is cleared
- [ ] Verify React Query cache is cleared
- [ ] Verify Internet Identity session is cleared
- [ ] Confirm automatic redirect to `/login?tab=signin` after reset
- [ ] Verify login page loads normally after reset

### /login?reset=1 Parameter
- [ ] Navigate to `/login?reset=1` in browser
- [ ] Verify reset executes before login UI loads
- [ ] Confirm all state is cleared
- [ ] Verify final URL is `/login?tab=signin`
- [ ] Confirm login page works without manual refresh

## Post-Login Navigation

### OTP Login Flow
- [ ] Complete OTP verification successfully
- [ ] Verify navigation to `/dashboard` when no return path exists
- [ ] Verify return path is cleared after navigation
- [ ] Hard refresh on dashboard - confirm no blank screen
- [ ] Verify dashboard loads normally after refresh

### Internet Identity Login Flow
- [ ] Complete Internet Identity login successfully
- [ ] Verify navigation to `/dashboard` when no return path exists
- [ ] Verify return path is cleared after navigation
- [ ] Hard refresh on dashboard - confirm no blank screen
- [ ] Verify dashboard loads normally after refresh

### Return Path Behavior
- [ ] Navigate to protected route (e.g., `/dashboard`) while logged out
- [ ] Verify redirect to `/login?tab=signin` with flash message
- [ ] Complete login (OTP or II)
- [ ] Verify navigation back to original protected route
- [ ] Confirm return path is cleared after successful navigation

## Protected Route Loading States

### ProtectedRoute Component
- [ ] Navigate to `/dashboard` while logged out
- [ ] Verify visible "Verifying Access" loading card appears
- [ ] Confirm no blank screen during auth check
- [ ] Verify smooth redirect to login with visible UI feedback
- [ ] Hard refresh on `/dashboard` while logged in
- [ ] Confirm loading state appears briefly
- [ ] Verify dashboard loads without blank screen

### Dashboard Error Handling
- [ ] Simulate network error during orders fetch
- [ ] Verify error alert appears with recovery message
- [ ] Confirm no blank screen on error
- [ ] Test retry action works correctly

## Logout & Reset

### Dashboard Logout
- [ ] Click logout button on dashboard
- [ ] Verify all state is cleared (cart, wishlist, session)
- [ ] Verify React Query cache is cleared
- [ ] Verify Internet Identity session is cleared
- [ ] Confirm navigation to `/login?tab=signin`
- [ ] Verify login page works without manual refresh

### Full Clean Boot Reset
- [ ] Trigger reset via `/reset` route
- [ ] Verify all localStorage keys are cleared:
  - `doraa-otp-session`
  - `doraa-flash-message`
  - `doraa-return-path`
  - `doraa-otp-lockout`
  - `doraa-otp-attempts`
  - `doraa-cart`
  - `wishlist`
  - `doraa_user_profile_local`
- [ ] Verify sessionStorage is cleared
- [ ] Confirm in-memory state is reset
- [ ] Verify app works normally after reset

## Safe Return Path Validation

### Unsafe Path Blocking
- [ ] Attempt to store `/login` as return path - verify blocked
- [ ] Attempt to store `/reset` as return path - verify blocked
- [ ] Attempt to store `/admin` as return path - verify blocked
- [ ] Verify fallback to `/dashboard` for unsafe paths

### Safe Path Storage
- [ ] Navigate to `/dashboard` while logged out
- [ ] Verify `/dashboard` is stored as return path
- [ ] Complete login
- [ ] Confirm navigation to `/dashboard`

## Compact Country Dropdown (from previous verification)
- [ ] Country selector width is 120px
- [ ] Flag emoji and dial code display correctly
- [ ] Dropdown opens with 300px × 240px dimensions
- [ ] Search functionality works
- [ ] Golden hover glow on selector

## Sign In / Sign Up Navigation
- [ ] URL `/login` defaults to Sign In tab
- [ ] URL `/login?tab=signin` shows Sign In tab
- [ ] URL `/login?tab=signup` shows Sign Up tab
- [ ] Tab switching works correctly
- [ ] State is preserved per tab

## Internet Identity Passkey Login
- [ ] Click "Login with Internet Identity" button
- [ ] Verify redirect to Internet Identity
- [ ] Complete authentication
- [ ] Verify redirect to dashboard (not home)
- [ ] Confirm user is authenticated

## OTP Flow with Lockout Modal
- [ ] Enter valid phone number
- [ ] Click "Send OTP"
- [ ] Receive OTP (check console/alert)
- [ ] Enter wrong OTP 3 times
- [ ] Verify lockout modal appears
- [ ] Confirm 10-minute countdown displays
- [ ] Verify modal auto-dismisses when lockout expires

## Golden Hover/Glow Effects
- [ ] Country selector has golden hover glow
- [ ] "Send OTP" button has gold-pulse-glow
- [ ] "Verify OTP" button has gold-pulse-glow
- [ ] "Login with Internet Identity" button has gold-pulse-glow

## Responsive Design
- [ ] Test on mobile (< 640px)
- [ ] Test on tablet (640px - 1024px)
- [ ] Test on desktop (> 1024px)
- [ ] Verify all elements are accessible
- [ ] Confirm touch targets are at least 44px

## Error Handling
- [ ] Invalid phone number shows inline error
- [ ] Expired OTP shows error message
- [ ] Network error shows user-friendly message
- [ ] Lockout state prevents further attempts

## Accessibility
- [ ] All form fields have labels
- [ ] Error messages are announced
- [ ] Keyboard navigation works
- [ ] Focus states are visible

---

**Test Environment:** [Draft/Live URL]  
**Tested By:** [Name]  
**Date:** [Date]  
**Status:** [ ] Pass / [ ] Fail  
**Notes:**
