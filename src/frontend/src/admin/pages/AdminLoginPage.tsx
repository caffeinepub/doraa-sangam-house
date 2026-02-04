import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { checkAdminAccess } from '../utils/adminGuard';
import { ADMIN_ROUTES } from '../adminConfig';
import { Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AuthErrorAlert from '../../components/auth/AuthErrorAlert';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export default function AdminLoginPage({ navigate }: AdminLoginPageProps) {
  const { identity, login, clear, isLoginSuccess, isLoggingIn, isInitializing, isLoginError, loginError } = useInternetIdentity();
  const [isSwitchingAccount, setIsSwitchingAccount] = useState(false);

  useEffect(() => {
    if (isInitializing) return;

    const principal = identity?.getPrincipal().toString();
    const { isAdmin } = checkAdminAccess(isLoginSuccess, principal);

    if (isAdmin) {
      navigate(ADMIN_ROUTES.DASHBOARD);
    }
  }, [identity, isLoginSuccess, isInitializing, navigate]);

  const principal = identity?.getPrincipal().toString();
  const { isAdmin, reason, isAuthenticated } = checkAdminAccess(isLoginSuccess, principal);

  const handleSwitchAccount = async () => {
    setIsSwitchingAccount(true);
    try {
      await clear();
      // Wait a brief moment for auth client to fully clear
      setTimeout(() => {
        setIsSwitchingAccount(false);
        login();
      }, 300);
    } catch (error) {
      setIsSwitchingAccount(false);
      console.error('Failed to switch account:', error);
    }
  };

  const showAccessDenied = isAuthenticated && !isAdmin && reason;
  const showLoginButton = !isAuthenticated && !isInitializing;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Secure access to the DoRaa Sangam House admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoginError && !isSwitchingAccount && (
            <AuthErrorAlert error={loginError} />
          )}

          {showAccessDenied && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{reason}</AlertDescription>
            </Alert>
          )}

          {isInitializing && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground mt-2">Initializing...</p>
            </div>
          )}

          {showLoginButton && (
            <Button
              onClick={login}
              disabled={isLoggingIn || isInitializing}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isLoggingIn ? 'Connecting...' : 'Login with Internet Identity'}
            </Button>
          )}

          {showAccessDenied && (
            <Button
              onClick={handleSwitchAccount}
              disabled={isSwitchingAccount || isInitializing}
              variant="outline"
              className="w-full border-border/40 hover:bg-accent hover:text-accent-foreground transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              size="lg"
            >
              {isSwitchingAccount ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Switching...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Switch Account
                </>
              )}
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center">
            Only authorized administrators can access this area
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
