import { Button } from '@/components/ui/button';
import ShopByStyleBlock from '../components/storefront/ShopByStyleBlock';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSpaLocation } from '../hooks/useSpaLocation';
import { useStorefrontAuth } from '../hooks/useStorefrontAuth';

export default function HomeSection() {
  const { identity } = useInternetIdentity();
  const [, navigate] = useSpaLocation();
  const { setFlashMessage, setReturnPath } = useStorefrontAuth();

  const handleShopCollection = () => {
    if (identity) {
      navigate('/collections/trending');
    } else {
      setFlashMessage('Please login to shop the collection', 'info');
      setReturnPath('/collections/trending');
      navigate('/login?tab=signin');
    }
  };

  const handleExploreCategories = () => {
    if (identity) {
      navigate('/categories');
    } else {
      setFlashMessage('Please login to explore categories', 'info');
      setReturnPath('/categories');
      navigate('/login?tab=signin');
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Explore by Style Heading */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-pearl-off-white">
            Explore by Style
          </h1>
          <p className="text-lg text-pearl-off-white/70 max-w-2xl mx-auto">
            Discover our curated collection of luxury sarees, each crafted with heritage artistry
          </p>
        </div>

        {/* Category Carousel */}
        <ShopByStyleBlock />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
          <Button
            onClick={handleShopCollection}
            className="min-w-[240px] min-h-[56px] bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:scale-105"
          >
            Shop the Sangam Collection
          </Button>
          <Button
            onClick={handleExploreCategories}
            className="min-w-[240px] min-h-[56px] bg-cyan-600 hover:bg-cyan-700 text-white font-semibold text-lg rounded-full transition-all duration-300 hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] hover:scale-105"
          >
            Explore Categories
          </Button>
        </div>
      </div>
    </section>
  );
}
