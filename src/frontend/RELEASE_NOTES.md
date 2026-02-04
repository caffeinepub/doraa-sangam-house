# DoRaa Sangam House - Release Notes

## Draft Version 22 - International Phone Input with Auto-Detection

### New Features
- **International Phone Input Component**
  - Advanced country selector with flags, names, and dial codes for 29 countries
  - Searchable dropdown for quick country selection
  - Auto-detection of user's country on page load using Intl API and timezone mapping
  - Defaults to India (+91) when detection fails or country is unsupported
  - Per-country phone number validation using libphonenumber-js
  - E.164 format storage for international phone numbers
  - Inline validation error messages with pearl blue text and gold border styling
  - Responsive layout: dropdown and input scale gracefully on mobile

### Updated Components
- **LoginPage**: Replaced basic phone input with InternationalPhoneInput component in both Sign In and Sign Up tabs
- **useStorefrontAuth**: Updated OTPSession type to explicitly document E.164 phone number format

### Technical Improvements
- Added libphonenumber-js for robust phone validation
- Created phoneCountries.ts utility with 29 popular countries
- Created detectCountryFromLocale.ts for browser-based country detection
- Created phoneValidation.ts for per-country validation and E.164 formatting
- Validation triggers on blur and on Send OTP click
- Send OTP button retains continuous gold-pulse-glow animation
- Dark luxury theme maintained throughout with pearl blue accents and gold hover effects

### QA Checklist
- [ ] Country code auto-detected on /login page load (defaults to India +91 if detection fails)
- [ ] Dropdown shows flags, country names, and dial codes for all 29 countries
- [ ] Dropdown is searchable (by country name, code, or dial code)
- [ ] Manual country selection works and updates the input placeholder
- [ ] Phone input validates based on selected country (e.g., India requires 10 digits)
- [ ] Inline error message appears below input with pearl blue text and gold border
- [ ] Error message reads: "Please enter a valid [Country] mobile number"
- [ ] Send OTP button has continuous gold pulse/glow animation
- [ ] Send OTP is blocked when phone number is invalid
- [ ] OTP flow works end-to-end (send → verify → dashboard)
- [ ] Changing country and resending OTP works correctly
- [ ] 3-attempt lockout with 10-minute timer still functions
- [ ] Responsive layout: no clipping or overlap on mobile devices
- [ ] No UI/hover/animation regressions on other pages

---

## Draft Version 21 - Login Flow & Persistent Background

### Features
- **Reliable Login Navigation**: Login button in header now correctly navigates to /login route
- **Premium OTP Flow**: 
  - Tabbed Sign In/Sign Up interface with +91 phone validation
  - Simulated 6-digit OTP with 6-slot input
  - 3-attempt lockout with 10-minute localStorage timer
  - Premium error styling with pearl blue and gold accents
  - Internet Identity fallback option
- **Duplicate Prevention**:
  - Wishlist: Add-only, no remove (first-time success animation preserved)
  - Cart: Blocks duplicate adds with premium popup showing pearl blue background and gold border
- **Persistent OceanBackground**: Canvas-based ocean wave animation now renders as a fixed layer across all routes including admin areas
- **Global Gold Button Glow**: All primary action buttons (Login, Logout, Send OTP, Verify OTP, etc.) now have continuous gold-pulse-glow animation

### Bug Fixes
- Fixed login button navigation from header
- Fixed duplicate cart/wishlist prevention logic
- Fixed OceanBackground visibility on admin routes

### Technical
- Updated Header.tsx to use navigate('/login') for Login button
- Updated ProductCard.tsx with isInCart check and premium popup
- Updated App.tsx to render OceanBackground as persistent fixed layer
- Updated index.css with gold-pulse-glow animation and premium toast styling
- Created ADMIN_PANEL_VERIFICATION.md with extended checklist

---

## Draft Version 20 - Admin Panel with Session-Lifetime CRUD

### Features
- **Admin Panel**: Full admin area with Internet Identity authentication
  - Hardcoded admin Principal for testing: `2vxsx-fae`
  - Dashboard with 4 metric cards (Products, Categories, Draft Uploads, Pending Reviews)
  - Products management page with create/edit/delete operations
  - Multi-image upload with drag-and-drop support
  - Product form with name, price, category, description, fabric, variants, and blouse pairing
  - Save animations: fade + gold wave effect with reduced-motion fallback
  - Dark luxury theme consistent with storefront
