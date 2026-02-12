# Specification

## Summary
**Goal:** Replace the home-top “Shop by Style” block with a new “Explore by Style” badge carousel (5 categories) and add working navigation to category collection destinations.

**Planned changes:**
- Add a new top-of-home section above the existing CinematicHeroSlider with a centered serif heading “Explore by Style” using the gold accent (#D4AF37).
- Implement a single-row, horizontally scrollable carousel of 5 curved badges (25px radius) using the dark luxury palette (black background, pearl blue #7FB3D5) with a small circular icon/image on the left and the specified label text:
  - Banarasi → “Zari Royalty”
  - Organza → “Sheer Elegance”
  - Georgette → “Flowing Grace”
  - Silk → “Silk Symphony”
  - Kalamkari → “Heritage Artistry”
- Add lightweight hover interactions on badges (gold glow/border highlight + subtle lift/scale to ~1.05), respecting reduced-motion preferences.
- Make each badge clickable with SPA navigation to a consistent category collection route for all 5 slugs, ensuring the destination renders meaningful storefront content (no blank/empty screens).
- Add 5 static icon images under `frontend/public/assets/generated` and use them in the badges (no backend image serving).

**User-visible outcome:** On the home page, users see an “Explore by Style” swipeable badge carousel with 5 labeled style categories; tapping/clicking a badge navigates to a working category collection page without blank screens.
