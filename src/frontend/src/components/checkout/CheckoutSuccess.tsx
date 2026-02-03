import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

interface CheckoutSuccessProps {
  orderId: string;
  onClose: () => void;
}

export default function CheckoutSuccess({ orderId, onClose }: CheckoutSuccessProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={`flex flex-col items-center justify-center h-full px-6 py-12 text-center ${prefersReducedMotion ? '' : 'wave-reveal'}`}>
      <div className="mb-8">
        <CheckCircle className="h-24 w-24 text-accent mx-auto mb-4" />
        <h2 className="text-3xl font-serif font-bold mb-2">Order Confirmed!</h2>
        <p className="text-lg text-muted-foreground mb-4">
          Your order is crafted with care and will reach you soon.
        </p>
        <p className="text-sm text-muted-foreground">
          Order ID: <span className="font-mono text-accent">{orderId}</span>
        </p>
      </div>
      <div className="space-y-3 w-full max-w-sm">
        <Button
          onClick={onClose}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow-gold hover:shadow-glow-pearl transition-all duration-300"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
