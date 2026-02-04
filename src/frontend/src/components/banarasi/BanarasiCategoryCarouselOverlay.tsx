import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import ProductCard from '../ProductCard';
import QuickViewSheet from '../QuickViewSheet';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';
import { useGetProductsByCategory } from '../../hooks/useQueries';
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
  const prefersReducedMotion = usePrefersReducedMotion();
  const [location, navigate] = useSpaLocation();

  const category = BANARASI_CATEGORIES.find((c) => c.id === categoryId);
  const { data: products = [], isLoading } = useGetProductsByCategory(categoryId);

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
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <div key={idx} className="rounded-[24px] overflow-hidden bg-card/50 backdrop-blur-sm">
                    <div className="aspect-[3/4] shimmer-skeleton" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 shimmer-skeleton rounded" />
                      <div className="h-4 shimmer-skeleton rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products available in this category yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    onQuickView={setQuickViewProductId}
                    onViewDetail={handleViewDetail}
                  />
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
