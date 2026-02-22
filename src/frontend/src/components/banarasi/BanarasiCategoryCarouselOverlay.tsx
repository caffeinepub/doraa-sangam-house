import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import QuickViewSheet from '../QuickViewSheet';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';
import { useSpaLocation } from '../../hooks/useSpaLocation';

interface BanarasiCategoryCarouselOverlayProps {
  categoryId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BanarasiCategoryCarouselOverlay({
  categoryId,
  open,
  onOpenChange,
}: BanarasiCategoryCarouselOverlayProps) {
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [location, navigate] = useSpaLocation();

  const category = BANARASI_CATEGORIES.find((c) => c.id === categoryId);

  // Get dummy products for this category
  const products = DUMMY_PRODUCTS.filter((p) => p.category === categoryId);

  useDynamicMetadata({
    title: category?.name,
    description: category?.description,
  });

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (!category) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl font-serif text-center">{category.name}</DialogTitle>
            <DialogDescription className="text-center text-lg mt-2">{category.description}</DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div key={product.id} className="group">
                    <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border border-primary/20 hover:border-primary/40 transition-all duration-400 hover:shadow-glow-pearl hover:-translate-y-2 hover:scale-105">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-serif font-semibold mb-2">{product.name}</h3>
                        <p className="text-2xl font-bold text-accent">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => !open && setQuickViewProductId(null)}
      />
    </>
  );
}
