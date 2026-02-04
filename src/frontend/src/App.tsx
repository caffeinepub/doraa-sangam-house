import { useEffect } from 'react';
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
import AdminGate from './admin/components/AdminGate';
import AdminArea from './admin/AdminArea';
import AdminLoginPage from './admin/pages/AdminLoginPage';
import { ADMIN_ROUTES } from './admin/adminConfig';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  const { actor } = useActor();
  const [location, navigate] = useSpaLocation();

  useEffect(() => {
    if (actor) {
      console.log('Backend actor initialized');
    }
  }, [actor]);

  // Admin routes
  if (location.pathname === ADMIN_ROUTES.LOGIN) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <AdminLoginPage navigate={navigate} />
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  if (location.pathname.startsWith('/admin')) {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <div className="relative min-h-screen bg-black">
          <OceanBackground />
          <div className="relative z-10">
            <AdminGate navigate={navigate}>
              <AdminArea currentPath={location.pathname} navigate={navigate} />
            </AdminGate>
          </div>
          <Toaster />
        </div>
      </ThemeProvider>
    );
  }

  // Storefront login page
  if (location.pathname === '/login') {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <CommerceProvider>
          <div className="relative min-h-screen bg-black">
            <OceanBackground />
            <div className="relative z-10">
              <LoginPage navigate={navigate} />
            </div>
            <Toaster />
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
              <div className="relative z-10">
                <Header />
                <DashboardPage navigate={navigate} />
                <Footer />
              </div>
              <Toaster />
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
          
          <Toaster />
        </div>
      </CommerceProvider>
    </ThemeProvider>
  );
}

export default App;
