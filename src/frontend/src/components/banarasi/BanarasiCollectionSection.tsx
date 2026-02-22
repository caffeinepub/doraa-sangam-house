import { useState, useEffect, useRef } from 'react';
import { BanarasiCategory } from '../../data/banarasiCategories';
import { DummyProduct } from '../../data/dummyProducts';
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

  // Don't render if no products
  if (products.length === 0) return null;

  return (
    <section
      ref={elementRef}
      className={`relative py-20 scroll-reveal-enhanced ${
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
              stroke="#C9A96E"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
          </svg>
        </div>
      )}

      {/* Section Header */}
      <div className="container mb-12 px-8">
        <div className="flex items-center justify-between flex-wrap gap-6">
          <div>
            <h3 
              className="text-3xl md:text-4xl font-serif font-black mb-3 inline-block relative script-font script-entrance"
              style={{ 
                color: '#C9A96E',
                textShadow: '0 0 12px rgba(201, 169, 110, 0.6)',
                letterSpacing: '0.09375em'
              }}
            >
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
                  stroke="#C9A96E"
                  strokeWidth="1.5"
                  fill="none"
                  className="gold-wave-underline"
                />
              </svg>
            </h3>
            <p className="mt-4 max-w-2xl" style={{ color: '#D4C9B0', lineHeight: '2.0' }}>
              {category.description}
            </p>
          </div>
          <Badge 
            className="border-0 shadow-glow-gold text-base px-5 py-2.5"
            style={{ backgroundColor: 'rgba(201, 169, 110, 0.9)', color: '#2E1A47' }}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {products.length} Sarees
          </Badge>
        </div>
      </div>

      {/* Carousel */}
      <div className="container px-8">
        <Carousel
          setApi={setApi}
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <div className="group">
                  <div 
                    className="rounded-[28px] overflow-hidden backdrop-blur-sm border-2 transition-all duration-400 hover:-translate-y-2 hover:scale-105"
                    style={{
                      background: 'rgba(46, 26, 71, 0.6)',
                      borderColor: 'rgba(201, 169, 110, 0.3)',
                      boxShadow: 'inset 0 0 12px rgba(201, 169, 110, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.6)';
                      e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(201, 169, 110, 0.6), 0 0 20px rgba(201, 169, 110, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(201, 169, 110, 0.3)';
                      e.currentTarget.style.boxShadow = 'inset 0 0 12px rgba(201, 169, 110, 0.3)';
                    }}
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-8">
                      <h3 
                        className="text-xl font-serif font-semibold mb-3"
                        style={{ color: '#C9A96E', textShadow: '0 0 8px rgba(201, 169, 110, 0.4)' }}
                      >
                        {product.name}
                      </h3>
                      <p 
                        className="text-2xl font-bold"
                        style={{ color: '#C9A96E' }}
                      >
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious 
            className="hidden md:flex -left-12 backdrop-blur border-2 hover:scale-110 transition-all duration-300"
            style={{
              backgroundColor: 'rgba(201, 169, 110, 0.2)',
              borderColor: 'rgba(201, 169, 110, 0.6)',
              color: '#C9A96E'
            }}
          />
          <CarouselNext 
            className="hidden md:flex -right-12 backdrop-blur border-2 hover:scale-110 transition-all duration-300"
            style={{
              backgroundColor: 'rgba(201, 169, 110, 0.2)',
              borderColor: 'rgba(201, 169, 110, 0.6)',
              color: '#C9A96E'
            }}
          />
        </Carousel>
      </div>
    </section>
  );
}
