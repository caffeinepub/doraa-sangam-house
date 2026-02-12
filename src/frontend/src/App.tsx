import { useEffect, lazy, Suspense } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useActor } from './hooks/useActor';
import { CommerceProvider } from './commerce/CommerceProvider';
import { useSpaLocation } from './hooks/useSpaLocation';
import OceanBackground from './components/OceanBackground';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeSection from './pages/HomeSection';
import ProductsPage from './pages/ProductsPage';
import ProductSection from './pages/ProductSection';
import CheckoutSection from './pages/CheckoutSection';
import FaqSection from './pages/FaqSection';
import AboutSection from './pages/AboutSection';
import RaaHiChatWidget from './components/RaaHiChatWidget';
import { ADMIN_ROUTES } from './admin/adminConfig';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useStorefrontAuth } from './hooks/useStorefrontAuth';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useInactivityLogout } from './hooks/useInactivityLogout';
import ProductDetailView from './pages/ProductDetailView';
import StyleCollectionsPage from './pages/StyleCollectionsPage';
import SizeChartPage from './pages/SizeChartPage';

// Lazy load admin components for code splitting
const AdminGate = lazy(() => import('./admin/components/AdminGate'));
const AdminArea = lazy(() => import('./admin/AdminArea'));
const AdminLoginPage = lazy(() => import('./admin/pages/AdminLoginPage'));
const AdminLoginHiddenPage = lazy(() => import('./pages/AdminLoginHiddenPage'));
const AdminOtpProtectedPage = lazy(() => import('./pages/AdminOtpProtectedPage'));
const AdminOtpDashboardPage = lazy(() => import('./pages/AdminOtpDashboardPage'));
const AdminBotPage = lazy(() => import('./pages/AdminBotPage'));

function App() {
  const { actor } = useActor();
  const [location, navigate] = useSpaLocation();
  const { isAuthenticated, logout, setFlashMessage } = useStorefrontAuth();
  const { clear: clearII } = useInternetIdentity();

  useEffect(() => {
    if (actor) {
      console.log('Backend actor initialized');
    }
  }, [actor]);

  // Register service worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  // Auto-logout on inactivity (30 minutes)
  useInactivityLogout({
    enabled: isAuthenticated,
    timeoutMs: 30 * 60 * 1000,
    onLogout: async () => {
      await logout(clearII);
      setFlashMessage('You have been logged out due to inactivity', 'info');
      navigate('/login?tab=signin');
    },
  });

  // Handle size chart route
  if (location.pathname === '/size-chart') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <div className="relative min-h-screen bg-black">
            <OceanBackground />
            <div className="relative z-10">
              <Header />
              <SizeChartPage />
              <Footer />
            </div>
            <Toaster position="top-right" />
          </div>
        </CommerceProvider>
      </ThemeProvider>
    );
  }

  // Handle style collection routes
  const collectionMatch = location.pathname.match(/^\/collections\/([^/]+)$/);
  if (collectionMatch) {
    const slug = collectionMatch[1];
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <div className="relative min-h-screen bg-black">
            <OceanBackground />
            <div className="relative z-10">
              <Header />
              <StyleCollectionsPage
                slug={slug}
                onClose={() => navigate('/')}
              />
              <Footer />
            </div>
            <Toaster position="top-right" />
          </div>
        </CommerceProvider>
      </ThemeProvider>
    );
  }

  // Handle product detail route
  const productMatch = location.pathname.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const productId = productMatch[1];
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <div className="relative min-h-screen bg-black">
            <OceanBackground />
            <div className="relative z-10">
              <Header />
              <ProductDetailView
                productId={productId}
                onClose={() => navigate('/')}
              />
              <Footer />
            </div>
            <Toaster position="top-right" />
          </div>
        </CommerceProvider>
      </ThemeProvider>
    );
  }

  // Hidden admin bot route (no links to this anywhere)
  if (location.pathname === '/admin-bot') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminBotPage />
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // Hidden admin login route (no links to this anywhere)
  if (location.pathname === '/admin-login') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminLoginHiddenPage navigate={navigate} />
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // OTP-protected /admin route (exact match only)
  if (location.pathname === '/admin') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminOtpProtectedPage navigate={navigate} />
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // OTP-protected /admin-dashboard route (exact match only)
  if (location.pathname === '/admin-dashboard') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminOtpDashboardPage navigate={navigate} />
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // Internet Identity admin login route
  if (location.pathname === ADMIN_ROUTES.LOGIN) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminLoginPage navigate={navigate} />
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // Internet Identity admin panel routes (starts with /admin/ but not exact /admin)
  if (location.pathname.startsWith('/admin/')) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="shimmer-skeleton w-32 h-8 rounded" /></div>}>
              <AdminGate navigate={navigate}>
                <AdminArea currentPath={location.pathname} navigate={navigate} />
              </AdminGate>
            </Suspense>
          </div>
          <Toaster position="top-right" />
        </div>
      </ThemeProvider>
    );
  }

  // Storefront login page (with query string support)
  if (location.pathname === '/login') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <div className="relative min-h-screen bg-black">
            <OceanBackground />
            <div className="relative z-10">
              <LoginPage navigate={navigate} />
            </div>
            <Toaster position="top-right" />
          </div>
        </CommerceProvider>
      </ThemeProvider>
    );
  }

  // Storefront dashboard (protected)
  if (location.pathname === '/dashboard') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <ProtectedRoute navigate={navigate}>
            <div className="relative min-h-screen bg-black">
              <OceanBackground />
              <div className="relative z-10 dashboard-route-transition">
                <Header />
                <DashboardPage navigate={navigate} />
                <Footer />
              </div>
              <Toaster position="top-right" />
            </div>
          </ProtectedRoute>
        </CommerceProvider>
      </ThemeProvider>
    );
  }

  // Storefront (default)
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <CommerceProvider>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          
          {/* Cinematic vignette overlay */}
          <div className="fixed inset-0 pointer-events-none z-[5]">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/60" />
          </div>

          <div className="relative z-10">
            <Header />
            <main className="min-h-screen">
              <HomeSection />
              <ProductsPage />
              <ProductSection />
              <CheckoutSection />
              <FaqSection />
              <AboutSection />
            </main>
            <Footer />
          </div>
          
          {/* RaaHi Chat Widget - Global */}
          <RaaHiChatWidget />
          
          <Toaster position="top-right" />
        </div>
      </CommerceProvider>
    </ThemeProvider>
  );
}

export default App;
