import { ADMIN_PRINCIPAL } from '../admin/adminConfig';

/**
 * Client-side helper to check if the current user is an admin
 * based on their Internet Identity principal
 */
export function isAdminClient(principal?: string): boolean {
  if (!principal) return false;
  // Anonymous principal check
  if (principal === '2vxsx-fae') return false;
  return principal === ADMIN_PRINCIPAL;
}
