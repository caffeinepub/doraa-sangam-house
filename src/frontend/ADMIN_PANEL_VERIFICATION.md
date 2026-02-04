# Admin Panel Verification Guide

## Manual Testing Checklist

### Routes to Test
- `/admin/login` - Admin login page with Internet Identity
- `/admin` - Admin dashboard (redirects to `/admin/dashboard`)
- `/admin/dashboard` - Dashboard with metric cards
- `/admin/products` - Products management page

### Authentication Flow
1. **Admin Login Page (`/admin/login`)**
   - [ ] OceanBackground visible behind login card
   - [ ] Internet Identity login button works
   - [ ] Successful login redirects to `/admin/dashboard`
   - [ ] Non-admin principals show "Access Denied" alert with "Switch Account" button
   - [ ] Initialization state shows spinner without premature access denial

2. **Admin Gate Protection**
   - [ ] Unauthenticated users redirected to `/admin/login`
   - [ ] Non-admin authenticated users see access denied message
   - [ ] Admin users can access all admin routes

### Dashboard (`/admin/dashboard`)
- [ ] OceanBackground visible behind dashboard content
- [ ] Four metric cards display correctly (Products, Categories, Draft Uploads, Pending Reviews)
- [ ] Sidebar navigation works (Dashboard, Products links)
- [ ] Header shows formatted Principal
- [ ] Logout button works and redirects to `/admin/login`
- [ ] Gold button glow visible on all interactive buttons

### Products Management (`/admin/products`)
- [ ] OceanBackground visible behind products page
- [ ] Product grid displays correctly
- [ ] "Add Product" button opens create dialog
- [ ] Product form validates all fields
- [ ] Category dropdown shows 7 Banarasi categories
- [ ] Image dropzone accepts multiple images
- [ ] Save button triggers gold wave animation (or reduced-motion fallback)
- [ ] Success toast appears on save
- [ ] Edit button opens dialog with pre-filled data
- [ ] Delete button shows confirmation dialog
- [ ] Delete confirmation removes product from grid
- [ ] Gold button glow visible on all buttons (Add, Save, Edit, Delete, Cancel)

### Visual & Animation Checks
- [ ] OceanBackground animation runs smoothly on all admin pages
- [ ] Background opacity ~0.55 maintains content readability
- [ ] Reduced-motion preference simplifies background to static presentation
- [ ] Gold pulse glow animation visible on all buttons (continuous subtle pulse)
- [ ] Admin save animations work (gold wave fade or reduced-motion fallback)
- [ ] No layout shifts or content obscured by background
- [ ] Sidebar and header remain readable with background active

### Error Handling
- [ ] Form validation errors display correctly
- [ ] Network errors show appropriate messages
- [ ] Invalid admin access shows clear denial reason
- [ ] Session restoration works correctly on page refresh

### Notes
- **Hardcoded Admin Principal:** `aaaaa-aa` (for testing only)
- **State Persistence:** Products stored in-memory only (session-lifetime)
- **Background Animation:** Persistent across all admin routes with performance optimizations
- **Button Styling:** Global gold pulse glow applied via CSS (no per-button manual classes needed)

---

© 2026. Built with love using [caffeine.ai](https://caffeine.ai)
