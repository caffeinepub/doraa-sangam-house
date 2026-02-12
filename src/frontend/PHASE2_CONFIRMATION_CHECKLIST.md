# Phase 2: Premium Product Cards - Confirmation Checklist

## Draft/Live URL
**URL:** [To be filled after deployment]

---

## Verification Checklist

### ✅ Product Card Design (Myntra/Flipkart Style)
- [ ] Cards have **28px border-radius** (not 24px) with dark luxury black→navy gradient
- [ ] On-model saree images display full-width at top with lazy loading
- [ ] Product name uses serif font in pearl off-white color
- [ ] Price row shows:
  - Current price in gold (#D4AF37)
  - MRP with gray strike-through
  - Discount percentage in pearl blue
- [ ] Ratings display as "X.X ★" format in gold
- [ ] Review count shows compact format (e.g., "1.1k")
- [ ] Premium badges display with exact English strings:
  - "Best Price with coupon"
  - "Express Delivery"
  - "Top Rated"
- [ ] Wishlist (heart) and Cart icons at bottom with proper styling
- [ ] All interactive elements have gold/pearl blue glow on hover

### ✅ Hover Effects & Animations (Phase 2 Spec)
- [ ] Card lifts **-8px** and scales to **1.05** on hover (not 1.03)
- [ ] Pearl blue border glow appears on hover (~400ms transition)
- [ ] Image zooms to **1.12** scale smoothly (not 1.10)
- [ ] **CSS-only** fabric ripple/wave effect visible over image (no GSAP)
- [ ] Wishlist and cart buttons pulse with gold/pearl blue glow
- [ ] All animations are smooth (~400ms) and impressive
- [ ] No jank or performance issues
- [ ] Reduced-motion preferences respected

### ✅ Details Overlay (Dummy Values - Phase 2)
- [ ] Quick overlay appears on desktop hover
- [ ] Color swatches display exactly **Red, Blue, Green** as visual circles (dummy placeholders)
- [ ] Fabric shows exactly **"Banarasi Silk"** (dummy placeholder)
- [ ] **"Size chart"** link navigates to dummy size chart page (SPA, no reload)
- [ ] Blouse pairing displays exactly **"Matching silk blouse included"** (dummy placeholder)
- [ ] All labels in English ("Available Colors", "Fabric", "Size chart", "Blouse Pairing")
- [ ] Overlay doesn't block wishlist/cart buttons
- [ ] Click/tap opens full detail view
- [ ] No flickering during hover transitions

### ✅ Load More Button (No Infinite Scroll)
- [ ] Listing pages do **not** auto-load on scroll (IntersectionObserver sentinel not used for products)
- [ ] Visible **"Load More"** button appears when more products available
- [ ] Clicking "Load More" appends/reveals additional products
- [ ] Button disappears/disabled when all products shown
- [ ] Button styling matches dark luxury theme (gold/pearl accents, clear hover/focus states)
- [ ] No blank screens or navigation regressions

### ✅ Responsive Design & Layout (Phase 2 Grid)
- [ ] Desktop: **2 columns** (not 3) with consistent gaps
- [ ] Mobile: **1 column** with appropriate vertical spacing
- [ ] No overlapping cards, badges, or buttons
- [ ] Spacing and alignment correct across all breakpoints
- [ ] Touch devices don't get stuck in hover states
- [ ] Images lazy load properly
- [ ] Cards do not overflow viewport

### ✅ Size Chart Page
- [ ] Navigating to `/size-chart` renders non-empty page
- [ ] Page shows clear **"Size Chart"** title in English
- [ ] Page matches dark luxury theme (not blank/default screen)
- [ ] Clear **Back** button using SPA navigation (history back or navigate)

### ✅ Dark Luxury Theme Consistency
- [ ] Black→navy gradient background on cards
- [ ] Pearl blue (#7FB3D5) accents used correctly
- [ ] Gold (#D4AF37) accents used for prices and highlights
- [ ] All text readable with proper contrast
- [ ] Theme consistent across all card states

### ✅ Bug-Free Experience
- [ ] No console errors or warnings
- [ ] No animation glitches or stuck states
- [ ] Hover effects work correctly on desktop
- [ ] Touch interactions work on mobile/tablet
- [ ] Reduced-motion preferences respected
- [ ] All links and buttons functional
- [ ] Quick view and detail view open correctly

---

## Additional Notes
[Space for any additional observations or issues found during testing]

---

**Verified by:** _________________  
**Date:** _________________  
**Status:** ☐ Approved ☐ Needs Revision
