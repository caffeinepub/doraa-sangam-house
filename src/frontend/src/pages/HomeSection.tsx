import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CinematicHeroSlider from '../components/CinematicHeroSlider';
import ProductCard from '../components/ProductCard';
import QuickViewSheet from '../components/QuickViewSheet';
import ProductDetailView from '../pages/ProductDetailView';
import { useGetAllProducts } from '../hooks/useQueries';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';
import { isAdminClient } from '../utils/isAdminClient';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import PremiumCatalogErrorState from '../components/storefront/PremiumCatalogErrorState';
import CategoryNavigationBar from '../components/CategoryNavigationBar';

export default function HomeSection() {
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);
  const { data: products = [], isLoading, isError, refetch } = useGetAllProducts();
  const [, navigate] = useSpaLocation();
  const { identity } = useInternetIdentity();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();

  const isAdmin = identity ? isAdminClient(identity.getPrincipal().toString()) : false;

  const handleQuickView = (productId: string) => {
    if (!identity) {
      setFlashMessage('Please login to view product details', 'info');
      setReturnPath('/');
      navigate('/login?tab=signin');
      return;
    }
    setQuickViewProductId(productId);
  };

  const handleViewDetail = (productId: string) => {
    if (!identity) {
      setFlashMessage('Please login to view product details', 'info');
      setReturnPath('/');
      navigate('/login?tab=signin');
      return;
    }
    setDetailViewProductId(productId);
  };

  const handleCloseQuickView = () => {
    setQuickViewProductId(null);
  };

  const handleCloseDetailView = () => {
    setDetailViewProductId(null);
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <section id="home" className="relative min-h-screen pt-24 pb-20">
      {/* Centered Gold Luxury Logo */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-center">
          <img
            src="/assets/generated/doraa-logo-gold.dim_400x120.png"
            alt="DoRaa Sangam House - Gold Luxury Logo"
            className="h-24 md:h-32 lg:h-36 w-auto object-contain transition-all duration-400 hover:scale-105 hover:drop-shadow-[0_0_20px_rgba(201,169,110,0.6)]"
          />
        </div>
      </div>

      {/* Category Navigation Bar */}
      <CategoryNavigationBar />

      {/* Cinematic Hero Slider */}
      <div className="mb-20">
        <CinematicHeroSlider />
      </div>

      {/* Featured Products Section */}
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 
            className="font-playfair font-extrabold text-4xl md:text-5xl mb-4"
            style={{ 
              color: '#C9A96E',
              letterSpacing: '0.15em',
              textShadow: '0 0 12px rgba(201,169,110,0.4)'
            }}
          >
            Featured Collection
          </h2>
          <p 
            className="font-lora text-lg md:text-xl max-w-2xl mx-auto"
            style={{ 
              color: '#5C4B51',
              lineHeight: '2.0'
            }}
          >
            Discover our handpicked selection of premium sarees
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-[28px] overflow-hidden"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#C9A96E', borderWidth: '1px' }}
              >
                <div className="aspect-[3/4] shimmer-skeleton" />
                <div className="p-6 space-y-3">
                  <div className="h-4 shimmer-skeleton rounded" />
                  <div className="h-4 shimmer-skeleton rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <PremiumCatalogErrorState onRetry={refetch} />
        )}

        {/* Empty State */}
        {!isLoading && !isError && products.length === 0 && (
          <PremiumCatalogEmptyState 
            showAdminCta={isAdmin}
            onAdminAction={isAdmin ? () => navigate('/admin/dashboard') : undefined}
          />
        )}

        {/* Products Grid */}
        {!isLoading && !isError && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                onQuickView={handleQuickView}
                onViewDetail={handleViewDetail}
              />
            ))}
          </div>
        )}

        {/* View All Button */}
        {!isLoading && !isError && products.length > 8 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/collections/trending')}
              className="button-luxury font-button font-bold uppercase px-8 py-6 text-base"
            >
              View All Products
            </Button>
          </div>
        )}
      </div>

      {/* Quick View Sheet */}
      {quickViewProductId && (
        <QuickViewSheet
          productId={quickViewProductId}
          open={!!quickViewProductId}
          onOpenChange={(open) => !open && handleCloseQuickView()}
        />
      )}

      {/* Product Detail View */}
      {detailViewProductId && (
        <ProductDetailView
          productId={detailViewProductId}
          onClose={handleCloseDetailView}
        />
      )}
    </section>
  );
}
