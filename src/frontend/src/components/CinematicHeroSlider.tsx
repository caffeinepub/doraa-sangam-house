import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CinematicHeroSlide from './CinematicHeroSlide';
import ScrollHintArrow from './hero/ScrollHintArrow';
import GoldWaveWipeTransition from './hero/GoldWaveWipeTransition';
import useCinematicSlider from '@/hooks/useCinematicSlider';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

const slides = [
  {
    id: 1,
    title: 'Crafted for You, Delivered with Care.',
    subtitle: 'Where heritage meets modern lifestyle.',
  },
  {
    id: 2,
    title: 'Crafted for You, Delivered with Care.',
    subtitle: 'Where heritage meets modern lifestyle.',
  },
  {
    id: 3,
    title: 'Crafted for You, Delivered with Care.',
    subtitle: 'Where heritage meets modern lifestyle.',
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
    pauseAutoplay,
    resumeAutoplay,
  } = useCinematicSlider(slides.length, 5000);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleSlideChange = (newIndex: number) => {
    if (newIndex === activeIndex) return;
    setIsTransitioning(true);
    goToSlide(newIndex);
    setTimeout(() => {
      setIsTransitioning(false);
    }, prefersReducedMotion ? 300 : 800);
  };

  const handleNext = () => {
    setIsTransitioning(true);
    nextSlide();
    setTimeout(() => {
      setIsTransitioning(false);
    }, prefersReducedMotion ? 300 : 800);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    prevSlide();
    setTimeout(() => {
      setIsTransitioning(false);
    }, prefersReducedMotion ? 300 : 800);
  };

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden bg-black"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onTouchStart={pauseAutoplay}
      onTouchEnd={resumeAutoplay}
    >
      {/* Slides */}
      <div className="relative w-full h-screen">
        {slides.map((slide, index) => (
          <CinematicHeroSlide
            key={slide.id}
            slide={slide}
            isActive={index === activeIndex}
            slideIndex={index}
          />
        ))}
      </div>

      {/* Gold Wave Wipe Transition */}
      <GoldWaveWipeTransition isTransitioning={isTransitioning} />

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary hover:shadow-glow-pearl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-sm border border-primary/30 text-primary hover:bg-primary/20 hover:border-primary hover:shadow-glow-pearl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary ${
              index === activeIndex
                ? 'bg-primary shadow-glow-pearl scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Hint Arrow */}
      <ScrollHintArrow />
    </div>
  );
}
