import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { formatPrincipal } from '../utils/principalFormat';
import { ADMIN_ROUTES } from '../adminConfig';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPath: string;
  navigate: (path: string) => void;
}

export default function AdminLayout({ children, currentPath, navigate }: AdminLayoutProps) {
  const { identity, clear } = useInternetIdentity();
  const principal = identity?.getPrincipal().toString() || '';

  const navItems = [
    { path: ADMIN_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { path: ADMIN_ROUTES.PRODUCTS, label: 'Products', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-serif font-bold text-foreground">Admin Panel</h1>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-sm text-muted-foreground">{formatPrincipal(principal)}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-4rem)] border-r border-border/40 bg-card/30 backdrop-blur-sm">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start ${
                    isActive
                      ? 'bg-primary/10 text-primary hover:bg-primary/20'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
