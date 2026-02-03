import { useEffect, useState } from 'react';
import PearlShimmerParticles from './hero/PearlShimmerParticles';
import ProductSilhouetteLayer from './hero/ProductSilhouetteLayer';
import GoldWaveLayer from './hero/GoldWaveLayer';
import LetterRevealText from './LetterRevealText';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
}

interface CinematicHeroSlideProps {
  slide: Slide;
  isActive: boolean;
  slideIndex: number;
}

export default function CinematicHeroSlide({
  slide,
  isActive,
  slideIndex,
}: CinematicHeroSlideProps) {
  const [layerOffset, setLayerOffset] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isActive && !prefersReducedMotion) {
      setLayerOffset(0);
      const timer = setTimeout(() => {
        setLayerOffset(1);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActive, prefersReducedMotion]);

  const parallaxStyle = prefersReducedMotion
    ? {}
    : {
        transform: `translateX(${layerOffset * 0}px)`,
        transition: 'transform 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
      };

  return (
    <div
      className={`absolute inset-0 w-full h-full transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-20' : 'opacity-0 z-10 pointer-events-none'
      }`}
    >
      {/* Background Layer - Pearl Shimmer Particles */}
      <div
        className="absolute inset-0 z-0"
        style={
          prefersReducedMotion
            ? {}
            : {
                transform: `translateX(${layerOffset * -20}px)`,
                transition: 'transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
              }
        }
      >
        <PearlShimmerParticles isActive={isActive} slideIndex={slideIndex} />
      </div>

      {/* Mid Layer - Product Silhouettes */}
      <div
        className="absolute inset-0 z-10"
        style={
          prefersReducedMotion
            ? {}
            : {
                transform: `translateX(${layerOffset * -10}px)`,
                transition: 'transform 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }
        }
      >
        <ProductSilhouetteLayer isActive={isActive} slideIndex={slideIndex} />
      </div>

      {/* Front Layer - Gold Wave Sweep */}
      <div
        className="absolute inset-0 z-10"
        style={
          prefersReducedMotion
            ? {}
            : {
                transform: `translateX(${layerOffset * 5}px)`,
                transition: 'transform 1.1s cubic-bezier(0.4, 0, 0.2, 1)',
              }
        }
      >
        <GoldWaveLayer isActive={isActive} slideIndex={slideIndex} />
      </div>

      {/* Content Layer */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Headline with letter reveal */}
          <LetterRevealText
            text={slide.title}
            isActive={isActive}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-foreground"
          />

          {/* Subtitle */}
          <p
            className={`text-xl md:text-2xl lg:text-3xl text-primary font-light tracking-wide transition-all duration-700 delay-500 ${
              isActive
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {slide.subtitle}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center pt-8 transition-all duration-700 delay-700 ${
              isActive
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            <a
              href="#collections"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-glow-pearl hover:shadow-glow-gold hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              Shop the Sangam Collection
            </a>
            <a
              href="#product"
              className="inline-flex items-center justify-center rounded-lg border-2 border-primary px-8 py-4 text-base font-medium text-primary hover:bg-primary/10 hover:shadow-glow-pearl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
            >
              Explore Categories
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
