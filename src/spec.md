# Specification

## Summary
**Goal:** Expand the Banarasi saree catalog to ~150 products and elevate the Collections/product browsing experience with richer animations, improved product card interactions, and enhanced quick-details—while keeping everything client-side and responsive.

**Planned changes:**
- Expand the static Banarasi product dataset to ~150 items and ensure it’s fully wired into all existing product render paths (collections sliders/sections, grids, quick view, PDP overlay, wishlist, cart).
- Add a client-side heuristic auto-grouping mechanism to assign each product to exactly one creative collection (e.g., Zari Legacy, Silk Symphony, Royal Motif, Blooming Banarasi, Midnight Elegance, Celestial Threads, Eternal Gold) and render separate collection sections/sliders with accurate counts.
- Update the Collections browsing flow with scroll reveal per category, gold wave transitions between sections, and horizontal carousels supporting arrows, dots, and optional autoplay/auto-swipe (respecting prefers-reduced-motion).
- Enhance product card visuals to a consistent mannequin/on-model-style presentation, with hover/focus spin/zoom and fabric ripple effects that are performant and reduced-motion friendly.
- Improve product card hover micro-interactions (lift, pearl-blue + gold glow border, subtle scale, micro-ripple under image) without layout shift; add glowing/pulsing wishlist and add-to-cart icons.
- Implement a clear “saree flows/fly-to-cart” success animation tied to the cart icon/badge area on add-to-cart (reduced-motion friendly).
- Expand the quick-details overlay to include: color swatches, pattern name, fabric label (“Banarasi Silk”), price, size chart dropdown/accordion, blouse pairing suggestions, star rating + reviews count, share action, COD badge, and express delivery tag (English labels).
- Ensure image click supports a zoom-lens style interaction and provides a clear path to open the full product detail view (PDP overlay), preserving existing quick view behavior.
- Polish the overall Banarasi showcase styling toward a dark luxury look (dark black background, pearl shimmer particle ambience, cinematic scroll reveals) while maintaining responsiveness.
- Improve performance/SEO behavior by making images responsive + lazy-loaded and updating document title/meta description appropriately for overlay-based product detail navigation.

**User-visible outcome:** Users can browse ~150 Banarasi sarees across multiple animated collection sections, interact with richer product cards (hover effects, quick-details, zoom), add items with a visible fly-to-cart animation, and use wishlist/cart flows smoothly across desktop and mobile with improved performance and metadata updates.
