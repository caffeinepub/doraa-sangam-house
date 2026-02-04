import { ADMIN_PRINCIPAL } from '../adminConfig';

export interface AdminCheckResult {
  isAdmin: boolean;
  reason?: string;
  isAuthenticated: boolean;
}

export function checkAdminAccess(
  isLoginSuccess: boolean,
  principal?: string
): AdminCheckResult {
  // Check if user has a valid non-anonymous principal (either from restored session or fresh login)
  const isAuthenticated = isLoginSuccess || (!!principal && principal !== '2vxsx-fae');
  
  if (!isAuthenticated || !principal) {
    return {
      isAdmin: false,
      isAuthenticated: false,
      reason: 'Please log in with Internet Identity to access the admin panel.',
    };
  }

  if (principal !== ADMIN_PRINCIPAL) {
    return {
      isAdmin: false,
      isAuthenticated: true,
      reason: 'Access denied. You do not have admin privileges.',
    };
  }

  return { isAdmin: true, isAuthenticated: true };
}
