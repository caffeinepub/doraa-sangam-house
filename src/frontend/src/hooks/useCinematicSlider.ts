import { useState, useEffect, useCallback, useRef } from 'react';

export default function useCinematicSlider(
  slideCount: number,
  autoplayDelay: number = 5000
) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + slideCount) % slideCount);
  }, [slideCount]);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slideCount);
  }, [slideCount]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slideCount) % slideCount);
  }, [slideCount]);

  const pauseAutoplay = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeAutoplay = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Autoplay
  useEffect(() => {
    if (isPaused) {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
      return;
    }

    autoplayTimerRef.current = setTimeout(() => {
      nextSlide();
    }, autoplayDelay);

    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, [activeIndex, isPaused, autoplayDelay, nextSlide]);

  // Swipe/drag gesture handling
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;

    const deltaX = e.clientX - pointerStartRef.current.x;
    const deltaY = e.clientY - pointerStartRef.current.y;

    // Only consider it a drag if horizontal movement is significant
    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDraggingRef.current = true;
      pauseAutoplay();
    }
  }, [pauseAutoplay]);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!pointerStartRef.current || !isDraggingRef.current) {
      pointerStartRef.current = null;
      isDraggingRef.current = false;
      return;
    }

    const deltaX = e.clientX - pointerStartRef.current.x;
    const threshold = 50;

    if (deltaX > threshold) {
      prevSlide();
    } else if (deltaX < -threshold) {
      nextSlide();
    }

    pointerStartRef.current = null;
    isDraggingRef.current = false;
    resumeAutoplay();
  }, [nextSlide, prevSlide, resumeAutoplay]);

  return {
    activeIndex,
    goToSlide,
    nextSlide,
    prevSlide,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    pauseAutoplay,
    resumeAutoplay,
  };
}
