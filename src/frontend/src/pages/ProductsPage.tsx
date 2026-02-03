import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import QuickViewSheet from '../components/QuickViewSheet';
import ProductDetailView from './ProductDetailView';
import { useStaggeredScrollReveal } from '../hooks/useScrollReveal';
import { DUMMY_PRODUCTS } from '../data/dummyProducts';
import { BanarasiCategoryShowcase } from '../components/banarasi/BanarasiCategoryShowcase';
import { BanarasiProductCardSkeleton } from '../components/banarasi/BanarasiShowcaseSkeletons';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

function RevealWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  const { elementRef, isRevealed, delay } = useStaggeredScrollReveal(index, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    staggerDelay: 80,
  });

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal-enhanced ${isRevealed ? 'scroll-reveal-visible' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function ProductsPage() {
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const nonBanarasiProducts = DUMMY_PRODUCTS.filter((p) => p.category !== 'banarasi');
  const displayedProducts = nonBanarasiProducts.slice(0, displayCount);
  const hasMore = displayCount < nonBanarasiProducts.length;

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount((prev) => Math.min(prev + 8, nonBanarasiProducts.length));
      setIsLoadingMore(false);
    }, 500);
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore,
    isLoading: isLoadingMore,
    threshold: 0.8,
  });

  return (
    <>
      {/* Banarasi Category Showcase */}
      <BanarasiCategoryShowcase />

      {/* Other Products Section */}
      <section id="collections" className="container py-24 md:py-32 border-t border-border/30">
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2 tracking-tight inline-block relative">
            More from Our Collection
            <svg
              className="absolute -bottom-3 left-0 w-full h-3"
              viewBox="0 0 400 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path
                d="M0 6 Q 50 0, 100 6 T 200 6 T 300 6 T 400 6"
                stroke="oklch(var(--accent))"
                strokeWidth="2"
                fill="none"
                className="gold-wave-underline"
              />
            </svg>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto mt-6">
            Discover our curated collection of premium products, each carefully selected to embody quality,
            craftsmanship, and timeless elegance.
          </p>
        </div>

        <div className="masonry-grid">
          {displayedProducts.map((product, index) => (
            <RevealWrapper key={product.id} index={index}>
              <ProductCard
                productId={product.id}
                onQuickView={setQuickViewProductId}
                onViewDetail={setDetailViewProductId}
              />
            </RevealWrapper>
          ))}
          {isLoadingMore &&
            [1, 2, 3, 4].map((i) => (
              <div key={`skeleton-${i}`} className="masonry-item">
                <BanarasiProductCardSkeleton />
              </div>
            ))}
        </div>

        {/* Infinite Scroll Sentinel */}
        {hasMore && <div ref={sentinelRef} className="h-20" />}
      </section>

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
