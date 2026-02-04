/**
 * Full clean-boot reset utility
 * Clears all storefront-related client-side state including:
 * - OTP session, flash messages, return paths, lockout state
 * - Cart and wishlist
 * - User profile fallback
 * - React Query cache
 * - Internet Identity session
 */

export interface CleanBootResetOptions {
  clearReactQuery?: () => void;
  clearInternetIdentity?: () => Promise<void>;
  clearCartState?: () => void;
  clearWishlistState?: () => void;
}

// Storage keys used across the app
export const STORAGE_KEYS = {
  OTP_SESSION: 'doraa-otp-session',
  FLASH_MESSAGE: 'doraa-flash-message',
  RETURN_PATH: 'doraa-return-path',
  OTP_LOCKOUT: 'doraa-otp-lockout',
  OTP_ATTEMPTS: 'doraa-otp-attempts',
  CART: 'doraa-cart',
  WISHLIST: 'wishlist',
  USER_PROFILE_LOCAL: 'doraa_user_profile_local',
  ADMIN_PRODUCTS: 'doraa-admin-products',
} as const;

/**
 * Execute a full clean-boot reset
 * Clears all persisted state and in-memory caches
 */
export async function executeFullCleanBootReset(options: CleanBootResetOptions = {}): Promise<void> {
  console.log('[Clean Boot Reset] Starting full reset...');

  // Clear all localStorage keys
  const keysToRemove = Object.values(STORAGE_KEYS);
  keysToRemove.forEach((key) => {
    try {
      localStorage.removeItem(key);
      console.log(`[Clean Boot Reset] Cleared: ${key}`);
    } catch (error) {
      console.warn(`[Clean Boot Reset] Failed to clear ${key}:`, error);
    }
  });

  // Clear sessionStorage
  try {
    sessionStorage.clear();
    console.log('[Clean Boot Reset] Cleared sessionStorage');
  } catch (error) {
    console.warn('[Clean Boot Reset] Failed to clear sessionStorage:', error);
  }

  // Clear in-memory cart state
  if (options.clearCartState) {
    try {
      options.clearCartState();
      console.log('[Clean Boot Reset] Cleared cart state');
    } catch (error) {
      console.warn('[Clean Boot Reset] Failed to clear cart state:', error);
    }
  }

  // Clear in-memory wishlist state
  if (options.clearWishlistState) {
    try {
      options.clearWishlistState();
      console.log('[Clean Boot Reset] Cleared wishlist state');
    } catch (error) {
      console.warn('[Clean Boot Reset] Failed to clear wishlist state:', error);
    }
  }

  // Clear React Query cache
  if (options.clearReactQuery) {
    try {
      options.clearReactQuery();
      console.log('[Clean Boot Reset] Cleared React Query cache');
    } catch (error) {
      console.warn('[Clean Boot Reset] Failed to clear React Query cache:', error);
    }
  }

  // Clear Internet Identity session
  if (options.clearInternetIdentity) {
    try {
      await options.clearInternetIdentity();
      console.log('[Clean Boot Reset] Cleared Internet Identity session');
    } catch (error) {
      console.warn('[Clean Boot Reset] Failed to clear Internet Identity:', error);
    }
  }

  console.log('[Clean Boot Reset] Reset complete');
}

/**
 * Get a list of all storage keys that will be cleared
 */
export function getStorageKeysForReset(): string[] {
  return Object.values(STORAGE_KEYS);
}
