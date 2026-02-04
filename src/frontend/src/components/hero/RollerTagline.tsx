import { useEffect, useRef, useState } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface RollerTaglineProps {
  text: string;
  isActive: boolean;
  className?: string;
}

export default function RollerTagline({
  text,
  isActive,
  className = '',
}: RollerTaglineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const letters = text.split('');

  // Handle pointer events for both desktop and touch
  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsHovered(true);
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === 'mouse') {
      setIsHovered(false);
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // For touch devices, toggle the animation
    if (e.pointerType === 'touch' || e.pointerType === 'pen') {
      e.stopPropagation(); // Don't interfere with slider gestures
      setIsTapped(!isTapped);
      // Auto-reset after animation completes
      setTimeout(() => setIsTapped(false), 1200);
    }
  };

  const shouldAnimate = prefersReducedMotion ? false : (isHovered || isTapped);

  return (
    <div
      ref={containerRef}
      className={`roller-tagline-container inline-flex items-center justify-center whitespace-nowrap ${className}`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      style={{
        cursor: prefersReducedMotion ? 'default' : 'pointer',
        touchAction: 'manipulation',
      }}
    >
      {/* Underline/glow layer */}
      <div
        className={`roller-tagline-underline ${
          shouldAnimate ? 'roller-tagline-underline-active' : ''
        }`}
        aria-hidden="true"
      />

      {/* Letter spans */}
      <div className="relative inline-flex items-center justify-center">
        {letters.map((letter, index) => (
          <span
            key={`${letter}-${index}`}
            className={`roller-letter ${
              shouldAnimate ? 'roller-letter-active' : ''
            } ${prefersReducedMotion ? 'roller-letter-reduced' : ''}`}
            style={{
              animationDelay: shouldAnimate ? `${index * 0.04}s` : '0s',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        ))}

        {/* Shimmer highlight overlay */}
        {!prefersReducedMotion && shouldAnimate && (
          <div
            className="roller-shimmer-highlight"
            style={{
              animationDelay: '0.2s',
            }}
          />
        )}
      </div>
    </div>
  );
}
