import { useEffect, useState } from 'react';
import { useStorefrontAuth } from '../../hooks/useStorefrontAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { isSafeReturnPath } from '../../utils/safeReturnPath';

interface ProtectedRouteProps {
  children: React.ReactNode;
  navigate: (path: string) => void;
}

export default function ProtectedRoute({ children, navigate }: ProtectedRouteProps) {
  const { isAuthenticated, setFlashMessage, setReturnPath } = useStorefrontAuth();
  const [isChecking, setIsChecking] = useState(true);
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Small delay to allow auth state to stabilize
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated && !hasRedirected) {
      const currentPath = window.location.pathname + window.location.search;
      
      // Only store safe return paths
      if (isSafeReturnPath(currentPath)) {
        setReturnPath(currentPath);
      }
      
      setFlashMessage('Please login to continue', 'info');
      setHasRedirected(true);
      navigate('/login?tab=signin');
    }
  }, [isChecking, isAuthenticated, navigate, setFlashMessage, setReturnPath, hasRedirected]);

  // Show loading state while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-serif text-center flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Verifying Access
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Checking authentication status...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-sm text-muted-foreground">Please wait</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show redirecting state
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-serif text-center">Authentication Required</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Redirecting to login...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-primary bg-primary/10">
              <AlertCircle className="h-4 w-4 text-primary" />
              <AlertDescription className="text-primary">
                You need to be logged in to access this page.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
