import { ShoppingCart, Plus, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useAddToCartAnimation } from '../hooks/useAddToCartAnimation';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { useWishlist } from '../hooks/useWishlist';
import { useRef, useState } from 'react';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import { BanarasiQuickDetailsOverlay } from './banarasi/BanarasiQuickDetailsOverlay';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

interface ProductCardProps {
  productId: string;
  onQuickView: (productId: string) => void;
  onViewDetail: (productId: string) => void;
}

export default function ProductCard({ productId, onQuickView, onViewDetail }: ProductCardProps) {
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);
  const addToCart = useAddToCart();
  const { animate } = useAddToCartAnimation();
  const { createRipple } = useGoldRipple();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showQuickDetails, setShowQuickDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!product) return null;

  const isBanarasi = product.category === 'banarasi';
  const inWishlist = isInWishlist(productId);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    createRipple(e);
    toggleWishlist(productId);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetail(productId);
  };

  return (
    <Card
      ref={cardRef}
      className="banarasi-product-card premium-card-hover masonry-item overflow-hidden bg-card/50 backdrop-blur border-border/40 cursor-pointer group relative"
      onClick={() => onViewDetail(productId)}
      onMouseEnter={() => isBanarasi && setShowQuickDetails(true)}
      onMouseLeave={() => isBanarasi && setShowQuickDetails(false)}
    >
      {/* Micro-ripple effect layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="micro-ripple-layer" />
      </div>

      <div
        ref={imageRef}
        className={`relative aspect-square overflow-hidden bg-muted/20 wave-mask mannequin-frame ${
          !imageLoaded ? 'shimmer-skeleton' : ''
        }`}
        onClick={handleImageClick}
      >
        {/* Mannequin overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 pointer-events-none z-10" />
        
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          } ${prefersReducedMotion ? '' : 'group-hover:scale-110 group-hover:rotate-1 fabric-ripple-hover'}`}
        />
        
        {/* Zoom lens indicator */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 pointer-events-none">
          <div className="w-16 h-16 rounded-full border-2 border-primary/60 flex items-center justify-center backdrop-blur-sm">
            <Eye className="h-6 w-6 text-primary" />
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 hover:bg-black/80 text-white border-0"
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(productId);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Quick View
        </Button>
        {isBanarasi && product.fabric && (
          <Badge className="absolute top-2 left-2 bg-accent/90 text-accent-foreground border-0 shadow-glow-gold">
            {product.fabric}
          </Badge>
        )}
      </div>
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 font-serif text-xl group-hover:text-primary transition-colors duration-300">
            {product.name}
          </CardTitle>
          {product.stock < 10 && product.stock > 0 && (
            <Badge variant="secondary" className="shrink-0 bg-accent/20 text-accent border-accent/30">
              Low Stock
            </Badge>
          )}
        </div>
        <CardDescription className="line-clamp-2 leading-relaxed">
          {product.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-serif font-bold text-accent">₹{product.price.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">
            {product.stock} in stock
          </span>
        </div>
      </CardContent>
      <CardFooter className="relative flex-col gap-3">
        {/* Action Icons Row with Glow */}
        <div className="w-full flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className={`ripple-container transition-all duration-300 action-icon-glow ${
              inWishlist
                ? 'bg-accent/20 border-accent text-accent hover:bg-accent/30 shadow-glow-gold'
                : 'hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-glow-pearl'
            }`}
            onClick={handleWishlistToggle}
            aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`h-4 w-4 transition-all duration-300 ${inWishlist ? 'fill-current scale-110' : ''}`} />
          </Button>
          <Button
            className="ripple-container flex-1 bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all duration-300 action-icon-glow"
            onClick={handleAddToCart}
            disabled={product.stock === 0 || addToCart.isPending}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
      </CardFooter>

      {/* Banarasi Quick Details Overlay */}
      {isBanarasi && (
        <BanarasiQuickDetailsOverlay productId={productId} isVisible={showQuickDetails} />
      )}
    </Card>
  );
}
