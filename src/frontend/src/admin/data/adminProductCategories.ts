// Admin-only category list with exactly 7 categories for product upload form
export interface AdminProductCategory {
  id: string;
  label: string;
}

export const ADMIN_PRODUCT_CATEGORIES: AdminProductCategory[] = [
  { id: 'zari-legacy', label: 'Zari Legacy' },
  { id: 'silk-symphony', label: 'Silk Symphony' },
  { id: 'royal-motif', label: 'Royal Motif' },
  { id: 'blooming-banarasi', label: 'Blooming Banarasi' },
  { id: 'midnight-elegance', label: 'Midnight Elegance' },
  { id: 'celestial-threads', label: 'Celestial Threads' },
  { id: 'eternal-gold', label: 'Eternal Gold' },
];

export function getAdminCategoryLabel(categoryId: string): string {
  return ADMIN_PRODUCT_CATEGORIES.find((c) => c.id === categoryId)?.label || 'Unknown';
}
