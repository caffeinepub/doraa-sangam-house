import { useMemo, useState } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import QuickViewSheet from '../components/QuickViewSheet';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import PremiumCatalogErrorState from '../components/storefront/PremiumCatalogErrorState';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { isAdminClient } from '../utils/isAdminClient';
import { ADMIN_ROUTES } from '../admin/adminConfig';
import { useSpaLocation } from '../hooks/useSpaLocation';

interface StyleCollectionsPageProps {
  slug: string;
  onClose: () => void;
}

export default function StyleCollectionsPage({ slug, onClose }: StyleCollectionsPageProps) {
  const { data: allProducts = [], isLoading, isError, refetch } = useGetAllProducts();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(12);
  const { identity } = useInternetIdentity();
  const [location, navigate] = useSpaLocation();

  const isAdmin = isAdminClient(identity?.getPrincipal().toString());

  const collectionMap: Record<string, { title: string; keywords: string[] }> = {
    'banarasi': { title: 'Zari Royalty', keywords: ['banarasi', 'zari'] },
    'organza': { title: 'Sheer Elegance', keywords: ['organza'] },
    'georgette': { title: 'Flowing Grace', keywords: ['georgette'] },
    'silk': { title: 'Silk Symphony', keywords: ['silk'] },
    'kalamkari': { title: 'Heritage Artistry', keywords: ['kalamkari'] },
  };

  const collection = collectionMap[slug] || { title: 'Collection', keywords: [] };

  const filteredProducts = useMemo(() => {
    if (!collection.keywords.length) return [];
    return allProducts.filter((product) => {
      const searchText = `${product.name} ${product.description} ${product.fabric}`.toLowerCase();
      return collection.keywords.some((keyword) => searchText.includes(keyword.toLowerCase()));
    });
  }, [allProducts, collection.keywords]);

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + 12);
  };

  const handleAdminAction = () => {
    navigate(ADMIN_ROUTES.PRODUCTS);
  };

  const handleRetry = () => {
    refetch();
  };

  const displayedProducts = filteredProducts.slice(0, displayCount);
  const hasMore = displayCount < filteredProducts.length;

  return (
    <section className="min-h-screen py-16 px-4 md:px-8">
      <div className="container max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="mb-12">
          <Button
            variant="ghost"
            size="sm"
            className="mb-6 text-primary hover:text-primary/80 hover:bg-primary/10"
            onClick={onClose}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">{collection.title}</h1>
          <p className="text-muted-foreground text-lg">
            Explore our curated collection of {collection.title.toLowerCase()} sarees
          </p>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="rounded-[28px] overflow-hidden bg-card/50 backdrop-blur-sm">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <PremiumCatalogErrorState onRetry={handleRetry} />
        ) : filteredProducts.length === 0 ? (
          <PremiumCatalogEmptyState
            onAction={isAdmin ? undefined : onClose}
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

      {/* Quick view sheet */}
      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => !open && setQuickViewProductId(null)}
      />
    </section>
  );
}
