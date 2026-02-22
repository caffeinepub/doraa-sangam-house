import { useSpaLocation } from '../hooks/useSpaLocation';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

const categories = [
  { id: 'shirts', label: 'Shirts', slug: 'shirts' },
  { id: 'kurta', label: 'Kurta', slug: 'kurta' },
  { id: 'bottoms', label: 'Bottoms', slug: 'bottoms' },
  { id: 'sarees', label: 'Sarees', slug: 'sarees' },
  { id: 'shop-all', label: 'Shop All', slug: 'shop-all' },
];

export default function CategoryNavigationBar() {
  const [location, navigate] = useSpaLocation();
  const { requireAuth } = useAuthRedirect();

  const handleCategoryClick = (slug: string) => {
    if (!requireAuth(navigate, location.pathname)) return;

    if (slug === 'shop-all') {
      navigate('/products');
    } else {
      navigate(`/style/${slug}`);
    }
  };

  return (
    <div className="w-full py-8 overflow-x-auto">
      <div className="container px-6 md:px-8">
        <div className="flex gap-6 justify-center items-center flex-nowrap md:flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.slug)}
              className="flex-shrink-0 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'transparent',
                border: '2px solid #C9A96E',
                color: '#E8C0C8',
                fontFamily: "'Great Vibes', cursive",
                fontSize: 'clamp(2.8rem, 4vw, 3.2rem)',
                fontWeight: 400,
                boxShadow: '0 0 0 rgba(201, 169, 110, 0)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 18px rgba(201, 169, 110, 0.45)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 0 rgba(201, 169, 110, 0)';
              }}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
