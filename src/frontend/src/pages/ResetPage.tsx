import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { executeFullCleanBootReset } from '../utils/fullCleanBootReset';
import { useQueryClient } from '@tanstack/react-query';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useCommerce } from '../hooks/useCommerce';

interface ResetPageProps {
  navigate: (path: string) => void;
}

type ResetStatus = 'idle' | 'resetting' | 'success' | 'error';

export default function ResetPage({ navigate }: ResetPageProps) {
  const [status, setStatus] = useState<ResetStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { clear: clearII } = useInternetIdentity();
  const { clearCart } = useCommerce();

  const executeReset = async () => {
    setStatus('resetting');
    setError(null);

    try {
      await executeFullCleanBootReset({
        clearReactQuery: () => queryClient.clear(),
        clearInternetIdentity: async () => {
          clearII();
        },
        clearCartState: clearCart,
        clearWishlistState: () => {
          // Wishlist uses localStorage directly, already cleared by executeFullCleanBootReset
        },
      });

      setStatus('success');

      // Navigate to login after a brief delay
      setTimeout(() => {
        navigate('/login?tab=signin');
      }, 1500);
    } catch (err: any) {
      console.error('[ResetPage] Reset failed:', err);
      setError(err?.message || 'Reset failed. Please try again.');
      setStatus('error');
    }
  };

  useEffect(() => {
    // Auto-execute reset on mount
    executeReset();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/95 backdrop-blur-xl border-border/40">
        <CardHeader className="space-y-2">
          <CardTitle className="text-3xl font-serif text-center flex items-center justify-center gap-2">
            <RefreshCw className={`h-8 w-8 ${status === 'resetting' ? 'animate-spin' : ''}`} />
            System Reset
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Clearing all application data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === 'resetting' && (
            <Alert className="border-primary bg-primary/10">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <AlertDescription className="text-primary">
                Resetting application state... Please wait.
              </AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <Alert className="border-green-500 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Reset complete! Redirecting to login...
              </AlertDescription>
            </Alert>
          )}

          {status === 'error' && (
            <>
              <Alert variant="destructive" className="border-accent bg-accent/10">
                <AlertCircle className="h-4 w-4 text-accent" />
                <AlertDescription className="text-accent">
                  {error || 'Reset failed. Please try again.'}
                </AlertDescription>
              </Alert>
              <div className="flex gap-3">
                <Button
                  onClick={executeReset}
                  className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Retry Reset
                </Button>
                <Button
                  onClick={() => navigate('/login?tab=signin')}
                  variant="outline"
                  className="flex-1"
                >
                  Go to Login
                </Button>
              </div>
            </>
          )}

          {status === 'idle' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Initializing reset...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
