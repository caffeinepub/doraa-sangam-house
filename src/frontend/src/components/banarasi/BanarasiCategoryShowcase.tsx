import { useState } from 'react';
import { BANARASI_CATEGORIES } from '../../data/banarasiCategories';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import { groupBanarasiProducts } from '../../data/banarasiGrouping';
import { BanarasiCollectionSection } from './BanarasiCollectionSection';
import { BanarasiShowcaseAmbience } from './BanarasiShowcaseAmbience';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';
import QuickViewSheet from '../QuickViewSheet';
import ProductDetailView from '../../pages/ProductDetailView';

export function BanarasiCategoryShowcase() {
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [detailViewProductId, setDetailViewProductId] = useState<string | null>(null);

  useDynamicMetadata({
    title: 'Banarasi Saree Collections - DoRaa Sangam House',
    description: 'Explore our exquisite Banarasi saree collections featuring Zari Legacy, Silk Symphony, Royal Heritage Weaves, and more premium handwoven silk sarees.',
  });

  // Group products by category using heuristic grouping
  const groupedProducts = groupBanarasiProducts(DUMMY_PRODUCTS);

  return (
    <>
      {/* Pearl Shimmer Ambience */}
      <BanarasiShowcaseAmbience />

      {/* Main Showcase Section */}
      <section className="relative py-24 md:py-32 bg-gradient-to-b from-background via-background/95 to-background">
        <div className="container mb-16 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight inline-block relative">
            Banarasi Saree Collections
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
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6">
            Discover our curated Banarasi saree collections, each telling a unique story of heritage, craftsmanship, and timeless elegance. From heavy zari work to delicate silk weaves, find your perfect masterpiece.
          </p>
        </div>

        {/* Collection Sections with Scroll Reveal */}
        <div className="relative z-10">
          {BANARASI_CATEGORIES.map((category, index) => {
            const products = groupedProducts[category.id] || [];
            if (products.length === 0) return null;

            return (
              <BanarasiCollectionSection
                key={category.id}
                category={category}
                products={products}
                index={index}
                onQuickView={setQuickViewProductId}
                onViewDetail={setDetailViewProductId}
              />
            );
          })}
        </div>
      </section>

      {/* Quick View and Detail View Modals */}
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
