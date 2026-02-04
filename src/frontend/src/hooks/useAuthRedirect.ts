import { useCallback } from 'react';
import { useStorefrontAuth } from './useStorefrontAuth';

export function useAuthRedirect() {
  const { isAuthenticated, setFlashMessage, setReturnPath } = useStorefrontAuth();

  const requireAuth = useCallback((navigate: (path: string) => void, currentPath: string) => {
    if (!isAuthenticated) {
      setFlashMessage('Please login to continue', 'info');
      setReturnPath(currentPath);
      navigate('/login?tab=signin');
      return false;
    }
    return true;
  }, [isAuthenticated, setFlashMessage, setReturnPath]);

  return { requireAuth };
}
