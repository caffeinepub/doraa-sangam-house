# Specification

## Summary
**Goal:** Persist product data in the Motoko canister (stable storage), fix storefront product fetch error vs empty-catalog handling, and ensure the admin products list supports persisted edit/delete.

**Planned changes:**
- Implement stable canister storage for products so admin add/update/delete persists across reloads and canister upgrades.
- Ensure backend product APIs store/return required fields (name, price, description, images, fabric, variants, blousePair, category) and that `publicListProducts()` returns all persisted products for the storefront.
- Update `useGetAllProducts` to surface real fetch failures as React Query error state (not as an empty array), and show a single toast on failures with: "Failed to load products. Try refreshing."
- Replace the old storefront failure mode ("Could not fetch products from the backend") with: (a) premium empty state when catalog is empty and (b) toast + stable UI when fetch fails.
- Add premium empty-state UI on collections/category pages showing gold headline text "No products yet — add in admin panel" and, for admins only, a pearl-blue CTA button navigating to the existing admin products route.
- Ensure admin product list loads from `adminListProducts`, and edit/delete actions update canister persistence and reflect immediately and after refresh.
- Add a Phase 3 post-deploy verification checklist + draft/live URL in the documentation/release notes flow.

**User-visible outcome:** Products created in the admin panel persist reliably; storefront category/collection pages show a premium empty state when there are no products and show a clear error toast only when loading fails; admins can view/edit/delete persisted products from the admin list without regressions or blank screens.