- **Admin Authentication**: 
  - AdminGate component checks authentication and admin access
  - AdminLoginPage with Internet Identity integration
  - Auto-redirect for authorized admins with existing sessions
  - Access denied alerts with "Switch Account" action for non-admin principals
  - Proper initialization state handling
- **Session-Lifetime State**: AdminProductsProvider manages in-memory product state without backend persistence

### Technical
- Created admin/ directory structure with pages, components, hooks, and utilities
- Updated useInternetIdentity to correctly set loginStatus to 'success' for restored sessions
- Updated adminGuard to properly handle both restored sessions and fresh logins
- Created ADMIN_PANEL_VERIFICATION.md with comprehensive testing checklist

---

## Draft Version 19 - Roller Tagline Animation

### Features
- **RollerTagline Component**: Premium per-letter roller/flip hover animation for "Delivered with Care" tagline
  - Pearl-to-gold color transition on hover/tap
  - Shimmer highlight sweep effect
  - Underline glow animation
  - Pointer-based interaction for both desktop hover and touch tap
  - Full reduced-motion support with graceful fallback
- **Perfect Centering**: Tagline now perfectly centered in hero slide with proper flex alignment

### Technical
- Created RollerTagline.tsx component with letter-by-letter animation
- Added roller animation utilities to index.css
- Updated CinematicHeroSlide.tsx to use RollerTagline component
- Added reduced-motion overrides for roller animations

---

## Draft Version 18 - Banarasi Showcase Enhancements

### Features
- **Banarasi Category Showcase**: 7 creative collections with horizontal carousels
  - Zari Legacy, Silk Symphony, Royal Heritage Weaves, Blooming Banarasi, Midnight Elegance, Celestial Threads, Eternal Gold
  - Manual autoplay implementation (no external plugin dependency)
  - Arrow and dot navigation
  - Gold wave divider between sections
  - Scroll reveal animations
- **Pearl Shimmer Ambience**: Canvas-based particle layer with organic movement and glow effects
- **Enhanced Quick Details Overlay**: 
  - Color swatches, fabric/pattern info, price/rating
  - Functional size chart accordion
  - Share action (Web Share API with clipboard fallback)
  - COD/express badges
  - Blouse pairing suggestions
- **Heuristic Product Grouping**: Client-side logic assigns each Banarasi product to exactly one collection based on observable attributes

### Technical
- Created BanarasiCategoryShowcase.tsx, BanarasiCollectionSection.tsx, BanarasiShowcaseAmbience.tsx, BanarasiQuickDetailsOverlay.tsx
- Created banarasiCategories.ts and banarasiGrouping.ts for category definitions and product assignment
- Created useDynamicMetadata.ts hook for updating document title and meta description
- Created useInfiniteScroll.ts hook for lazy loading
- Created BanarasiShowcaseSkeletons.tsx for loading states

---

## Draft Version 17 - Expanded Product Catalog

### Features
- **Expanded Product Catalog**: ~150 Banarasi sarees generated programmatically across 7 collections
  - Zari Legacy, Silk Symphony, Royal Heritage Weaves, Blooming Banarasi, Midnight Elegance, Celestial Threads, Eternal Gold
  - Each product has complete metadata: images, ratings, swatches, sizes, blouse suggestions
- **8 Original Non-Banarasi Products**: Preserved from previous versions

### Technical
- Updated dummyProducts.ts with programmatic generation logic
- Created 7 Banarasi collections with unique characteristics

---

## Draft Version 16 - RaaHi Chatbot

### Features
- **RaaHi Chatbot**: Fixed bottom-right floating bot avatar with slide-up chat panel
  - Pulsing animation on avatar
  - Typing dots indicator
  - Session-based auto-greeting
  - Rule-based conversational responses
  - Full reduced-motion support

### Technical
- Created RaaHiChatWidget.tsx component
- Created raahiResponses.ts for rule-based response engine
- Added RaaHi animations to index.css

---

## Draft Version 15 - Enhanced Add-to-Cart Animation

### Features
- **Cloth-like "Saree Flow" Animation**: Enhanced add-to-cart animation with gradient rectangle and rotation
  - Flies from product card to header cart icon
  - Reduced-motion fallback

### Technical
- Updated useAddToCartAnimation.ts with new animation logic
- Added fly-to-cart-saree animation to index.css

---

## Draft Version 14 - Gold Ripple Feedback

### Features
- **Gold Ripple Effects**: Custom hook for gold ripple feedback on interactive elements
  - Clipped to bounds
  - Supports both mouse and touch
  - Reduced-motion handling

