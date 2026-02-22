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
    <div className="w-full py-10">
      {/* Horizontal Scrollable Container */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-8 px-4 min-w-max justify-center">
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => handleCategoryClick(category.slug)}
              className="group flex flex-col items-center gap-4 transition-all duration-300 hover:scale-105 hover:-translate-y-2 explore-style-badge"
            >
              {/* Circular Badge */}
              <div 
                className="w-36 h-36 rounded-full flex items-center justify-center overflow-hidden transition-all duration-300"
                style={{
                  backgroundColor: 'rgba(127, 179, 213, 0.2)',
                  border: '2px solid rgba(127, 179, 213, 0.4)',
                  boxShadow: '0 4px 12px rgba(127, 179, 213, 0.2)',
                }}
              >
                <img
                  src={category.icon}
                  alt={category.name}
                  className="w-24 h-24 object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Category Name */}
              <span 
                className="font-button font-bold text-lg uppercase tracking-wider transition-colors duration-300 whitespace-nowrap"
                style={{ color: '#D4AF37' }}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
