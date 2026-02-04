import { ShoppingCart, Heart, Eye, Star, Package, Truck, Award, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAddToCart, useGetProduct } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useAddToCartAnimation } from '../hooks/useAddToCartAnimation';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { useWishlist } from '../hooks/useWishlist';
import { useCommerce } from '../hooks/useCommerce';
import { useRef, useState, useEffect } from 'react';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { showDuplicateFavoriteToast, showDuplicateCartToast } from '../utils/premiumToasts';
import { BanarasiQuickDetailsOverlay } from './banarasi/BanarasiQuickDetailsOverlay';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { formatReviewCount, formatRating, calculateDiscount, formatPrice } from '../utils/formatters';
import { useNotifications } from '../notifications/useNotifications';

interface ProductCardProps {
  productId: string;
  onQuickView: (productId: string) => void;
  onViewDetail: (productId: string) => void;
}

export default function ProductCard({ productId, onQuickView, onViewDetail }: ProductCardProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const { addToCart, cart } = useCommerce();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const addToCartMutation = useAddToCart();
  const { animate } = useAddToCartAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { createRipple } = useGoldRipple();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { requireAuth } = useAuthRedirect();
  const [location, navigate] = useSpaLocation();
  const [showQuickDetails, setShowQuickDetails] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const { addNotification } = useNotifications();

  const inWishlist = isInWishlist(productId);
  const inCart = cart.some((item) => item.productId === productId);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setMousePos({ x, y });
    };

    card.addEventListener('mousemove', handleMouseMove);
    return () => card.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden rounded-[24px] bg-card/50 backdrop-blur-sm border-border/30">
        <div className="aspect-[3/4] shimmer-skeleton" />
        <CardContent className="p-4 space-y-2">
          <div className="h-4 shimmer-skeleton rounded" />
          <div className="h-4 shimmer-skeleton rounded w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (!product) return null;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!requireAuth(navigate, location.pathname)) return;

    if (inCart) {
      showDuplicateCartToast();
      return;
    }

    createRipple(e);
    addToCart(productId, 1);
    animate({ sourceElement: e.currentTarget });
    addNotification('Added to cart');
    toast.success('Added to cart', {
      description: product.name,
      duration: 2000,
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (!requireAuth(navigate, location.pathname)) return;

    if (inWishlist) {
      showDuplicateFavoriteToast();
      return;
    }

    createRipple(e);
    toggleWishlist(productId);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist', {
      duration: 2000,
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickView(productId);
  };

  const primaryImage = product.images[0]?.url || '/assets/generated/pearl-shimmer-bg.dim_1920x1080.png';
  const { mrp, discount } = calculateDiscount(productId, product.price);

  return (
    <Card
      ref={cardRef}
      className="group relative overflow-hidden rounded-[24px] bg-card/80 backdrop-blur-sm border-border/30 transition-all duration-500 hover:border-primary/50 cursor-pointer product-card-hover shadow-lg"
      style={
        {
          '--mouse-x': `${mousePos.x}%`,
          '--mouse-y': `${mousePos.y}%`,
        } as React.CSSProperties
      }
      onMouseEnter={() => !prefersReducedMotion && setShowQuickDetails(true)}
      onMouseLeave={() => setShowQuickDetails(false)}
      onClick={() => onViewDetail(productId)}
    >
      {/* Micro ripple layer */}
      <div className="micro-ripple-layer" />

      {/* Image container with zoom effect */}
      <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden bg-muted/20">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Fabric ripple overlay */}
        <div className="fabric-ripple-hover absolute inset-0" />

        {/* Top badges - Premium Myntra/Flipkart style */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.rating >= 4.5 && (
            <Badge className="bg-accent/95 text-accent-foreground backdrop-blur-sm border-0 text-xs font-semibold px-2 py-1 shadow-md">
              <Award className="w-3 h-3 mr-1" />
              Top Rated
            </Badge>
          )}
          {discount >= 20 && (
            <Badge className="bg-primary/95 text-primary-foreground backdrop-blur-sm border-0 text-xs font-semibold px-2 py-1 shadow-md">
              <Tag className="w-3 h-3 mr-1" />
              Best Price with coupon
            </Badge>
          )}
        </div>

        {/* Quick view button (desktop only) */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex shadow-lg"
          onClick={handleQuickView}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Product details */}
      <CardContent className="p-4 space-y-3">
        {/* Product name - Serif font, pearl off-white */}
        <h3 className="font-serif text-foreground/95 text-base line-clamp-2 leading-snug min-h-[2.5rem]">
          {product.name}
        </h3>

        {/* Pricing row - Gold price, gray MRP strike-through, pearl blue discount */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold" style={{ color: '#D4AF37' }}>
            {formatPrice(product.price)}
          </span>
          <span className="text-sm text-muted-foreground line-through">{formatPrice(mrp)}</span>
          <span className="text-sm font-semibold text-primary">({discount}% off)</span>
        </div>

        {/* Rating and reviews - Gold stars, formatted rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>
              {formatRating(product.rating)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">({formatReviewCount(product.reviewCount)})</span>
        </div>

        {/* Feature badges - Premium Myntra/Flipkart style */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="text-xs border-primary/40 text-primary/90 bg-primary/5 px-2 py-0.5">
            <Truck className="w-3 h-3 mr-1" />
            Express Delivery
          </Badge>
          {product.fabric && (
            <Badge variant="outline" className="text-xs border-border/50 text-muted-foreground bg-muted/10 px-2 py-0.5">
              <Package className="w-3 h-3 mr-1" />
              {product.fabric}
            </Badge>
          )}
        </div>

        {/* Action buttons - Heart (wishlist) + Cart with gold/pearl blue glow pulse - mobile friendly */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            variant="outline"
            className={`flex-1 action-icon-glow transition-all min-h-[44px] ${
              inWishlist ? 'bg-primary/10 border-primary/50 text-primary' : ''
            }`}
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
          <Button
            size="sm"
            className={`flex-1 action-icon-glow transition-all min-h-[44px] ${
              inCart
                ? 'bg-accent/90 hover:bg-accent text-accent-foreground'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground'
            }`}
            onClick={handleAddToCart}
            disabled={inCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {inCart ? 'In Cart' : 'Add'}
          </Button>
        </div>
      </CardContent>

      {/* Quick details overlay - Shows on hover with color swatches, fabric, size chart, blouse pairing */}
      <BanarasiQuickDetailsOverlay productId={productId} isVisible={showQuickDetails} />
    </Card>
  );
}
