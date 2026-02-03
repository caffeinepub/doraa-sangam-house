import { useEffect } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useActor } from './hooks/useActor';
import { CommerceProvider } from './commerce/CommerceProvider';
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

function App() {
  const { actor } = useActor();

  useEffect(() => {
    if (actor) {
      console.log('Backend actor initialized');
    }
  }, [actor]);

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
