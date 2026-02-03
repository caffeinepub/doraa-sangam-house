import { useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  staggerDelay?: number;
}

export function useScrollReveal(options: UseScrollRevealOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -100px 0px',
    staggerDelay = 100,
  } = options;

  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // If reduced motion is preferred, reveal immediately
    if (prefersReducedMotion) {
      setIsRevealed(true);
      element.classList.add('scroll-reveal-visible');
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, prefersReducedMotion]);

  return { elementRef, isRevealed };
}

export function useStaggeredScrollReveal(index: number, options: UseScrollRevealOptions = {}) {
  const { staggerDelay = 100 } = options;
  const { elementRef, isRevealed } = useScrollReveal(options);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Calculate stagger delay based on index
  const delay = prefersReducedMotion ? 0 : index * staggerDelay;

  return { elementRef, isRevealed, delay };
}
