import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCommerce } from '../../hooks/useCommerce';
import { useUpdateCartQuantity, useRemoveFromCart, useGetAllProducts } from '../../hooks/useQueries';
import { useAuthRedirect } from '../../hooks/useAuthRedirect';
import { useSpaLocation } from '../../hooks/useSpaLocation';

interface CartPanelProps {
  onCheckout: () => void;
}

export default function CartPanel({ onCheckout }: CartPanelProps) {
  const { cart, cartTotal, cartItemCount } = useCommerce();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();
  const { requireAuth } = useAuthRedirect();
  const [, navigate] = useSpaLocation();
  const { data: products = [] } = useGetAllProducts();

  const handleCheckout = () => {
    if (requireAuth(navigate, window.location.pathname)) {
      onCheckout();
    }
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    updateQuantity.mutate({ productId, quantity: newQuantity });
  };

  const handleRemove = (productId: string) => {
    removeFromCart.mutate(productId);
  };

  // Show empty state if cart is empty
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mb-6" />
        <h3 className="text-xl font-serif font-semibold mb-2">Your Bag of Happiness is Empty</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          Discover our exquisite collection or ask RaaHi, our friendly assistant, for personalized recommendations!
        </p>
      </div>
    );
  }

  // Render cart items
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (!product) return null;

          const itemTotal = product.price * item.quantity;

          return (
            <div key={item.productId} className="flex gap-4 pb-4 border-b border-border/40">
              <div className="w-24 h-24 rounded-xl overflow-hidden bg-muted/20 flex-shrink-0">
                {product.images[0] ? (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-semibold text-sm mb-1 truncate">{product.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{product.fabric}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full border-border/40 hover:border-primary hover:bg-primary/10 cart-action-glow"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                      disabled={updateQuantity.isPending}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-7 w-7 rounded-full border-border/40 hover:border-primary hover:bg-primary/10 cart-action-glow"
                      onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                      disabled={updateQuantity.isPending}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemove(item.productId)}
                    disabled={removeFromCart.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-sm font-semibold text-accent mt-2">₹{itemTotal.toLocaleString('en-IN')}</p>
              </div>
            </div>
          );
        })}
      </div>

      <Separator className="bg-border/40" />

      <div className="p-6 space-y-4 bg-muted/5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({cartItemCount} items)</span>
            <span className="font-medium">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-primary">Free</span>
          </div>
          <Separator className="bg-border/40" />
          <div className="flex justify-between text-lg font-serif font-bold">
            <span>Total</span>
            <span className="text-accent">₹{cartTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>
        <Button
          onClick={handleCheckout}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 checkout-button-glow h-12 text-lg font-semibold"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
