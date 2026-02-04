import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import { BanarasiCategoryCarouselOverlay } from '../banarasi/BanarasiCategoryCarouselOverlay';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

interface TrendingCategoriesSectionProps {
  navigate: (path: string) => void;
}

export default function TrendingCategoriesSection({ navigate }: TrendingCategoriesSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { elementRef: sectionRef, isRevealed } = useScrollReveal({ threshold: 0.1 });
  const prefersReducedMotion = usePrefersReducedMotion();

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('trending-categories-scroll');
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <section
        ref={sectionRef}
        className={`relative py-16 px-4 md:px-8 overflow-hidden transition-all duration-1000 ${
          isRevealed && !prefersReducedMotion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Pearl shimmer background ambience */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-accent" />
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground">Trending Categories</h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollContainer('left')}
                className="rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => scrollContainer('right')}
                className="rounded-full border-border/50 hover:border-primary/50 hover:bg-primary/10 transition-all min-h-[44px] min-w-[44px]"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div
            id="trending-categories-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {BANARASI_CATEGORIES.map((category, idx) => (
              <Card
                key={category.id}
                className={`flex-shrink-0 w-[280px] overflow-hidden rounded-[24px] bg-card/80 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all duration-500 cursor-pointer group shadow-lg ${
                  isRevealed && !prefersReducedMotion
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: isRevealed && !prefersReducedMotion ? `${idx * 100}ms` : '0ms',
                }}
                onClick={() => setSelectedCategoryId(category.id)}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                  <img
                    src={category.coverImage}
                    alt={category.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-serif font-bold text-white mb-1">{category.name}</h3>
                    <p className="text-xs text-white/80 line-clamp-2">{category.description}</p>
                  </div>
                </div>
                <CardContent className="p-4">
                  <Button
                    size="sm"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground gold-pulse-glow transition-all min-h-[44px]"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCategoryId(category.id);
                    }}
                  >
                    Explore
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {selectedCategoryId && (
        <BanarasiCategoryCarouselOverlay
          categoryId={selectedCategoryId}
          open={!!selectedCategoryId}
          onOpenChange={(open) => !open && setSelectedCategoryId(null)}
        />
      )}
    </>
  );
}
