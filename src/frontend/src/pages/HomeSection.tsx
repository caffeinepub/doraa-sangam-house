import CinematicHeroSlider from '../components/CinematicHeroSlider';
import ShopByStyleBlock from '../components/storefront/ShopByStyleBlock';

export default function HomeSection() {
  return (
    <section id="home" className="relative min-h-screen">
      <ShopByStyleBlock />
      <CinematicHeroSlider />
    </section>
  );
}
