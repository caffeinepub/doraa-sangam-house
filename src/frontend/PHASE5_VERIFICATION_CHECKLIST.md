# Phase 5 Verification Checklist

[Previous Phase 5 content preserved...]

---

## Phase 6 Verification Appendix

### SEO Meta Tags
- [ ] Product detail page updates document.title
- [ ] og:title, og:description, og:image present
- [ ] twitter:card, twitter:title, twitter:description, twitter:image present
- [ ] Canonical URL matches /product/:id format
- [ ] Meta tags reset when closing product detail

### Product URL Routes
- [ ] Direct navigation to /product/:id works
- [ ] Product card click navigates to /product/:id
- [ ] Category overlay product click navigates to /product/:id
- [ ] Closing product detail returns to previous route

### Robots & Sitemap
- [ ] /robots.txt accessible and valid
- [ ] /sitemap.xml accessible and valid XML
- [ ] Sitemap includes storefront URLs
- [ ] Admin routes excluded from sitemap

### PWA Install
- [ ] manifest.json loads in DevTools
- [ ] Service worker registers successfully
- [ ] "Install App" prompt appears (Chrome/Edge)
- [ ] App icon and name correct in install prompt
- [ ] Offline: App shell loads from cache

### Logout & Auto-Logout
- [ ] Logout clears OTP session
- [ ] Logout clears Internet Identity
- [ ] Logout clears React Query cache
- [ ] Logout redirects to /login?tab=signin
- [ ] Protected routes redirect after logout
- [ ] 30-minute inactivity triggers auto-logout
- [ ] Auto-logout shows flash message on login page

---

**Phase 6 Complete** ✅
