import { ShoppingCart, Heart, Eye, Star, Award, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetProduct } from '../hooks/useQueries';
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

interface ProductCardProps {
  productId: string;
  onQuickView: (productId: string) => void;
  onViewDetail: (productId: string) => void;
}

export default function ProductCard({ productId, onQuickView, onViewDetail }: ProductCardProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const { addToCart, cart } = useCommerce();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { animate } = useAddToCartAnimation();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const { createRipple } = useGoldRipple();
  const prefersReducedMotion = usePrefersReducedMotion();
  const { requireAuth } = useAuthRedirect();
  const [location, navigate] = useSpaLocation();
  const [showQuickDetails, setShowQuickDetails] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

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
      <Card 
        className="overflow-hidden rounded-[28px]"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderColor: '#C9A96E',
          borderWidth: '1px'
        }}
      >
        <div className="aspect-[3/4] shimmer-skeleton" />
        <CardContent className="p-6 space-y-3">
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
      className="group relative overflow-hidden rounded-[28px] transition-all duration-400 cursor-pointer product-card-hover shadow-md"
      style={{
        backgroundColor: '#FFFFFF',
        borderColor: '#C9A96E',
        borderWidth: '1px',
        '--mouse-x': `${mousePos.x}%`,
        '--mouse-y': `${mousePos.y}%`,
      } as React.CSSProperties}
      onMouseEnter={() => !prefersReducedMotion && setShowQuickDetails(true)}
      onMouseLeave={() => setShowQuickDetails(false)}
      onClick={() => onViewDetail(productId)}
    >
      {/* Fabric ripple overlay */}
      <div className="fabric-ripple-effect" />

      {/* Image container with zoom effect */}
      <div ref={imageRef} className="relative aspect-[3/4] overflow-hidden">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.12] product-card-image-zoom"
        />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.rating >= 4.5 && (
            <Badge 
              className="border-0 text-xs font-semibold px-3 py-1.5 shadow-md"
              style={{ backgroundColor: '#C9A96E', color: '#1A1A1A' }}
            >
              <Award className="w-3 h-3 mr-1" />
              Top Rated
            </Badge>
          )}
          {discount >= 20 && (
            <Badge 
              className="border-0 text-xs font-semibold px-3 py-1.5 shadow-md"
              style={{ backgroundColor: '#E8C0C8', color: '#1A1A1A' }}
            >
              <Tag className="w-3 h-3 mr-1" />
              {discount}% Off
            </Badge>
          )}
        </div>

        {/* Quick view button (desktop only) */}
        <Button
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex shadow-lg button-luxury"
          onClick={handleQuickView}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>

      {/* Product details */}
      <CardContent className="p-6 space-y-4">
        {/* Product name - Lora font */}
        <h3 
          className="font-lora text-base line-clamp-2 leading-relaxed min-h-[3rem]"
          style={{ color: '#1A1A1A', lineHeight: '1.9' }}
        >
          {product.name}
        </h3>

        {/* Pricing row */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-xl font-bold" style={{ color: '#C9A96E' }}>
            {formatPrice(product.price)}
          </span>
          <span className="text-sm line-through" style={{ color: '#5C4B51' }}>
            {formatPrice(mrp)}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#C9A96E' }}>
            ({discount}% off)
          </span>
        </div>

        {/* Rating and reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current" style={{ color: '#C9A96E' }} />
            <span className="text-sm font-semibold" style={{ color: '#C9A96E' }}>
              {formatRating(product.rating)}
            </span>
          </div>
          <span className="text-xs" style={{ color: '#5C4B51' }}>
            ({formatReviewCount(product.reviewCount)})
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            size="sm"
            className="flex-1 font-montserrat font-bold uppercase button-luxury"
            onClick={handleAddToCart}
            disabled={inCart}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {inCart ? 'In Cart' : 'Add'}
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: '#C9A96E',
              color: inWishlist ? '#C9A96E' : '#1A1A1A'
            }}
            onClick={handleWishlistToggle}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardContent>

      {/* Quick details overlay (desktop only) */}
      <BanarasiQuickDetailsOverlay
        productId={productId}
        isVisible={showQuickDetails}
      />
    </Card>
  );
}
