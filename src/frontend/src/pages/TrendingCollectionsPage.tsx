import { useEffect, useState } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Loader2 } from 'lucide-react';
import PremiumCatalogErrorState from '../components/storefront/PremiumCatalogErrorState';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { isAdminClient } from '../utils/isAdminClient';
import QuickViewSheet from '../components/QuickViewSheet';

export default function TrendingCollectionsPage() {
  const { identity } = useInternetIdentity();
  const [, navigate] = useSpaLocation();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();
  const { data: allProducts = [], isLoading, isError, refetch } = useGetAllProducts();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!identity) {
      setFlashMessage('Please login to view trending collections', 'info');
      setReturnPath('/collections/trending');
      navigate('/login?tab=signin');
    }
  }, [identity, navigate, setFlashMessage, setReturnPath]);

  // Filter for Banarasi products
  const trendingProducts = allProducts.filter((product) =>
    product.fabric?.toLowerCase().includes('banarasi')
  );

  const isAdmin = identity ? isAdminClient(identity.getPrincipal().toString()) : false;

  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PremiumCatalogErrorState onRetry={refetch} />
      </div>
    );
  }

  if (trendingProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <PremiumCatalogEmptyState
          showAdminCta={isAdmin}
          onAdminAction={() => navigate('/admin/products')}
        />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12 space-y-4">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-pearl-off-white">
              Trending Collections
            </h1>
            <p className="text-lg text-pearl-off-white/70 max-w-2xl mx-auto">
              Discover our most sought-after Banarasi patterns and featured designs
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                onQuickView={handleQuickView}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick View Sheet */}
      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => {
          if (!open) setQuickViewProductId(null);
        }}
      />
    </>
  );
}
