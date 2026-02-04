import { useEffect } from 'react';
import { useStorefrontAuth } from '../../hooks/useStorefrontAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
}

export default function ProtectedRoute({ children, navigate }: ProtectedRouteProps) {
  const { isAuthenticated, setFlashMessage, setReturnPath } = useStorefrontAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setFlashMessage('Please login to continue', 'info');
      setReturnPath(window.location.pathname);
      navigate('/login');
    }
  }, [isAuthenticated, navigate, setFlashMessage, setReturnPath]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
