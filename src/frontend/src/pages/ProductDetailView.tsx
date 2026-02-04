import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ImageZoomGallery from '../components/product/ImageZoomGallery';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import { useAddToCart } from '../hooks/useQueries';
import { toast } from 'sonner';
import { useDynamicMetadata } from '../hooks/useDynamicMetadata';
import { useAuthRedirect } from '../hooks/useAuthRedirect';
import { useCommerce } from '../hooks/useCommerce';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { showDuplicateCartToast } from '../utils/premiumToasts';

interface ProductDetailViewProps {
  productId: string;
  onClose: () => void;
}

export default function ProductDetailView({ productId, onClose }: ProductDetailViewProps) {
  const product = DUMMY_PRODUCTS.find((p) => p.id === productId);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);
  const { requireAuth } = useAuthRedirect();
  const { isInCart } = useCommerce();
  const [, navigate] = useSpaLocation();

  useDynamicMetadata({
    title: product ? `${product.name} - DoRaa Sangam House` : 'Product Details',
    description: product?.description || 'View product details',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!product) return null;

  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    if (!requireAuth(navigate, window.location.pathname)) {
      onClose();
      return;
    }

    // Check for duplicate
    if (inCart) {
      showDuplicateCartToast();
      return;
    }

    addToCart.mutate(
      { productId: product.id, quantity },
      {
        onSuccess: () => {
          toast.success(`Added ${quantity} item(s) to cart!`);
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm overflow-y-auto">
      <div className="container py-8 md:py-12">
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 right-4 z-10 bg-card/80 backdrop-blur hover:bg-card"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
          {/* Image Gallery with Zoom */}
          <div className="space-y-4">
            <ImageZoomGallery images={product.images} alt={product.name} />
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{product.name}</h1>
              <p className="text-lg text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            <Separator />

            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-serif font-bold text-accent">
                ₹{product.price.toLocaleString()}
              </span>
              {product.stock < 10 && product.stock > 0 && (
                <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
                  Only {product.stock} left
                </Badge>
              )}
            </div>

            <Separator />

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="gold-pulse-glow"
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="gold-pulse-glow"
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-glow-pearl hover:shadow-glow-gold transition-all gold-pulse-glow"
              onClick={handleAddToCart}
              disabled={product.stock === 0 || addToCart.isPending}
            >
              {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
            </Button>

            {/* Size Chart for Sarees */}
            {product.sizes && product.sizes.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Size Chart</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-3">Size</th>
                          <th className="text-left py-2 px-3">Bust</th>
                          <th className="text-left py-2 px-3">Waist</th>
                          <th className="text-left py-2 px-3">Length</th>
                        </tr>
                      </thead>
                      <tbody>
                        {product.sizes.map((size, index) => (
                          <tr key={index} className="border-b border-border/50">
                            <td className="py-2 px-3 font-medium">{size.size}</td>
                            <td className="py-2 px-3">{size.bust}</td>
                            <td className="py-2 px-3">{size.waist}</td>
                            <td className="py-2 px-3">{size.length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* Blouse Suggestions for Sarees */}
            {product.blouseSuggestions && product.blouseSuggestions.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Pair with Blouse</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {product.blouseSuggestions.map((blouse, index) => (
                      <div
                        key={index}
                        className="flex flex-col gap-2 p-3 rounded-lg border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        <img
                          src={blouse.imageUrl}
                          alt={blouse.name}
                          className="w-full aspect-square rounded object-cover"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-sm font-medium">{blouse.name}</p>
                          <p className="text-sm text-accent font-semibold">
                            ₹{blouse.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
