import { useState, lazy, Suspense } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import QuickViewSheet from '../components/QuickViewSheet';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import { BanarasiCategoryShowcase } from '../components/banarasi/BanarasiCategoryShowcase';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { useSpaLocation } from '../hooks/useSpaLocation';

const ProductDetailView = lazy(() => import('./ProductDetailView'));

export default function ProductsPage() {
  const { data: allProducts = [], isLoading } = useGetAllProducts();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [location, navigate] = useSpaLocation();

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: () => setDisplayCount((prev) => prev + 12),
    hasMore: displayCount < allProducts.length,
    isLoading: false,
  });

  const handleExploreCollections = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const displayedProducts = allProducts.slice(0, displayCount);

  return (
    <>
      {/* Banarasi Category Showcase */}
      <BanarasiCategoryShowcase />

      {/* All Products Section */}
      <section id="collections" className="border-t border-border/30 py-16 px-4 md:px-8">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-foreground mb-4">Our Collections</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover our curated selection of premium sarees
            </p>
          </div>

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
          ) : allProducts.length === 0 ? (
            <PremiumCatalogEmptyState onAction={handleExploreCollections} actionLabel="Back to Home" />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    onQuickView={setQuickViewProductId}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>

              {/* Infinite scroll sentinel */}
              {displayCount < allProducts.length && (
                <div ref={sentinelRef} className="h-20 flex items-center justify-center mt-8">
                  <div className="shimmer-skeleton w-32 h-8 rounded" />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Quick view sheet */}
      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => !open && setQuickViewProductId(null)}
      />

      {/* Detail view - lazy loaded */}
      {detailViewProductId && (
        <Suspense fallback={null}>
          <ProductDetailView productId={detailViewProductId} onClose={() => setDetailViewProductId(null)} />
        </Suspense>
      )}
    </>
  );
}
