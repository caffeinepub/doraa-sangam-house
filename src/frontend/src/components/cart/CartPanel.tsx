import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCommerce } from '../../hooks/useCommerce';
import { useUpdateCartQuantity, useRemoveFromCart } from '../../hooks/useQueries';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';

interface CartPanelProps {
  onCheckout: () => void;
}

export default function CartPanel({ onCheckout }: CartPanelProps) {
  const { cart, cartTotal, cartItemCount } = useCommerce();
  const updateQuantity = useUpdateCartQuantity();
  const removeFromCart = useRemoveFromCart();

  const cartItems = cart.map((item) => {
    const product = DUMMY_PRODUCTS.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  if (cartItemCount === 0) {
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

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {cartItems.map((item) => {
          if (!item.product) return null;
          return (
            <div key={item.productId} className="flex gap-4 p-4 bg-muted/10 rounded-lg border border-border/40">
              <img
                src={item.product.imageUrl}
                alt={item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate mb-1">{item.product.name}</h4>
                <p className="text-sm text-accent font-semibold mb-2">₹{item.product.price.toLocaleString()}</p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                    disabled={updateQuantity.isPending}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    disabled={updateQuantity.isPending}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 hover:text-destructive"
                onClick={() => removeFromCart.mutate(item.productId)}
                disabled={removeFromCart.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
      <div className="border-t border-border/40 p-6 space-y-4 bg-muted/5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({cartItemCount} items)</span>
            <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
          </div>
          <Separator className="bg-border/40" />
          <div className="flex justify-between text-lg font-serif font-bold">
            <span>Total</span>
            <span className="text-accent">₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <Button
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-gold hover:shadow-glow-pearl transition-all duration-300 h-12 text-lg"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
