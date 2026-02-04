import PremiumCatalogEmptyState from '../storefront/PremiumCatalogEmptyState';
import { useDynamicMetadata } from '../../hooks/useDynamicMetadata';

export function BanarasiCategoryShowcase() {
  useDynamicMetadata({
    title: 'Banarasi Saree Collections - DoRaa Sangam House',
    description:
      'Explore our exquisite Banarasi saree collections featuring premium handwoven silk sarees.',
  });

  const handleExploreCollections = () => {
    const element = document.querySelector('#home');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
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

      <PremiumCatalogEmptyState onAction={handleExploreCollections} actionLabel="Back to Home" />
    </section>
  );
}
