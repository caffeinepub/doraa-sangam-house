import { ShoppingCart, X, Star, Package, Truck, Award } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useGetProduct } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { useCommerce } from '../hooks/useCommerce';
import { useRef, useState } from 'react';
import { useAddToCartAnimation } from '../hooks/useAddToCartAnimation';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { showDuplicateCartToast } from '../utils/premiumToasts';
import { useSpaLocation } from '../hooks/useSpaLocation';

interface QuickViewSheetProps {
  productId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewSheet({ productId, open, onOpenChange }: QuickViewSheetProps) {
  const { data: product, isLoading } = useGetProduct(productId || '');
  const { addToCart, cart } = useCommerce();
  const { createRipple } = useGoldRipple();
  const { animate } = useAddToCartAnimation();
  const { requireAuth } = useAuthRedirect();
  const [location, navigate] = useSpaLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const inCart = product ? cart.some((item) => item.productId === product.id) : false;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return;
    
    if (!requireAuth(navigate, location.pathname)) return;

    if (inCart) {
      showDuplicateCartToast();
      return;
    }

    createRipple(e);
    addToCart(product.id, 1);
    if (buttonRef.current) {
      animate({ sourceElement: buttonRef.current });
    }
    toast.success('Added to cart', {
      description: product.name,
      duration: 2000,
    });
  };

  if (!productId) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-background/95 backdrop-blur-xl">
        <SheetHeader>
          <SheetTitle className="text-2xl font-serif">Quick View</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4 mt-6">
            <div className="aspect-square shimmer-skeleton rounded-xl" />
            <div className="h-6 shimmer-skeleton rounded" />
            <div className="h-4 shimmer-skeleton rounded w-2/3" />
          </div>
        ) : product ? (
          <div className="mt-6 space-y-6">
            {/* Image gallery */}
            <div className="space-y-3">
              <div className="aspect-square rounded-xl overflow-hidden bg-muted/20">
                <img
                  src={product.images[selectedImageIndex]?.url || '/assets/generated/pearl-shimmer-bg.dim_1920x1080.png'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, idx) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex ? 'border-primary' : 'border-border/30'
                      }`}
                    >
                      <img src={img.url} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-serif text-foreground mb-2">{product.name}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-semibold">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount}{' '}
                    reviews)
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.rating >= 4.5 && (
                    <Badge className="bg-accent/90 text-accent-foreground">
                      <Award className="w-3 h-3 mr-1" />
                      Top Rated
                    </Badge>
                  )}
                  <Badge variant="outline" className="border-primary/30 text-primary">
                    <Truck className="w-3 h-3 mr-1" />
                    Express Delivery
                  </Badge>
                  <Badge variant="outline" className="border-border/50">
                    <Package className="w-3 h-3 mr-1" />
                    {product.fabric}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold" style={{ color: '#D4AF37' }}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-lg text-muted-foreground line-through">
                  ₹{Math.round(product.price * 1.2).toLocaleString()}
                </span>
                <span className="text-base font-semibold text-primary">(20% off)</span>
              </div>

              <Separator />

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Add to cart button */}
              <Button
                ref={buttonRef}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground action-icon-glow"
                onClick={handleAddToCart}
                disabled={inCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {inCart ? 'Already in Cart' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-6 text-center text-muted-foreground">Product not found</div>
        )}
      </SheetContent>
    </Sheet>
  );
}
