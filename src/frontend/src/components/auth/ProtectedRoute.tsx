import { useEffect, useState } from 'react';
import { useStorefrontAuth } from '../../hooks/useStorefrontAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
}

export default function ProtectedRoute({ children, navigate }: ProtectedRouteProps) {
  const { isAuthenticated, setFlashMessage, setReturnPath } = useStorefrontAuth();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !hasRedirected) {
      setFlashMessage('Please login to continue', 'info');
      setReturnPath(window.location.pathname);
      setHasRedirected(true);
      navigate('/login?tab=signin');
    }
  }, [isAuthenticated, navigate, setFlashMessage, setReturnPath, hasRedirected]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
