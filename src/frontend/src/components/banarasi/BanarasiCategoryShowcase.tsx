import { useState } from 'react';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';
import { DUMMY_PRODUCTS } from '../../data/dummyProducts';
import ProductCard from '../ProductCard';
import QuickViewSheet from '../QuickViewSheet';
import { useSpaLocation } from '../../hooks/useSpaLocation';

export function BanarasiCategoryShowcase() {
  const [quickViewProductId, setQuickViewProductId] = useState<string | null>(null);
  const [location, navigate] = useSpaLocation();

  useDynamicMetadata({
    title: 'Banarasi Saree Collections - DoRaa Sangam House',
    description:
      'Explore our exquisite Banarasi saree collections featuring premium handwoven silk sarees.',
  });

  const handleViewDetail = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  // Filter dummy products for Banarasi category
  const banarasiProducts = DUMMY_PRODUCTS.filter((p) => p.category === 'Banarasi');

  return (
    <>
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
            Discover our curated Banarasi saree collections, each telling a unique story of heritage, craftsmanship, and
            timeless elegance.
          </p>
        </div>

        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {banarasiProducts.map((product) => (
              <div key={product.id} className="group">
                <div className="rounded-[28px] overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black border border-primary/20 hover:border-primary/40 transition-all duration-400 hover:shadow-glow-pearl hover:-translate-y-2 hover:scale-105">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-semibold mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-accent">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuickViewSheet
        productId={quickViewProductId}
        open={!!quickViewProductId}
        onOpenChange={(open) => !open && setQuickViewProductId(null)}
      />
    </>
  );
}
