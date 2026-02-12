# Phase 3 Verification Checklist

## Deployment URLs
- **Draft URL**: _[To be filled after deployment]_
- **Live URL**: _[To be filled after deployment]_

---

## ✅ Product Persistence Verification

### Backend Storage
- [ ] Products added via admin panel are stored in canister memory
- [ ] Products persist after browser refresh (reload page → products still visible)
- [ ] Products persist after canister upgrade/redeploy
- [ ] Product updates via admin edit are reflected in storefront
- [ ] Product deletions via admin remove items from storefront

### Admin Panel CRUD
- [ ] Admin can create new products with all fields (name, price, desc, images, fabric, variants, blouse, category)
- [ ] Admin products list shows all saved products
- [ ] Edit button opens product for editing with pre-filled data
- [ ] Delete button removes product from canister (with confirmation)
- [ ] After delete, product does not reappear on page refresh

---

## ✅ Fetch Error Handling

### Error State (Network/Canister Failure)
- [ ] When fetch fails, toast appears with exact text: "Failed to load products. Try refreshing."
- [ ] Toast uses premium styling (gold border, pearl off-white text)
- [ ] Toast appears only once per error event (no spam)
- [ ] Error state component displays with retry button
- [ ] Retry button attempts to refetch products
- [ ] No blank screen or crash on error

### Empty State (Zero Products)
- [ ] When fetch succeeds but returns 0 products, no error toast is shown
- [ ] Empty state displays exact headline: "No products yet — add in admin panel" (gold text)
- [ ] If logged in as admin, pearl blue "Go to Admin Panel" button is visible
- [ ] If not admin, standard "Back to Home" button is shown
- [ ] Admin CTA button navigates to `/admin/products` via SPA (no reload)
- [ ] No blank screen or crash on empty catalog

### Old Error Message Removed
- [ ] The old "Could not fetch products from the backend" message is NOT shown anywhere in normal UI flow

---

## ✅ Admin Products List

### Display & Actions
- [ ] Admin products list loads from `adminListProducts` backend method
- [ ] List reflects canister-persisted state (not dummy/local data)
- [ ] Each product shows edit and delete buttons
- [ ] Delete confirmation dialog appears before deletion
- [ ] After delete, product disappears from list immediately (no manual reload needed)
- [ ] After delete + refresh, product remains deleted (not restored)
- [ ] Edit action navigates to edit page with product data pre-filled
- [ ] After edit + save, updated values visible in admin list and storefront

---

## ✅ UI Quality & Responsiveness

### Golden Hover/Glow Effects
- [ ] All buttons have golden hover/glow treatment consistent with existing theme
- [ ] Admin CTA button (pearl blue) has hover glow effect
- [ ] Retry button has golden hover glow
- [ ] No visual regressions in button styling

### Dark Luxury Theme
- [ ] Empty state card matches dark luxury aesthetic
- [ ] Error state card matches dark luxury aesthetic
- [ ] All new components use theme tokens (no hardcoded colors except for specific gold/pearl blue accents)
- [ ] Text contrast is readable in both light and dark modes

### Responsive Design
- [ ] Collections page works on mobile (1 column) and desktop (2 columns)
- [ ] Empty/error states are centered and readable on all screen sizes
- [ ] No horizontal scroll bugs
- [ ] No layout breakage on narrow viewports

### Stability
- [ ] No blank screens when navigating to collections/category pages
- [ ] No crashes when backend is unavailable
- [ ] No crashes when catalog is empty
- [ ] Loading skeletons display correctly during fetch
- [ ] Smooth transitions between loading → error/empty/success states

---

## ✅ End-to-End Test Scenario

### Test Flow
1. [ ] Open admin panel and add one product with all fields filled
2. [ ] Navigate to collections page (`/collections`)
3. [ ] Verify product appears in grid
4. [ ] Reload page (hard refresh)
5. [ ] Verify product still appears (persistence confirmed)
6. [ ] Navigate to admin products list
7. [ ] Verify product appears with edit/delete buttons
8. [ ] Click delete, confirm deletion
9. [ ] Verify product disappears from admin list
10. [ ] Navigate back to collections page
11. [ ] Verify product no longer appears in storefront
12. [ ] Reload page
13. [ ] Verify product remains deleted (not restored)

---

## 📝 Notes
- All acceptance criteria from implementation plan must pass
- Products must survive reload and canister upgrade
- Error vs empty states must be clearly distinguished
- Admin-only features must be gated correctly
- No regressions in existing functionality

---

**Verification Date**: _[To be filled]_  
**Verified By**: _[To be filled]_  
**Status**: _[Pass/Fail]_
