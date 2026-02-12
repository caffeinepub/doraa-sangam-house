import { useState, lazy, Suspense } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import QuickViewSheet from '../components/QuickViewSheet';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import PremiumCatalogErrorState from '../components/storefront/PremiumCatalogErrorState';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { isAdminClient } from '../utils/isAdminClient';
import { ADMIN_ROUTES } from '../admin/adminConfig';

const ProductDetailView = lazy(() => import('./ProductDetailView'));

export default function ProductsPage() {
  const { data: allProducts = [], isLoading, isError, refetch } = useGetAllProducts();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const [location, navigate] = useSpaLocation();
  const { identity } = useInternetIdentity();

  const isAdmin = isAdminClient(identity?.getPrincipal().toString());

  const handleExploreCollections = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminAction = () => {
    navigate(ADMIN_ROUTES.PRODUCTS);
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const handleRetry = () => {
    refetch();
  };

  const displayedProducts = allProducts.slice(0, displayCount);
  const hasMore = displayCount < allProducts.length;

  return (
    <>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="rounded-[28px] overflow-hidden bg-card/50 backdrop-blur-sm">
                  <div className="aspect-[3/4] shimmer-skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 shimmer-skeleton rounded" />
                    <div className="h-4 shimmer-skeleton rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <PremiumCatalogErrorState onRetry={handleRetry} />
          ) : allProducts.length === 0 ? (
            <PremiumCatalogEmptyState
              onAction={isAdmin ? undefined : handleExploreCollections}
              actionLabel="Back to Home"
              showAdminCta={isAdmin}
              onAdminAction={isAdmin ? handleAdminAction : undefined}
            />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    productId={product.id}
                    onQuickView={setQuickViewProductId}
                    onViewDetail={handleViewDetail}
                  />
                ))}
              </div>

              {/* Load More button */}
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    style={{
                      boxShadow: '0 0 20px rgba(127, 179, 213, 0.3)',
                    }}
                    onClick={handleLoadMore}
                  >
                    Load More
                  </Button>
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
