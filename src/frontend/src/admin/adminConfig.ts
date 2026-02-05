// Hardcoded admin Principal for testing
// Replace this with your actual Internet Identity Principal
export const ADMIN_PRINCIPAL = '2vxsx-fae';

export const ADMIN_ROUTES = {
  LOGIN: '/admin/login',
  DASHBOARD: '/admin',
  PRODUCTS: '/admin/products',
  PRODUCTS_CREATE: '/admin/products/create',
  PRODUCTS_EDIT: '/admin/products/edit',
} as const;
