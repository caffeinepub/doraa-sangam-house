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
        className="sticky top-0 z-50 w-full border-b backdrop-blur-xl supports-[backdrop-filter]:bg-plum/60"
        style={{
          background: 'linear-gradient(135deg, #2E1A47 0%, #3C1F5B 50%, #1A0F2E 100%)',
          borderColor: 'rgba(201, 169, 110, 0.3)',
        }}
      >
        {/* Faint gold zari pattern overlay */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                rgba(201, 169, 110, 0.15) 40px,
                rgba(201, 169, 110, 0.15) 41px
              ),
              repeating-linear-gradient(
                -45deg,
                transparent,
                transparent 40px,
                rgba(201, 169, 110, 0.15) 40px,
                rgba(201, 169, 110, 0.15) 41px
              )
            `,
          }}
        />
        
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
              className="text-xl md:text-2xl lg:text-3xl font-serif font-black tracking-wider brand-name heading-gradient-hover"
              style={{ 
                color: '#C9A96E', 
                textShadow: '0 0 12px rgba(201,169,110,0.6)',
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
                  className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300" 
                  style={{ backgroundColor: '#C9A96E', boxShadow: '0 0 8px rgba(201,169,110,0.6)' }} 
                />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              data-cart-button
              variant="ghost"
              size="icon"
              className="ripple-container relative transition-all duration-300 min-h-[44px] min-w-[44px] hover:scale-105"
              style={{ color: '#C9A96E' }}
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs border-0" 
                  style={{ backgroundColor: '#C9A96E', color: '#2E1A47' }}
                >
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {/* Profile Icon - Always visible - mobile friendly */}
            <Button
              onClick={handleProfileIconClick}
              variant="ghost"
              size="icon"
              className="transition-all duration-300 min-h-[44px] min-w-[44px] hover:scale-105"
              style={{ color: '#C9A96E' }}
              title={isAuthenticated ? 'View Dashboard' : 'Login to view profile'}
            >
              <User className="h-5 w-5" />
            </Button>

            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                size="sm"
                variant="ghost"
                className="hidden md:inline-flex font-button font-bold uppercase transition-all duration-300 min-h-[44px] hover:scale-105"
                style={{ color: '#C9A96E' }}
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
                  className="hidden md:inline-flex font-button font-bold uppercase transition-all duration-300 min-h-[44px] hover:scale-105"
                  style={{ color: '#C9A96E' }}
                >
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUpClick}
                  size="sm"
                  className="hidden md:inline-flex font-button font-bold uppercase transition-all duration-300 min-h-[44px] button-luxury"
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
                  className="lg:hidden transition-all duration-300 min-h-[44px] min-w-[44px] hover:scale-105"
                  style={{ color: '#C9A96E' }}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[300px] sm:w-[400px]" 
                style={{ 
                  background: 'linear-gradient(135deg, #2E1A47 0%, #3C1F5B 50%, #1A0F2E 100%)',
                  borderLeft: '2px solid rgba(201, 169, 110, 0.3)',
                  boxShadow: 'inset 0 0 20px rgba(201, 169, 110, 0.2)'
                }}
              >
                <nav className="flex flex-col gap-8 mt-12">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-lg font-button font-bold uppercase tracking-wider transition-colors duration-300"
                      style={{ color: '#D4C9B0' }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                  {isAuthenticated ? (
                    <Button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full font-button font-bold uppercase button-luxury mt-4"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={() => {
                          handleSignInClick();
                          setMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full font-button font-bold uppercase mt-4"
                        style={{ borderColor: 'rgba(201, 169, 110, 0.6)', color: '#C9A96E' }}
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => {
                          handleSignUpClick();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full font-button font-bold uppercase button-luxury"
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
