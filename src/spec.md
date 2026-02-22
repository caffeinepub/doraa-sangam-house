# Specification

## Summary
**Goal:** Transform the entire application from dark theme to a premium light theme with Banarasi saree aesthetics, featuring ivory/pearl backgrounds, antique gold accents, luxury typography, and a Vastrado-style home page layout.

**Planned changes:**
- Replace all dark theme colors (navy blue, black backgrounds) with soft warm ivory (#F8F5F0) backgrounds, antique gold (#C9A96E) accents, blush rose gold (#E8C0C8) secondary accents, and deep charcoal (#1A1A1A) text
- Update typography to use Playfair Display ExtraBold for headings, Great Vibes script for category names, Lora Regular for body text, and Montserrat Bold/Raleway ExtraBold for buttons
- Implement Vastrado-style home page with centered gold logo, horizontal category navigation (Shirts, Kurta, Bottoms, Sarees, Shop All), profile icon on right, and product card grid below
- Add dashboard with Profile/Orders/Addresses tabs and Appearance section showing Light theme as default and only active option
- Update CSS variables and Tailwind configuration to reflect new light theme palette
- Ensure 100% consistent appearance across laptop, mobile, and tablet with responsive scaling using rem units and clamp()
- Apply premium hover effects (warm gold glow, lift, scale) consistently across all interactive elements

**User-visible outcome:** Users will experience a premium light-themed luxury saree shopping interface with ivory backgrounds, antique gold accents, elegant typography, Vastrado-style navigation, and smooth responsive design across all devices.
