import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import CartPanel from './CartPanel';

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCheckout: () => void;
}

export default function CartSheet({ open, onOpenChange, onCheckout }: CartSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg bg-card/95 backdrop-blur-xl border-border/40 p-0 flex flex-col">
        <SheetHeader className="px-6 py-4 border-b border-border/40">
          <SheetTitle className="text-2xl font-serif">Your Bag of Happiness</SheetTitle>
        </SheetHeader>
        <CartPanel onCheckout={onCheckout} />
      </SheetContent>
    </Sheet>
  );
}
