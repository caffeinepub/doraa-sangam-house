import { useMemo, useState } from 'react';
import { useGetAllProducts } from '../hooks/useQueries';
import ProductCard from '../components/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import PremiumCatalogEmptyState from '../components/storefront/PremiumCatalogEmptyState';
import QuickViewSheet from '../components/QuickViewSheet';
import { useSpaLocation } from '../hooks/useSpaLocation';

interface StyleCollectionsPageProps {
  slug: string;
  onClose: () => void;
}

const STYLE_LABELS: Record<string, string> = {
  banarasi: 'Zari Royalty',
  organza: 'Sheer Elegance',
  georgette: 'Flowing Grace',
  silk: 'Silk Symphony',
  kalamkari: 'Heritage Artistry',
};

const FABRIC_KEYWORDS: Record<string, string[]> = {
  banarasi: ['banarasi', 'zari', 'brocade'],
  organza: ['organza', 'sheer', 'transparent'],
  georgette: ['georgette', 'flowing', 'drape'],
  silk: ['silk', 'mulberry', 'tussar'],
  kalamkari: ['kalamkari', 'hand-painted', 'block print'],
};

export default function StyleCollectionsPage({ slug, onClose }: StyleCollectionsPageProps) {
  const { data: allProducts, isLoading } = useGetAllProducts();
  const [, navigate] = useSpaLocation();
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];
    
    const keywords = FABRIC_KEYWORDS[slug] || [];
    
    return allProducts.filter((product) => {
      const fabricLower = product.fabric.toLowerCase();
      const nameLower = product.name.toLowerCase();
      const descLower = product.description.toLowerCase();
      
      return keywords.some(
        (keyword) =>
          fabricLower.includes(keyword) ||
          nameLower.includes(keyword) ||
          descLower.includes(keyword)
      );
    });
  }, [allProducts, slug]);

  const styleLabel = STYLE_LABELS[slug] || 'Collection';

  const handleQuickView = (productId: string) => {
    setQuickViewProductId(productId);
  };

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleQuickViewOpenChange = (open: boolean) => {
    if (!open) {
      setQuickViewProductId(null);
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 text-center">
            <button
              onClick={onClose}
              className="inline-flex items-center gap-2 text-pearl-blue hover:text-gold transition-colors mb-4"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Home
            </button>
            
            <h1 className="text-4xl md:text-5xl font-serif text-gold mb-2">
              {styleLabel}
            </h1>
            <p className="text-pearl-off-white/80 text-lg">
              Discover our curated collection
            </p>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="w-full h-96 rounded-[24px]" />
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-1/2 h-4" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && filteredProducts.length === 0 && (
            <PremiumCatalogEmptyState
              actionLabel="Explore All Collections"
              onAction={onClose}
            />
          )}

          {/* Product grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
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
      </div>

      {/* Quick View Sheet */}
      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={handleQuickViewOpenChange}
      />
    </>
  );
}