### Technical
- Created useGoldRipple.ts hook
- Added ripple-container utility to index.css

---

## Draft Version 13 - Cinematic Hero Slider

### Features
- **Cinematic Hero Slider**: Main hero slider with 3 slides
  - Autoplay, arrow/dot navigation, swipe/drag gestures
  - Gold wave wipe transitions
  - Scroll hint arrow
- **Parallax Depth Layers**: Pearl shimmer particles, product silhouettes, gold waves
- **Letter-by-Letter Headline Reveal**: Staggered reveal timing
- **Dual CTAs**: "Shop Now" and "Explore Collections"

### Technical
- Created CinematicHeroSlider.tsx, CinematicHeroSlide.tsx, LetterRevealText.tsx
- Created hero/ directory with PearlShimmerParticles.tsx, ProductSilhouetteLayer.tsx, GoldWaveLayer.tsx, GoldWaveWipeTransition.tsx, ScrollHintArrow.tsx
- Created useCinematicSlider.ts, usePrefersReducedMotion.ts, useScrollReveal.ts hooks

---

## Draft Version 12 - Checkout Flow

### Features
- **Checkout Panel**: POS-style checkout form with guest option, contact fields, order summary
- **Checkout Success**: Success state with wave reveal animation
- **Checkout Sheet**: Right-side sheet managing checkout flow with success state transition and cart clearing

### Technical
- Created CheckoutPanel.tsx, CheckoutSuccess.tsx, CheckoutSheet.tsx components

---

## Draft Version 11 - Cart & Quick View

### Features
- **Cart Panel**: "Your Bag of Happiness" header, empty state prompting RaaHi, line items with quantity controls, checkout CTA
- **Cart Sheet**: Right-side sheet wrapper for CartPanel
- **Quick View Sheet**: Right-side slide-over panel for quick product preview

### Technical
- Created CartPanel.tsx, CartSheet.tsx, QuickViewSheet.tsx components

---

## Draft Version 10 - Product Detail View

### Features
- **Product Detail View**: Full-screen overlay with image zoom gallery, quantity selector, size chart, blouse suggestions

### Technical
- Created ProductDetailView.tsx component
- Created ImageZoomGallery.tsx component with mouse-based zoom interaction

---

## Draft Version 9 - Commerce State Management

### Features
- **Commerce Provider**: React context provider managing cart state with add/update/remove/clear operations
- **Local Storage Persistence**: Cart state persisted to localStorage

### Technical
- Created CommerceProvider.tsx and useCommerce.ts hook
- Created useLocalStorageState.ts hook

---

## Draft Version 8 - Product Catalog

### Features
- **Product Catalog**: 8 dummy products in masonry grid
- **Quick View & Product Detail Modals**: Wired to product cards

### Technical
- Created ProductsPage.tsx component
- Created dummyProducts.ts with 8 products

---

## Draft Version 7 - Enhanced Scroll Reveal

### Features
- **Enhanced Scroll Reveal**: Fade + slide + scale animations with stagger support
- **Immediate Reveal for Reduced-Motion**: Accessibility support

### Technical
- Updated useScrollReveal.ts hook
- Added scroll-reveal-enhanced utility to index.css

---

## Draft Version 6 - Premium Card Hover

### Features
- **Premium Card Hover**: Enhanced tilt and glow effects on product cards

### Technical
- Added premium-card-hover utility to index.css

---

## Draft Version 5 - Banarasi Product Card

### Features
- **Banarasi Product Card**: Mannequin effect, fabric ripple hover, micro-ripple layer, action icon glow

### Technical
- Added Banarasi product card utilities to index.css

---

## Draft Version 4 - Masonry Grid

### Features
- **Masonry Grid**: Responsive masonry layout for product cards

### Technical
- Added masonry-grid utilities to index.css

---

## Draft Version 3 - Radial Gradient Vignette

### Features
- **Radial Gradient Vignette**: Background vignette effect

### Technical
- Added bg-gradient-radial utility to index.css

---

## Draft Version 2 - OKLCH Color System

### Features
- **OKLCH Color System**: Dark luxury theme with pearl blue and gold accents

### Technical
- Updated index.css with OKLCH color tokens

---

## Draft Version 1 - Initial Setup

### Features
- **Initial Setup**: Basic app structure with header, footer, and routing

### Technical
- Created App.tsx, Header.tsx, Footer.tsx components
- Set up routing with TanStack Router
