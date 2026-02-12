import { useSpaLocation } from '../../hooks/useSpaLocation';

interface StyleCategory {
  id: string;
  label: string;
  slug: string;
  iconPath: string;
}

const STYLE_CATEGORIES: StyleCategory[] = [
  {
    id: 'banarasi',
    label: 'Zari Royalty',
    slug: 'banarasi',
    iconPath: '/assets/generated/explore-style-icon-banarasi.dim_128x128.png',
  },
  {
    id: 'organza',
    label: 'Sheer Elegance',
    slug: 'organza',
    iconPath: '/assets/generated/explore-style-icon-organza.dim_128x128.png',
  },
  {
    id: 'georgette',
    label: 'Flowing Grace',
    slug: 'georgette',
    iconPath: '/assets/generated/explore-style-icon-georgette.dim_128x128.png',
  },
  {
    id: 'silk',
    label: 'Silk Symphony',
    slug: 'silk',
    iconPath: '/assets/generated/explore-style-icon-silk.dim_128x128.png',
  },
  {
    id: 'kalamkari',
    label: 'Heritage Artistry',
    slug: 'kalamkari',
    iconPath: '/assets/generated/explore-style-icon-kalamkari.dim_128x128.png',
  },
];

export default function ShopByStyleBlock() {
  const [, navigate] = useSpaLocation();

  const handleCategoryClick = (slug: string) => {
    navigate(`/collections/${slug}`);
  };

  return (
    <div className="w-full py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gold mb-8">
          Explore by Style
        </h2>
        
        {/* Horizontal scrollable carousel */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 md:gap-6 pb-4 min-w-max justify-center px-4">
            {STYLE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.slug)}
                className="explore-style-badge flex items-center gap-3 px-6 py-3 rounded-[25px] bg-pearl-blue border-2 border-transparent transition-all duration-300 hover:border-gold hover:shadow-gold-glow hover:scale-105 focus-visible:border-gold focus-visible:shadow-gold-glow focus-visible:scale-105 focus-visible:outline-none"
                aria-label={`Explore ${category.label} collection`}
              >
                {/* Circular icon */}
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-black/20">
                  <img
                    src={category.iconPath}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Label text */}
                <span className="text-gold font-medium text-base md:text-lg whitespace-nowrap">
                  {category.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
