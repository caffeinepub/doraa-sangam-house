import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import LetterRevealText from './LetterRevealText';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion';

interface CinematicHeroSlideProps {
  slide: {
    id: number;
    title: string;
    subtitle: string;
  };
  isActive: boolean;
  slideIndex: number;
}

export default function CinematicHeroSlide({ slide, isActive, slideIndex }: CinematicHeroSlideProps) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isActive && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isActive, hasAnimated]);

  const shouldAnimate = isActive && hasAnimated;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
        isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
      }`}
    >
      <div className="container px-6 md:px-8 text-center relative z-20">
        <div
          className="mb-6"
          style={{
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s',
            color: '#C9A96E',
            textShadow: '0 0 20px rgba(201, 169, 110, 0.5)',
          }}
        >
          <LetterRevealText
            text={slide.title}
            isActive={shouldAnimate}
            className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black tracking-wider"
          />
        </div>

        <div
          className="mb-12 max-w-2xl mx-auto"
          style={{
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.4s',
            color: '#5C4B51',
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            lineHeight: '2.0',
          }}
        >
          <p className="font-lora">{slide.subtitle}</p>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          style={{
            opacity: shouldAnimate ? 1 : 0,
            transform: shouldAnimate ? 'translateY(0)' : 'translateY(20px)',
            transition: prefersReducedMotion ? 'none' : 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s',
          }}
        >
          <Button
            size="lg"
            className="button-luxury px-8 py-6 text-base font-button font-bold"
          >
            Explore Collection
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-base font-button font-bold"
            style={{
              borderColor: '#C9A96E',
              color: '#C9A96E',
              backgroundColor: 'transparent',
            }}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
}
