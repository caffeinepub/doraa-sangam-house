import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useCommerce } from '../../hooks/useCommerce';
import { useCheckout, useGetAllProducts } from '../../hooks/useQueries';
import { Loader2, AlertCircle } from 'lucide-react';
import { initiateRazorpayPayment } from '../../utils/razorpay';
import type { ShippingAddress } from '../../backend';
import { showNetworkErrorToast } from '../../utils/premiumToasts';
import { useNotifications } from '../../notifications/useNotifications';

interface CheckoutPanelProps {
  onSuccess: (orderId: string) => void;
}

export default function CheckoutPanel({ onSuccess }: CheckoutPanelProps) {
  const { cart, cartTotal, cartItemCount } = useCommerce();
  const checkout = useCheckout();
  const { data: products = [] } = useGetAllProducts();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      // Initiate Razorpay payment
      const paymentResult = await initiateRazorpayPayment({
        amount: cartTotal,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        description: `${cartItemCount} item(s) from DoRaa Sangam House`,
      });

      if (!paymentResult.success) {
        setError(paymentResult.error || 'Payment failed');
        showNetworkErrorToast();
        setIsProcessing(false);
        return;
      }

      // Create shipping address object
      const shippingAddress: ShippingAddress = {
        name: formData.name,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: formData.country,
        phone: formData.phone,
      };

      // Create order in backend
      checkout.mutate(
        {
          paymentId: paymentResult.paymentId!,
          shippingAddress,
        },
        {
          onSuccess: (data) => {
            setIsProcessing(false);
            addNotification('Order placed');
            onSuccess(data.orderId);
          },
          onError: (err) => {
            console.error('Order creation error:', err);
            setError('Failed to create order. Please contact support.');
            showNetworkErrorToast();
            setIsProcessing(false);
          },
        }
      );
    } catch (err) {
      console.error('Checkout error:', err);
      setError('An unexpected error occurred. Please try again.');
      showNetworkErrorToast();
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/40 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">{error}</p>
              <Button
                type="button"
                variant="link"
                className="text-destructive hover:text-destructive/80 p-0 h-auto mt-1"
                onClick={() => setError(null)}
              >
                Try again
              </Button>
            </div>
          </div>
        )}

        {/* Contact Information */}
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
                disabled={isProcessing}
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
                disabled={isProcessing}
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
                placeholder="+91XXXXXXXXXX"
                disabled={isProcessing}
              />
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Shipping Address */}
        <div>
          <h3 className="text-lg font-serif font-semibold mb-4">Shipping Address</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                required
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="bg-muted/10 border-border/40"
                placeholder="House no., Building name, Street"
                disabled={isProcessing}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-muted/10 border-border/40"
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  required
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-muted/10 border-border/40"
                  disabled={isProcessing}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code *</Label>
                <Input
                  id="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="bg-muted/10 border-border/40"
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="bg-muted/10 border-border/40"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Order Summary */}
        <div>
          <h3 className="text-lg font-serif font-semibold mb-4">Order Summary</h3>
          <div className="space-y-3">
            {cart.map((item) => {
              const product = products.find((p) => p.id === item.productId);
              if (!product) return null;
              return (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {product.name} × {item.quantity}
                  </span>
                  <span className="font-medium">₹{(product.price * item.quantity).toLocaleString('en-IN')}</span>
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
          type="submit"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 checkout-button-glow h-12 text-lg font-semibold"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing Payment...
            </>
          ) : (
            'Pay with Razorpay'
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Secure payment powered by Razorpay (Test Mode)
        </p>
      </div>
    </form>
  );
}
