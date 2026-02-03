import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ProductCard from '../ProductCard';
import QuickViewSheet from '../QuickViewSheet';
import ProductDetailView from '../../pages/ProductDetailView';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

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
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const category = BANARASI_CATEGORIES.find((c) => c.id === categoryId);
  const products = DUMMY_PRODUCTS.filter(
    (p) => p.category === 'banarasi' && p.banarasiCategory === categoryId
  );

  useDynamicMetadata({
    title: category?.name,
    description: category?.description,
  });

  if (!category) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/50">
          <DialogHeader>
            <DialogTitle className="text-3xl md:text-4xl font-serif text-center">
              {category.name}
            </DialogTitle>
            <DialogDescription className="text-center text-lg mt-2">
              {category.description}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-8">
            <Carousel
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {products.map((product) => (
                  <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <ProductCard
                      productId={product.id}
                      onQuickView={setQuickViewProductId}
                      onViewDetail={setDetailViewProductId}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center gap-4 mt-8">
                <CarouselPrevious className="static translate-y-0 bg-primary/10 hover:bg-primary/20 border-primary/30" />
                <CarouselNext className="static translate-y-0 bg-primary/10 hover:bg-primary/20 border-primary/30" />
              </div>
            </Carousel>
          </div>
        </DialogContent>
      </Dialog>

      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => !open && setQuickViewProductId(null)}
      />

      {detailViewProductId && (
        <ProductDetailView
          productId={detailViewProductId}
          onClose={() => setDetailViewProductId(null)}
        />
      )}
    </>
  );
}
