import { ChevronDown } from 'lucide-react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

export default function ScrollHintArrow() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <a
      href="#collections"
      className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 text-primary hover:text-accent transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded-lg p-2"
      aria-label="Scroll to collections"
    >
      <span className="text-sm font-light tracking-wide">Scroll</span>
      <ChevronDown
        className={`w-6 h-6 ${prefersReducedMotion ? '' : 'animate-pearl-bounce'}`}
      />
    </a>
  );
}
