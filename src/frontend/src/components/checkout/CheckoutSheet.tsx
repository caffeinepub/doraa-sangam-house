import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CheckoutPanel from './CheckoutPanel';
import CheckoutSuccess from './CheckoutSuccess';

interface CheckoutSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CheckoutSheet({ open, onOpenChange }: CheckoutSheetProps) {
  const [orderId, setOrderId] = useState<string | null>(null);

  const handleSuccess = (id: string) => {
    setOrderId(id);
  };

  const handleClose = () => {
    setOrderId(null);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/40 p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border/40">
          <SheetTitle className="text-2xl font-serif">
            {orderId ? 'Order Confirmed' : 'Checkout'}
          </SheetTitle>
        </SheetHeader>
        {orderId ? (
          <CheckoutSuccess orderId={orderId} onClose={handleClose} />
        ) : (
          <CheckoutPanel onSuccess={handleSuccess} />
        )}
      </SheetContent>
    </Sheet>
  );
}
