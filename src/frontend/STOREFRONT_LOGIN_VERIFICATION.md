# Storefront Login Verification Checklist

## Post-Deployment Verification

### Draft URL
- [ ] Draft URL provided: `_______________________`

### Login Redirect Behavior
- [ ] After OTP verification (no return path set), user is redirected to `/` (home page)
- [ ] After Internet Identity login (no return path set), user is redirected to `/` (home page)
- [ ] If return path is set, user is redirected to that path after login
- [ ] Return path is cleared after successful redirect
- [ ] No blank screen or crash occurs during/after navigation

### Shop by Style Section on Home Page
- [ ] Home page (`/`) displays "Shop by Style" heading (centered, gold text)
- [ ] Exactly 5 category buttons are visible: Banarasi, Organza, Silk, Georgette, Kalamkari
- [ ] Category buttons have pearl blue background with gold text
- [ ] Category buttons have 15px border radius
- [ ] Hover on category button produces gold text glow effect
- [ ] No movement/scale/lift animations occur on hover
- [ ] Clicking category button does not navigate or open overlays
- [ ] No images are present in the Shop by Style section

### Responsive Design
- [ ] On mobile, category buttons wrap cleanly or allow horizontal scrolling
- [ ] No horizontal page overflow is introduced
- [ ] Home page remains stable across viewport sizes (no blank screen)

### Compact Country Dropdown
- [ ] Country selector is 120px wide with smaller flag/dial code display
- [ ] Dropdown opens to 300px × 240px with search functionality
- [ ] Country list is scrollable and searchable
- [ ] Selected country updates phone validation correctly

### Sign In / Sign Up Navigation
- [ ] URL parameter `?tab=signin` opens Sign In tab
- [ ] URL parameter `?tab=signup` opens Sign Up tab
- [ ] Default (no parameter) opens Sign In tab
- [ ] Tab switching resets both flows correctly

### Internet Identity Passkey Login
- [ ] "Passkey Login" button is visible on both Sign In and Sign Up tabs
- [ ] Clicking "Passkey Login" initiates Internet Identity flow
- [ ] After successful login, user is redirected to home page (or return path if set)
- [ ] Loading state shows "Connecting..." during authentication
- [ ] Error handling displays user-friendly messages

### OTP Flow
- [ ] "Send OTP" button is disabled until valid phone number is entered
- [ ] OTP is sent and displayed in test mode
- [ ] 6-digit OTP input is displayed after sending
- [ ] 2-minute countdown timer is visible and accurate
- [ ] "Verify OTP" button is disabled until 6 digits are entered
- [ ] Correct OTP verification redirects to home page (or return path if set)
- [ ] Incorrect OTP shows error with remaining attempts
- [ ] After 3 failed attempts, lockout modal is displayed
- [ ] Lockout modal shows 10-minute countdown
- [ ] "Resend OTP" is disabled until timer expires
- [ ] "Change Number" returns to phone input step

### Sign Up Additional Fields
- [ ] Name field is optional but validates if provided (min 2 characters)
- [ ] Email field is optional but validates if provided (valid email format)
- [ ] Inline error messages appear below respective fields
- [ ] Validation errors prevent OTP sending

### Golden Hover/Glow Effects
- [ ] Category buttons show gold text glow on hover
- [ ] "Send OTP" button has pearl blue background with hover effect
- [ ] "Verify OTP" button has pearl blue background with hover effect
- [ ] All interactive elements have appropriate hover states

### Error Handling
- [ ] Invalid phone number shows inline error
- [ ] OTP send failure shows toast notification
- [ ] OTP verify failure shows toast notification
- [ ] Internet Identity login failure shows toast notification
- [ ] All error messages are user-friendly and in English

### Accessibility
- [ ] All buttons meet 44px minimum touch target
- [ ] Focus states are visible on all interactive elements
- [ ] Screen reader labels are appropriate
- [ ] Keyboard navigation works correctly

### Dark Luxury Theme
- [ ] Background maintains dark ocean aesthetic
- [ ] Text uses pearl off-white color
- [ ] Borders use pearl blue with appropriate opacity
- [ ] Cards have backdrop blur effect
- [ ] Overall theme is consistent with existing design

### Performance
- [ ] No console errors on page load
- [ ] No console errors during login flow
- [ ] Animations are smooth (or disabled for reduced-motion)
- [ ] Page loads quickly without layout shifts

## Notes
- Test on multiple devices (desktop, tablet, mobile)
- Test on multiple browsers (Chrome, Firefox, Safari)
- Verify reduced-motion preferences are respected
- Confirm all flows work end-to-end without crashes
