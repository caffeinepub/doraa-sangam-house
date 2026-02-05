# Admin Panel Verification Checklist

This document provides a comprehensive checklist to verify the admin panel functionality after implementation.

## Core Admin Access Control

### Admin Login Page (`/admin/login`)
- [ ] Page loads with Internet Identity login button
- [ ] Clicking login button opens Internet Identity modal
- [ ] After successful login with admin principal, user is redirected to admin dashboard
- [ ] After successful login with non-admin principal, access denied alert is shown
- [ ] "Switch Account" button appears for non-admin principals
- [ ] Clicking "Switch Account" clears session and allows re-login
- [ ] Existing authenticated admin sessions auto-redirect to dashboard
- [ ] Loading states display properly during authentication check

### Admin Gate Protection
- [ ] Unauthenticated users attempting to access admin routes are redirected to `/admin/login`
- [ ] Non-admin authenticated users see access denied message
- [ ] Admin users can access all admin routes without interruption
- [ ] Restored authenticated sessions are properly recognized (no false redirects)

## Admin Dashboard (`/admin`)
- [ ] Dashboard displays 4 metric cards with English labels
- [ ] Sidebar navigation shows "Dashboard" and "Products" links
- [ ] Header displays formatted admin Principal
- [ ] Logout button is visible and functional
- [ ] Dark luxury theme styling is consistent
- [ ] OceanBackground is visible on admin dashboard
- [ ] OceanBackground does not interfere with UI interactions

## Admin Products List (`/admin/products`)
- [ ] Products list loads from canister backend
- [ ] Loading skeleton displays while fetching
- [ ] Error state displays if fetch fails
- [ ] Each product card shows name, price, category, and image
- [ ] Edit button navigates to edit page with product ID
- [ ] Delete button opens confirmation dialog
- [ ] Confirming delete removes product and refreshes list
- [ ] Empty state displays when no products exist
- [ ] Golden hover effects work on action buttons
- [ ] OceanBackground is visible on products list page
- [ ] OceanBackground does not interfere with UI interactions

## Admin Product Create (`/admin/products/create`)
- [ ] Form displays all required fields (name, price, description, images, fabric, colors, sizes, blouse pairing, category)
- [ ] Image dropzone accepts 5-10 images with validation
- [ ] Fabric dropdown shows presets with custom option
- [ ] Color swatches multi-select works correctly
- [ ] Size checkboxes allow multiple selections
- [ ] Category dropdown shows exactly 7 options
- [ ] Save button is disabled when form is invalid
- [ ] Save button shows loading state during submission
- [ ] Success toast appears after successful save
- [ ] Navigation returns to products list with highlight marker
- [ ] Inline error messages display for validation failures
- [ ] Pearl blue save button has gold glow on hover
- [ ] OceanBackground is visible on create page
- [ ] OceanBackground does not interfere with form interactions

## Admin Product Edit (`/admin/products/edit/:id`)
- [ ] Form pre-populates with existing product data
- [ ] All fields are editable
- [ ] Update button saves changes to canister
- [ ] Delete button opens confirmation dialog
- [ ] Confirming delete removes product and navigates to list
- [ ] Success toast appears after successful update
- [ ] Navigation returns to products list with highlight marker
- [ ] Error handling displays appropriate messages
- [ ] OceanBackground is visible on edit page
- [ ] OceanBackground does not interfere with form interactions

## Bulk Upload
- [ ] CSV file upload validates format
- [ ] ZIP file upload extracts and validates CSV
- [ ] Progress bar displays during upload
- [ ] Success toast shows "X products added" format
- [ ] Error messages display for invalid data
- [ ] Products list refreshes after successful bulk import

## Admin Layout & Navigation
- [ ] Sidebar navigation is always visible
- [ ] Active route is highlighted in sidebar
- [ ] Logout button clears authentication and redirects to login
- [ ] Header displays formatted Principal consistently
- [ ] Dark luxury theme is consistent across all admin pages

## Global Button Glow Behavior
- [ ] All primary action buttons (Save, Update, Delete, etc.) have golden glow on hover
- [ ] Golden glow animation is smooth and consistent
- [ ] Glow effect does not interfere with button functionality
- [ ] Glow effect respects reduced-motion preferences

## Regression Checks (Post-OTP Integration)
- [ ] Standard admin Internet Identity login page (`/admin/login`) still works as before
- [ ] Admin gating behavior remains unchanged (non-admins cannot access admin routes)
- [ ] Hidden `/admin-login` OTP mock page is updated to call canister methods
- [ ] OTP mock page does not interfere with standard admin login flow
- [ ] User authentication and authorization flows remain unaffected
