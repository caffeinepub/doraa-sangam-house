import { useRef } from 'react';
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
            className="flex-shrink-0 snap-start px-8 py-3 rounded-full font-vibes text-script-sm tracking-wider transition-all duration-300 hover:scale-105 whitespace-nowrap"
            style={{
              color: '#E8C0C8',
              backgroundColor: 'transparent',
              border: '2px solid #C9A96E',
              boxShadow: '0 0 0 rgba(201, 169, 110, 0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 0 18px rgba(201, 169, 110, 0.45)';
              e.currentTarget.style.backgroundColor = 'rgba(201, 169, 110, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 0 rgba(201, 169, 110, 0)';
              e.currentTarget.style.backgroundColor = 'transparent';
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
