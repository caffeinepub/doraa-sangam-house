import { useState, useEffect } from 'react';
import { X, ShoppingCart, Star, Package, Truck, Award, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ImageZoomGallery from '../components/product/ImageZoomGallery';
import { useGetProduct } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useDynamicMetadata } from '../hooks/useDynamicMetadata';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useCommerce } from '../hooks/useCommerce';
import { useWishlist } from '../hooks/useWishlist';
import { useAddToCartAnimation } from '../hooks/useAddToCartAnimation';
import { useGoldRipple } from '../hooks/useGoldRipple';
import { showDuplicateCartToast, showDuplicateFavoriteToast } from '../utils/premiumToasts';
import { useRef } from 'react';
import { useSpaLocation } from '../hooks/useSpaLocation';

interface ProductDetailViewProps {
  productId: string;
  onClose: () => void;
}

export default function ProductDetailView({ productId, onClose }: ProductDetailViewProps) {
  const { data: product, isLoading } = useGetProduct(productId);
  const { addToCart, cart } = useCommerce();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { requireAuth } = useAuthRedirect();
  const { animate } = useAddToCartAnimation();
  const { createRipple } = useGoldRipple();
  const [location, navigate] = useSpaLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  const inCart = product ? cart.some((item) => item.productId === product.id) : false;
  const inWishlist = isInWishlist(productId);

  const canonicalUrl = typeof window !== 'undefined' ? `${window.location.origin}/product/${productId}` : '';
  const productImage = product?.images[0]?.url || '';

  useDynamicMetadata({
    title: product?.name ? `${product.name} - DoRaa Sangam House` : undefined,
    description: product?.description,
    image: productImage,
    canonicalUrl: canonicalUrl,
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

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

  const handleWishlistToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!product) return;
    
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

  if (!product && !isLoading) return null;

  const images = product?.images.map((img) => img.url) || [];

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl overflow-y-auto">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Close button - mobile friendly */}
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-10 rounded-full bg-background/80 backdrop-blur-sm min-h-[44px] min-w-[44px]"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <div className="aspect-square shimmer-skeleton rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 shimmer-skeleton rounded" />
              <div className="h-4 shimmer-skeleton rounded w-2/3" />
              <div className="h-20 shimmer-skeleton rounded" />
            </div>
          </div>
        ) : product ? (
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mt-12">
            {/* Image gallery */}
            <div>
              {images.length > 1 ? (
                <ImageZoomGallery images={images} alt={product.name} />
              ) : (
                <div className="aspect-square rounded-xl overflow-hidden bg-muted/20">
                  <img
                    src={images[0] || '/assets/generated/pearl-shimmer-bg.dim_1920x1080.png'}
                    alt={product.name}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Product details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-serif text-foreground mb-3">{product.name}</h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="text-base font-semibold">{product.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount}{' '}
                    reviews)
                  </span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
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
                <span className="text-4xl font-bold" style={{ color: '#D4AF37' }}>
                  ₹{product.price.toLocaleString()}
                </span>
                <span className="text-xl text-muted-foreground line-through">
                  ₹{Math.round(product.price * 1.2).toLocaleString()}
                </span>
                <span className="text-lg font-semibold text-primary">(20% off)</span>
              </div>

              <Separator />

              {/* Description */}
              {product.description && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Description</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Fabric details */}
              {product.fabric && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Fabric</h2>
                  <p className="text-base text-muted-foreground">{product.fabric}</p>
                </div>
              )}

              {/* Color variants */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Available Colors</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary/30 text-foreground/90">
                        {color}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Available sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Available Sizes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size, idx) => (
                      <Badge key={idx} variant="outline" className="border-primary/30 text-foreground/90">
                        {size}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Blouse pairing */}
              {product.blousePairing && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-3">Blouse Pairing Suggestion</h2>
                  <p className="text-base text-muted-foreground leading-relaxed">{product.blousePairing}</p>
                </div>
              )}

              <Separator />

              {/* Action buttons - mobile friendly */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  className={`action-icon-glow min-h-[44px] min-w-[44px] ${inWishlist ? 'bg-primary/10 border-primary/50 text-primary' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  ref={buttonRef}
                  size="lg"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground action-icon-glow min-h-[44px]"
                  onClick={handleAddToCart}
                  disabled={inCart}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {inCart ? 'Already in Cart' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
