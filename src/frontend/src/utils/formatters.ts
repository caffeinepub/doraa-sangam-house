/**
 * Utility functions for formatting product display data
 */

/**
 * Format review count for compact display (e.g., 1100 → "1.1k")
 */
export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
}

/**
 * Format rating with star symbol (e.g., 4.2 → "4.2 ★")
 */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ★`;
}

/**
 * Calculate discount percentage from price and MRP
 * Uses deterministic calculation based on product ID to avoid per-render randomness
 */
export function calculateDiscount(productId: string, price: number): { mrp: number; discount: number } {
  // Generate deterministic discount (15-30%) based on product ID hash
  const hash = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const discount = 15 + (hash % 16); // 15-30%
  const mrp = Math.round(price * (1 + discount / 100));
  
  return { mrp, discount };
}

/**
 * Format price with Indian locale
 */
export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}
