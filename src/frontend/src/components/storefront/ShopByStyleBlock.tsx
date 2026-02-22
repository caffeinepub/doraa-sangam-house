import { useSpaLocation } from '../../hooks/useSpaLocation';

const categories = [
  {
    slug: 'banarasi',
    name: 'Zari Royalty',
    icon: '/assets/generated/explore-style-icon-banarasi.dim_128x128.png',
  },
  {
    slug: 'organza',
    name: 'Sheer Elegance',
    icon: '/assets/generated/explore-style-icon-organza.dim_128x128.png',
  },
  {
    slug: 'georgette',
    name: 'Flowing Grace',
    icon: '/assets/generated/explore-style-icon-georgette.dim_128x128.png',
  },
  {
    slug: 'silk',
    name: 'Silk Symphony',
    icon: '/assets/generated/explore-style-icon-silk.dim_128x128.png',
  },
  {
    slug: 'kalamkari',
    name: 'Heritage Artistry',
    icon: '/assets/generated/explore-style-icon-kalamkari.dim_128x128.png',
  },
];

export default function ShopByStyleBlock() {
  const [, navigate] = useSpaLocation();

  const handleCategoryClick = (slug: string) => {
    navigate(`/collections/${slug}`);
  };

  return (
    <div className="w-full py-8">
      {/* Horizontal Scrollable Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-6 px-4 min-w-max justify-center">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="group flex flex-col items-center gap-3 transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              {/* Circular Badge */}
              <div className="w-32 h-32 rounded-full bg-pearl-blue/20 border-2 border-pearl-blue/40 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(212,175,55,0.6)] group-hover:border-gold/60 group-hover:bg-pearl-blue/30">
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Category Name */}
              <span className="text-gold font-semibold text-lg transition-colors duration-300 group-hover:text-gold/90 whitespace-nowrap">
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
