import { useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';

const categories = [
  {
    slug: 'banarasi',
    name: 'Zari Royalty',
    description: 'Exquisite Banarasi silk with intricate zari work',
    image: '/assets/generated/explore-style-icon-banarasi.dim_128x128.png',
  },
  {
    slug: 'organza',
    name: 'Sheer Elegance',
    description: 'Delicate organza with ethereal beauty',
    image: '/assets/generated/explore-style-icon-organza.dim_128x128.png',
  },
  {
    slug: 'georgette',
    name: 'Flowing Grace',
    description: 'Graceful georgette drapes with timeless appeal',
    image: '/assets/generated/explore-style-icon-georgette.dim_128x128.png',
  },
  {
    slug: 'silk',
    name: 'Silk Symphony',
    description: 'Pure silk masterpieces for every occasion',
    image: '/assets/generated/explore-style-icon-silk.dim_128x128.png',
  },
  {
    slug: 'kalamkari',
    name: 'Heritage Artistry',
    description: 'Traditional Kalamkari hand-painted designs',
    image: '/assets/generated/explore-style-icon-kalamkari.dim_128x128.png',
  },
];

export default function CategoriesMainPage() {
  const { identity } = useInternetIdentity();
  const [, navigate] = useSpaLocation();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!identity) {
      setFlashMessage('Please login to explore categories', 'info');
      setReturnPath('/categories');
      navigate('/login?tab=signin');
    }
  }, [identity, navigate, setFlashMessage, setReturnPath]);

  const handleCategoryClick = (slug: string) => {
    navigate(`/collections/${slug}`);
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-pearl-off-white">
            Explore Categories
          </h1>
          <p className="text-lg text-pearl-off-white/70 max-w-2xl mx-auto">
            Browse our curated collections by style and fabric
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-pearl-blue/20 to-pearl-blue/5 border border-pearl-blue/30 p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:border-gold/50"
            >
              {/* Category Icon */}
              <div className="mb-6 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full bg-pearl-blue/20 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-110">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-24 h-24 object-contain"
                  />
                </div>
              </div>

              {/* Category Info */}
              <div className="space-y-2">
                <h3 className="text-2xl font-serif font-bold text-gold group-hover:text-gold/90 transition-colors">
                  {category.name}
                </h3>
                <p className="text-pearl-off-white/70 group-hover:text-pearl-off-white/90 transition-colors">
                  {category.description}
                </p>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/5 to-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
