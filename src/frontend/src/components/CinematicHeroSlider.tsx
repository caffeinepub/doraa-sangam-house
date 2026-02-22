import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CinematicHeroSlide from './CinematicHeroSlide';
import GoldWaveWipeTransition from './hero/GoldWaveWipeTransition';
import ScrollHintArrow from './hero/ScrollHintArrow';
import useCinematicSlider from '../hooks/useCinematicSlider';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

const slides = [
  {
    id: 1,
    title: 'Timeless Elegance',
    subtitle: 'Discover the Art of Banarasi Silk',
  },
  {
    id: 2,
    title: 'Heritage Redefined',
    subtitle: 'Curated for the Modern Woman',
  },
  {
    id: 3,
    title: 'Luxury Unveiled',
    subtitle: 'Where Tradition Meets Sophistication',
  },
];

export default function CinematicHeroSlider() {
  const {
    activeIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  } = useCinematicSlider(slides.length);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleSlideChange = useCallback(
    (direction: 'next' | 'prev') => {
      if (!prefersReducedMotion) {
        setIsTransitioning(true);
        setTimeout(() => {
          if (direction === 'next') {
            nextSlide();
          } else {
            prevSlide();
          }
          setTimeout(() => setIsTransitioning(false), 100);
        }, 400);
      } else {
        if (direction === 'next') {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    },
    [nextSlide, prevSlide, prefersReducedMotion]
  );

  return (
    <section
      id="home"
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F8F5F0 0%, #F5F0E6 100%)',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Faint gold zari pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.08] z-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 40px,
              rgba(201, 169, 110, 0.15) 40px,
              rgba(201, 169, 110, 0.15) 41px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(201, 169, 110, 0.15) 40px,
              rgba(201, 169, 110, 0.15) 41px
            )
          `,
        }}
      />

      {/* Gold wave wipe transition */}
      <GoldWaveWipeTransition isTransitioning={isTransitioning} />

      {/* Slides */}
      <div className="relative h-screen">
        {slides.map((slide, index) => (
          <CinematicHeroSlide
            key={slide.id}
            slide={slide}
            isActive={index === activeIndex}
            slideIndex={index}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
        style={{ 
          backgroundColor: 'rgba(201, 169, 110, 0.2)',
          color: '#C9A96E',
          backdropFilter: 'blur(8px)'
        }}
        onClick={() => handleSlideChange('prev')}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-30 h-14 w-14 rounded-full transition-all duration-300 hover:scale-110"
        style={{ 
          backgroundColor: 'rgba(201, 169, 110, 0.2)',
          color: '#C9A96E',
          backdropFilter: 'blur(8px)'
        }}
        onClick={() => handleSlideChange('next')}
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      {/* Dot indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="group relative h-3 w-3 rounded-full transition-all duration-300"
            style={{
              backgroundColor: index === activeIndex ? '#C9A96E' : 'rgba(201, 169, 110, 0.3)',
              boxShadow: index === activeIndex ? '0 0 12px rgba(201, 169, 110, 0.6)' : 'none',
            }}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index === activeIndex && (
              <span 
                className="absolute inset-0 rounded-full animate-pulse-glow"
                style={{ backgroundColor: '#C9A96E' }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Scroll hint */}
      <ScrollHintArrow />
    </section>
  );
}
