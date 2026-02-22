import { useRef, useEffect } from 'react';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';

const categories = [
  { id: 'shirts', label: 'Shirts', slug: 'shirts' },
  { id: 'kurta', label: 'Kurta', slug: 'kurta' },
  { id: 'bottoms', label: 'Bottoms', slug: 'bottoms' },
  { id: 'sarees', label: 'Sarees', slug: 'sarees' },
  { id: 'shop-all', label: 'Shop All', slug: 'all' },
];

export default function CategoryNavigationBar() {
  const [, navigate] = useSpaLocation();
  const { identity } = useInternetIdentity();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (slug: string) => {
    if (!identity) {
      setFlashMessage('Please login to browse categories', 'info');
      setReturnPath(`/collections/${slug}`);
      navigate('/login?tab=signin');
      return;
    }

    if (slug === 'all') {
      navigate('/collections/trending');
    } else {
      navigate(`/collections/${slug}`);
    }
  };

  return (
    <div className="w-full py-6">
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-4 md:justify-center"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category.slug)}
            className="flex-shrink-0 snap-start px-8 py-3 rounded-full font-button font-bold uppercase text-sm tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] whitespace-nowrap"
            style={{
              backgroundColor: '#14b8a6',
              color: '#ffffff',
            }}
          >
            {category.label}
          </button>
        ))}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
