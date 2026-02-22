# Specification

## Summary
**Goal:** Replace the dark navy blue theme with a stunning light aesthetic featuring warm ivory, antique gold, and blush rose gold colors throughout the entire application.

**Planned changes:**
- Replace all dark navy blue backgrounds with soft warm ivory/pearl cream (#F8F5F0)
- Apply gradient backgrounds to sections using linear-gradient(135deg, #F8F5F0 0%, #F5F0E6 100%)
- Update primary accent color to antique gold (#C9A96E) for buttons, borders, and highlights
- Apply secondary accent color of muted blush rose gold (#E8C0C8) to category titles and decorative elements
- Change primary text to deep charcoal (#1A1A1A) and secondary text to warm taupe gray (#5C4B51)
- Style buttons with antique gold background, dark text, and hover effects with deeper gold, lift, and glow
- Style cards with pure white background (#FFFFFF), 1px gold border, and soft shadow
- Update typography: Playfair Display ExtraBold for headings (#C9A96E), Great Vibes Regular for category titles (#E8C0C8), Lora Regular for body (#1A1A1A), and Montserrat Bold for buttons
- Remove all media query overrides for colors, fonts, and backgrounds to ensure consistent light theme across all viewports
- Audit and eliminate all dark navy blue colors from the codebase
- Preserve all existing functionality including login/OTP flow, Internet Identity, profile dashboard, cart, addresses, orders, and product catalog

**User-visible outcome:** Users will experience a beautiful light-themed application with warm, elegant colors featuring ivory backgrounds, antique gold accents, and sophisticated typography. The entire site displays consistently across desktop, laptop, and mobile devices with no dark blue elements remaining.
