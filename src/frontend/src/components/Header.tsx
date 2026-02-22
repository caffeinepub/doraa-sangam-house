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

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <>
      <header 
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl"
        style={{
          backgroundColor: '#F8F5F0',
          borderColor: 'rgba(201, 169, 110, 0.3)',
        }}
      >
        <div className="container flex h-24 items-center justify-between relative z-10 px-6 md:px-8">
          {/* Clickable Luxury Logo with Premium Hover Effects */}
          <a
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-4 group cursor-pointer transition-all duration-400"
            aria-label="DoRaa Sangam House - Home"
          >
            <img
              src="/assets/Whisk_ymy3edohztmmjty10syzewotqdzyqtljzwnz0so-1.jpeg"
              alt="DoRaa Sangam House - Luxury Logo"
              className="h-12 w-auto md:h-14 lg:h-16 object-contain transition-all duration-400 group-hover:scale-105 group-hover:drop-shadow-[0_0_16px_rgba(201,169,110,0.7)]"
              style={{ maxWidth: '180px' }}
            />
            <span 
              className="text-xl md:text-2xl lg:text-3xl font-playfair font-extrabold tracking-wider brand-name heading-gradient-hover"
              style={{ 
                color: '#C9A96E', 
                textShadow: '0 0 12px rgba(201,169,110,0.4)',
                letterSpacing: '0.25em'
              }}
            >
              DoRaa Sangam House
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-button font-bold uppercase tracking-wider transition-colors duration-300 relative group"
                style={{ color: '#C9A96E' }}
              >
                {link.label}
                <span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: '#C9A96E' }}
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Profile/Dashboard Icon */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleProfileIconClick}
              className="relative transition-all duration-300 hover:scale-110"
              style={{ color: '#C9A96E' }}
            >
              <User className="h-5 w-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCartClick}
              className="relative transition-all duration-300 hover:scale-110"
              style={{ color: '#C9A96E' }}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs font-bold border-0"
                  style={{ backgroundColor: '#C9A96E', color: '#1A1A1A' }}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Auth Buttons (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="font-button font-bold uppercase"
                      style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                    >
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48"
                    style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E' }}
                  >
                    <DropdownMenuItem
                      onClick={() => navigate('/dashboard')}
                      style={{ color: '#1A1A1A' }}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      style={{ color: '#1A1A1A' }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={handleSignInClick}
                    className="font-button font-bold uppercase"
                    style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={handleSignUpClick}
                    className="button-luxury font-button font-bold uppercase"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  style={{ color: '#C9A96E' }}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] sm:w-[400px]"
                style={{
                  backgroundColor: '#F8F5F0',
                  borderColor: '#C9A96E',
                }}
              >
                <nav className="flex flex-col gap-6 mt-8">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-button font-bold uppercase tracking-wider transition-colors duration-300"
                      style={{ color: '#C9A96E' }}
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="flex flex-col gap-3 mt-6 pt-6 border-t" style={{ borderColor: '#C9A96E' }}>
                    {isAuthenticated ? (
                      <>
                        <Button
                          onClick={() => {
                            navigate('/dashboard');
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full font-button font-bold uppercase"
                          style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                        >
                          Dashboard
                        </Button>
                        <Button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full font-button font-bold uppercase"
                          style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                        >
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
                          className="w-full font-button font-bold uppercase"
                          style={{ borderColor: '#C9A96E', color: '#C9A96E' }}
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            handleSignUpClick();
                            setMobileMenuOpen(false);
                          }}
                          className="w-full button-luxury font-button font-bold uppercase"
                        >
                          Sign Up
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Cart Sheet */}
      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        onCheckout={handleCheckout}
      />

      {/* Checkout Sheet */}
      <CheckoutSheet
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </>
  );
}
