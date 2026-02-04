import { ShoppingCart, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { useCommerce } from '../hooks/useCommerce';
import { useRef } from 'react';
import { useAddToCartAnimation } from '../hooks/useAddToCartAnimation';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { showDuplicateCartToast } from '../utils/premiumToasts';

interface QuickViewSheetProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewSheet({ productId, open, onOpenChange }: QuickViewSheetProps) {
  const product = productId ? DUMMY_PRODUCTS.find((p) => p.id === productId) : null;
  const addToCart = useAddToCart();
  const { createRipple } = useGoldRipple();
  const { animate } = useAddToCartAnimation();
  const { isInCart } = useCommerce();
  const imageRef = useRef<HTMLDivElement>(null);
  const { requireAuth } = useAuthRedirect();
  const [, navigate] = useSpaLocation();

  if (!product) return null;

  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!requireAuth(navigate, window.location.pathname)) {
      onOpenChange(false);
      return;
    }

    // Check for duplicate
    if (inCart) {
      showDuplicateCartToast();
      return;
    }

    createRipple(e);

    if (imageRef.current) {
      animate({
        sourceElement: imageRef.current,
        onComplete: () => {
          const cartButton = document.querySelector('[data-cart-button]');
          if (cartButton) {
            cartButton.classList.add('cart-bump');
            setTimeout(() => {
              cartButton.classList.remove('cart-bump');
            }, 400);
          }
        },
      });
    }

    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast.success('Added to cart!');
          onOpenChange(false);
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/40 overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">{product.name}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div ref={imageRef} className="relative aspect-square overflow-hidden rounded-lg bg-muted/20">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="space-y-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-serif font-bold text-accent">₹{product.price.toLocaleString()}</span>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  Only {product.stock} left
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Stock:</span>
              <span className="font-medium">{product.stock} available</span>
            </div>
          </div>
          <Button
            className="ripple-container w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-gold hover:shadow-glow-pearl transition-all duration-300 h-12 text-lg gold-pulse-glow"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCart.isPending}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {addToCart.isPending ? 'Adding...' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
