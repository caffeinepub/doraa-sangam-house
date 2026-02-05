import { useAdminSessionValidation } from '@/hooks/useAdminSessionValidation';
import { clearAdminSessionFlag } from '@/utils/adminSessionFlag';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface AdminOtpProtectedPageProps {
  navigate: (path: string) => void;
}

export default function AdminOtpProtectedPage({ navigate }: AdminOtpProtectedPageProps) {
  const { isLoading, isAllowed, isDenied } = useAdminSessionValidation();

  const handleLogout = () => {
    clearAdminSessionFlag();
    navigate('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="shimmer-skeleton w-32 h-8 rounded mx-auto" />
          <p className="text-pearl-off-white/60">Validating session...</p>
        </div>
      </div>
    );
  }

  // Denied state - exact message, no buttons
  if (isDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <p className="text-xl text-pearl-off-white">
            Admin access denied - use /admin-login
          </p>
        </div>
      </div>
    );
  }

  // Allowed state - show protected content
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ShieldCheck className="w-10 h-10 text-gold-accent" />
              <h1 className="text-4xl font-serif text-pearl-off-white">
                Admin Dashboard – Protected
              </h1>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-pearl-blue/30 text-pearl-off-white hover:bg-pearl-blue/10"
            >
              Logout
            </Button>
          </div>

          {/* Content */}
          <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-pearl-off-white">
                Welcome to the Protected Admin Area
              </h2>
              <p className="text-pearl-off-white/80 leading-relaxed">
                You have successfully authenticated via OTP and your session has been validated.
                This page is protected by session-based access control.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              <div className="bg-black/30 border border-gold-accent/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gold-accent mb-2">✓</div>
                <div className="text-sm text-pearl-off-white/60">Session Active</div>
              </div>
              <div className="bg-black/30 border border-gold-accent/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gold-accent mb-2">🔒</div>
                <div className="text-sm text-pearl-off-white/60">Access Granted</div>
              </div>
              <div className="bg-black/30 border border-gold-accent/20 rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-gold-accent mb-2">⏱</div>
                <div className="text-sm text-pearl-off-white/60">4 Hour Timeout</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
