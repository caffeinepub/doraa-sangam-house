import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCommerce } from '../../hooks/useCommerce';
import { useCheckout } from '../../hooks/useQueries';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import { Loader2 } from 'lucide-react';

interface CheckoutPanelProps {
  onSuccess: (orderId: string) => void;
}

export default function CheckoutPanel({ onSuccess }: CheckoutPanelProps) {
  const { cart, cartTotal, cartItemCount } = useCommerce();
  const checkout = useCheckout();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const cartItems = cart.map((item) => {
    const product = DUMMY_PRODUCTS.find((p) => p.id === item.productId);
    return { ...item, product };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkout.mutate(formData, {
      onSuccess: (data) => {
        onSuccess(data.orderId);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        <div>
          <h3 className="text-lg font-serif font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted/10 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-muted/10 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-muted/10 border-border/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address *</Label>
              <Input
                id="address"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-muted/10 border-border/40"
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        <div>
          <h3 className="text-lg font-serif font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cartItems.map((item) => {
              if (!item.product) return null;
              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-border/40 p-6 space-y-4 bg-muted/5">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal ({cartItemCount} items)</span>
            <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-primary">Free</span>
          </div>
          <Separator className="bg-border/40" />
          <div className="flex justify-between text-lg font-serif font-bold">
            <span>Total</span>
            <span className="text-accent">₹{cartTotal.toLocaleString()}</span>
          </div>
        </div>
        <Button
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-gold hover:shadow-glow-pearl transition-all duration-300 h-12 text-lg"
          disabled={checkout.isPending}
        >
          {checkout.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            'Place Order'
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Guest checkout • No account required
        </p>
      </div>
    </form>
  );
}
