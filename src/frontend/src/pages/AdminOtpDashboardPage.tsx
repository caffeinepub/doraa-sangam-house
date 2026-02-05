import { useAdminSessionValidation } from '@/hooks/useAdminSessionValidation';
import { clearAdminSessionFlag } from '@/utils/adminSessionFlag';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Package, Users, TrendingUp } from 'lucide-react';

interface AdminOtpDashboardPageProps {
  navigate: (path: string) => void;
}

export default function AdminOtpDashboardPage({ navigate }: AdminOtpDashboardPageProps) {
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

  // Allowed state - show dashboard content
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LayoutDashboard className="w-10 h-10 text-gold-accent" />
              <h1 className="text-4xl font-serif text-pearl-off-white">
                Admin Dashboard
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

          {/* Dashboard Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Package className="w-8 h-8 text-pearl-blue" />
                <span className="text-3xl font-bold text-pearl-off-white">0</span>
              </div>
              <div className="text-sm text-pearl-off-white/60">Total Products</div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <Users className="w-8 h-8 text-gold-accent" />
                <span className="text-3xl font-bold text-pearl-off-white">0</span>
              </div>
              <div className="text-sm text-pearl-off-white/60">Active Users</div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <TrendingUp className="w-8 h-8 text-green-400" />
                <span className="text-3xl font-bold text-pearl-off-white">0</span>
              </div>
              <div className="text-sm text-pearl-off-white/60">Orders Today</div>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-6 space-y-3">
              <div className="flex items-center justify-between">
                <LayoutDashboard className="w-8 h-8 text-purple-400" />
                <span className="text-3xl font-bold text-pearl-off-white">0</span>
              </div>
              <div className="text-sm text-pearl-off-white/60">Categories</div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="bg-black/40 backdrop-blur-xl border border-pearl-blue/20 rounded-lg p-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif text-pearl-off-white">
                Dashboard Overview
              </h2>
              <p className="text-pearl-off-white/80 leading-relaxed">
                Welcome to your admin dashboard. You have successfully authenticated via OTP
                and your session is active. This dashboard provides an overview of your
                store's key metrics and activities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="bg-black/30 border border-gold-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-serif text-pearl-off-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3 text-pearl-off-white/60 text-sm">
                  <p>• No recent activity</p>
                  <p>• Dashboard initialized</p>
                  <p>• Session validated</p>
                </div>
              </div>

              <div className="bg-black/30 border border-gold-accent/20 rounded-lg p-6">
                <h3 className="text-lg font-serif text-pearl-off-white mb-4">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => navigate('/admin/products')}
                    className="w-full bg-pearl-blue hover:bg-pearl-blue/80 text-black font-medium"
                  >
                    Manage Products
                  </Button>
                  <Button
                    onClick={() => navigate('/admin/dashboard')}
                    variant="outline"
                    className="w-full border-pearl-blue/30 text-pearl-off-white hover:bg-pearl-blue/10"
                  >
                    View Full Dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
