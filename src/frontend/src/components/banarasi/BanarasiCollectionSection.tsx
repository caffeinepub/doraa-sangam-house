import { useState, useEffect, useRef } from 'react';
import { DummyProduct } from '../../data/dummyProducts';
import { BanarasiCategory } from '../../data/banarasiCategories';
import ProductCard from '../ProductCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { useStaggeredScrollReveal } from '../../hooks/useScrollReveal';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

interface BanarasiCollectionSectionProps {
  category: BanarasiCategory;
  products: DummyProduct[];
  index: number;
  onQuickView: (productId: string) => void;
  onViewDetail: (productId: string) => void;
}

export function BanarasiCollectionSection({
  category,
  products,
  index,
  onQuickView,
  onViewDetail,
}: BanarasiCollectionSectionProps) {
  const { elementRef, isRevealed, delay } = useStaggeredScrollReveal(index, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    staggerDelay: 150,
  });
  const prefersReducedMotion = usePrefersReducedMotion();
  const [api, setApi] = useState<any>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Manual autoplay implementation
  useEffect(() => {
    if (!api || prefersReducedMotion) return;

    const startAutoplay = () => {
      autoplayIntervalRef.current = setInterval(() => {
        if (api.canScrollNext()) {
          api.scrollNext();
        } else {
          api.scrollTo(0);
        }
      }, 4000);
    };

    const stopAutoplay = () => {
      if (autoplayIntervalRef.current) {
        clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };

    startAutoplay();

    // Stop autoplay on user interaction
    api.on('pointerDown', stopAutoplay);

    return () => {
      stopAutoplay();
      api.off('pointerDown', stopAutoplay);
    };
  }, [api, prefersReducedMotion]);

  return (
    <section
      ref={elementRef}
      className={`relative py-16 scroll-reveal-enhanced ${
        isRevealed ? 'scroll-reveal-visible' : ''
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Gold Wave Divider */}
      {index > 0 && (
        <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
          <svg
            className="w-full h-12 -translate-y-1/2"
            viewBox="0 0 1200 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <path
              d="M0 12 Q 150 0, 300 12 T 600 12 T 900 12 T 1200 12"
              stroke="oklch(var(--accent))"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
      )}

      {/* Section Header */}
      <div className="container mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-3xl md:text-4xl font-serif font-bold mb-2 inline-block relative">
              {category.name}
              <svg
                className="absolute -bottom-2 left-0 w-full h-2"
                viewBox="0 0 400 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 Q 50 0, 100 4 T 200 4 T 300 4 T 400 4"
                  stroke="oklch(var(--accent))"
                  strokeWidth="1.5"
                  fill="none"
                  className="gold-wave-underline"
                />
              </svg>
            </h3>
            <p className="text-muted-foreground mt-3 max-w-2xl">{category.description}</p>
          </div>
          <Badge className="bg-accent/90 text-accent-foreground border-0 shadow-glow-gold text-base px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            {products.length} Sarees
          </Badge>
        </div>
      </div>

      {/* Carousel */}
      <div className="container">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard
                  productId={product.id}
                  onQuickView={onQuickView}
                  onViewDetail={onViewDetail}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 bg-card/80 backdrop-blur border-primary/30 hover:bg-primary/20 hover:border-primary" />
          <CarouselNext className="hidden md:flex -right-12 bg-card/80 backdrop-blur border-primary/30 hover:bg-primary/20 hover:border-primary" />
        </Carousel>
      </div>
    </section>
  );
}
