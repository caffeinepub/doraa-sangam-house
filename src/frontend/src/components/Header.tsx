import { ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { BRAND_ASSETS, BRAND_NAME } from '../assets/branding';
import { useState } from 'react';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { useCommerce } from '../hooks/useCommerce';
import CartSheet from './cart/CartSheet';
import CheckoutSheet from './checkout/CheckoutSheet';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useQueryClient } from '@tanstack/react-query';

export default function Header() {
  const { identity, clear: clearII } = useInternetIdentity();
  const { cartItemCount } = useCommerce();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { createRipple } = useGoldRipple();
  const [location, navigate] = useSpaLocation();
  const { isAuthenticated, logout, setFlashMessage, setReturnPath, clearOTPSession, clearReturnPath } = useStorefrontAuth();
  const queryClient = useQueryClient();

  // Don't render public header on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#collections', label: 'Collections' },
    { href: '#product', label: 'Product' },
    { href: '#checkout', label: 'Checkout' },
    { href: '#faq', label: 'FAQ' },
    { href: '#about', label: 'About' },
  ];

  const handleCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e);
    setCartOpen(true);
  };

  const handleCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  const handleSignInClick = () => {
    navigate('/login?tab=signin');
  };

  const handleSignUpClick = () => {
    navigate('/login?tab=signup');
  };

  const handleLogout = async () => {
    // Clear all session data
    clearOTPSession();
    clearReturnPath();
    localStorage.removeItem('doraa-flash-message');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear Internet Identity
    await clearII();
    
    // Navigate to login
    navigate('/login?tab=signin');
  };

  const handleProfileIconClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setFlashMessage('Login to view profile', 'info');
      setReturnPath('/dashboard');
      navigate('/login?tab=signin');
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-black/80 backdrop-blur-xl supports-[backdrop-filter]:bg-black/60">
        <div className="container flex h-20 items-center justify-between">
          <a href="#home" className="flex items-center gap-3 group">
            <img
              src={BRAND_ASSETS.logoMark}
              alt={`${BRAND_NAME} Logo`}
              className="h-10 w-10 object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground group-hover:text-primary transition-colors duration-300">
              {BRAND_NAME}
            </h1>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              data-cart-button
              variant="ghost"
              size="icon"
              className="ripple-container relative hover:bg-primary/10 hover:text-primary transition-all duration-300 min-h-[44px] min-w-[44px]"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Profile Icon - Always visible - mobile friendly */}
            <Button
              onClick={handleProfileIconClick}
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300 gold-pulse-glow min-h-[44px] min-w-[44px]"
              title={isAuthenticated ? 'View Dashboard' : 'Login to view profile'}
            >
              <User className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                size="sm"
                variant="ghost"
                className="hidden md:inline-flex text-primary hover:text-accent hover:bg-accent/10 transition-all duration-300 gold-pulse-glow min-h-[44px]"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSignInClick}
                  size="sm"
                  variant="ghost"
                  className="hidden md:inline-flex text-primary hover:text-accent hover:bg-accent/10 transition-all duration-300 gold-pulse-glow min-h-[44px]"
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUpClick}
                  size="sm"
                  className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 gold-pulse-glow min-h-[44px]"
                >
                  Sign Up
                </Button>
              </>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300 min-h-[44px] min-w-[44px]"
                >
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-black/95 backdrop-blur-xl border-border/40 w-[280px]">
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-300 py-2 min-h-[44px] flex items-center"
                    >
                      {link.label}
                    </a>
                  ))}
                  {isAuthenticated ? (
                    <>
                      <Button
                        onClick={() => {
                          navigate('/dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 gold-pulse-glow min-h-[44px]"
                      >
                        Dashboard
                      </Button>
                      <Button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="text-primary border-primary hover:bg-primary/10 transition-all duration-300 gold-pulse-glow min-h-[44px]"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          handleSignInClick();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="mt-4 text-primary border-primary hover:bg-primary/10 transition-all duration-300 gold-pulse-glow min-h-[44px]"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          handleSignUpClick();
                          setMobileMenuOpen(false);
                        }}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 gold-pulse-glow min-h-[44px]"
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartSheet open={cartOpen} onOpenChange={setCartOpen} onCheckout={handleCheckout} />
      <CheckoutSheet open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
