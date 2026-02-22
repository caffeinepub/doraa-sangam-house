# Specification

## Summary
**Goal:** Transform the home page into a Vastrado-style e-commerce layout with centered logo, horizontal category navigation, product grid with on-model saree images, user dashboard with theme switcher (Dark/Light/System), and maintain luxury aesthetics across both themes.

**Planned changes:**
- Center DoRaa Sangam House logo at top in elegant gold font on dark background
- Add horizontal category navigation bar below logo with Shirts, Kurta, Bottoms, Sarees, Shop All (cyan/teal buttons, golden hover glow, horizontally scrollable on mobile)
- Add user profile icon in top right that opens dashboard
- Display product grid with saree cards showing on-model images, name, price, discount badge, Add to Cart button (16px curved corners, hover lift + golden border glow)
- Add optional hero banner above product grid with "New Arrivals - Flat 60% Off" text overlay
- Create user dashboard with Profile, Orders, Addresses tabs displaying user details (name, email, phone, save button)
- Add Theme Switcher in dashboard with three options: Dark (#0B0E0C bg, white text), Light (#F8F9FA bg, #1A1A1A text), System (follows OS preference)
- Save theme choice in localStorage and apply on page load
- Ensure light theme maintains clean readability with proper contrast while preserving luxury aesthetic
- Apply golden hover glow consistently across all buttons and icons in both themes
- Make interface fully responsive (horizontal scroll categories on mobile, centered logo, 1-2 column product grid)
- Require authentication for dashboard and cart actions with login prompt for unauthenticated users
- Preserve all existing functionality including Internet Identity, OTP login, shopping cart, and category carousel

**User-visible outcome:** Users see a premium e-commerce home page with centered branding, easy category navigation, beautiful product cards with saree images, can access their dashboard to view profile/orders/addresses, can switch between Dark/Light/System themes with the choice persisting across sessions, and experience consistent luxury styling with golden hover effects in both themes.
