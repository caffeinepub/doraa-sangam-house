import { useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { checkAdminAccess } from '../utils/adminGuard';
import { ADMIN_ROUTES } from '../adminConfig';

interface AdminGateProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
}

export default function AdminGate({ children, navigate }: AdminGateProps) {
  const { identity, isLoginSuccess, isInitializing } = useInternetIdentity();

  useEffect(() => {
    if (isInitializing) return;

    const principal = identity?.getPrincipal().toString();
    const { isAdmin } = checkAdminAccess(isLoginSuccess, principal);

    if (!isAdmin) {
      navigate(ADMIN_ROUTES.LOGIN);
    }
  }, [identity, isLoginSuccess, isInitializing, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const principal = identity?.getPrincipal().toString();
  const { isAdmin } = checkAdminAccess(isLoginSuccess, principal);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}
