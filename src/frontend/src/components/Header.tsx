import { ShoppingCart, User, Menu, X } from 'lucide-react';
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

export default function Header() {
  const { identity, login, clear, isLoginSuccess } = useInternetIdentity();
  const { cartItemCount } = useCommerce();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const { createRipple } = useGoldRipple();

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
              className="ripple-container relative hover:bg-primary/10 hover:text-primary transition-all duration-300"
              onClick={handleCartClick}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-accent text-accent-foreground border-0">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {isLoginSuccess ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/40">
                  <DropdownMenuItem
                    onClick={clear}
                    className="cursor-pointer hover:bg-primary/10 hover:text-primary"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                onClick={login}
                size="sm"
                className="hidden md:inline-flex bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
              >
                Login
              </Button>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-primary/10 hover:text-primary transition-all duration-300"
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
                      className="text-base font-medium text-muted-foreground hover:text-primary transition-colors duration-300 py-2"
                    >
                      {link.label}
                    </a>
                  ))}
                  {!isLoginSuccess && (
                    <Button
                      onClick={() => {
                        login();
                        setMobileMenuOpen(false);
                      }}
                      className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300"
                    >
                      Login
                    </Button>
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
