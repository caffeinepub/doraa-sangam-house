import { Button } from '@/components/ui/button';
import CategoryNavigationBar from '../components/CategoryNavigationBar';
import HeroBanner from '../components/HeroBanner';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { useState } from 'react';
import QuickViewSheet from '../components/QuickViewSheet';
import PremiumCatalogErrorState from '../components/storefront/PremiumCatalogErrorState';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import { isAdminClient } from '../utils/isAdminClient';

export default function HomeSection() {
  const { identity } = useInternetIdentity();
  const [, navigate] = useSpaLocation();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();
  const { data: products = [], isLoading, isError, refetch } = useGetAllProducts();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  // Convert Identity to principal string for admin check
  const principalString = identity?.getPrincipal().toString();
  const isAdmin = isAdminClient(principalString);

  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
    setQuickViewOpen(true);
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleShopCollection = () => {
    if (identity) {
      navigate('/collections/trending');
    } else {
      setFlashMessage('Please login to shop the collection', 'info');
      setReturnPath('/collections/trending');
      navigate('/login?tab=signin');
    }
  };

  const handleExploreCategories = () => {
    if (identity) {
      navigate('/categories');
    } else {
      setFlashMessage('Please login to explore categories', 'info');
      setReturnPath('/categories');
      navigate('/login?tab=signin');
    }
  };

  const handleAdminAction = () => {
    navigate('/admin/products');
  };

  return (
    <>
      <section id="home" className="relative min-h-screen flex flex-col items-center px-4 py-12">
        <div className="max-w-7xl mx-auto w-full space-y-8">
          {/* Large Centered Logo */}
          <div className="flex justify-center py-8">
            <img
              src="/assets/generated/logo-doraa-sangam.dim_1200x400.png"
              alt="DoRaa Sangam House"
              className="h-24 md:h-32 lg:h-40 w-auto object-contain"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(212,175,55,0.6))',
              }}
            />
          </div>

          {/* Horizontal Category Navigation */}
          <CategoryNavigationBar />

          {/* Hero Banner */}
          {identity && <HeroBanner />}

          {/* Product Grid */}
          {identity && (
            <div className="space-y-8">
              <div className="text-center">
                <h2
                  className="text-3xl md:text-4xl font-serif font-bold"
                  style={{ color: 'var(--heading-color)' }}
                >
                  Featured Collection
                </h2>
              </div>

              {isError ? (
                <PremiumCatalogErrorState onRetry={refetch} />
              ) : isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="shimmer-skeleton rounded-[28px]"
                      style={{ height: '500px' }}
                    />
                  ))}
                </div>
              ) : products.length === 0 ? (
                <PremiumCatalogEmptyState
                  showAdminCta={isAdmin}
                  onAdminAction={isAdmin ? handleAdminAction : undefined}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      productId={product.id}
                      onQuickView={handleQuickView}
                      onViewDetail={handleViewDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action Buttons - Only show when not logged in */}
          {!identity && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <Button
                onClick={handleShopCollection}
                className="min-w-[240px] min-h-[56px] bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:scale-105"
              >
                Shop the Sangam Collection
              </Button>
              <Button
                onClick={handleExploreCategories}
                className="min-w-[240px] min-h-[56px] bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:scale-105"
              >
                Explore Categories
              </Button>
            </div>
          )}
        </div>
      </section>

      {quickViewProductId && (
        <QuickViewSheet
          productId={quickViewProductId}
          open={quickViewOpen}
          onOpenChange={setQuickViewOpen}
        />
      )}
    </>
  );
}
