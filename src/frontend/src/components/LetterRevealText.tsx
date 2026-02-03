import { useEffect, useState } from 'react';
import usePrefersReducedMotion from '@/hooks/usePrefersReducedMotion';

interface LetterRevealTextProps {
  text: string;
  isActive: boolean;
  className?: string;
}

export default function LetterRevealText({
  text,
  isActive,
  className = '',
}: LetterRevealTextProps) {
  const [revealedCount, setRevealedCount] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (isActive) {
      if (prefersReducedMotion) {
        setRevealedCount(text.length);
      } else {
        setRevealedCount(0);
        const interval = setInterval(() => {
          setRevealedCount((prev) => {
            if (prev >= text.length) {
              clearInterval(interval);
              return prev;
            }
            return prev + 1;
          });
        }, 30);
        return () => clearInterval(interval);
      }
    } else {
      setRevealedCount(0);
    }
  }, [isActive, text.length, prefersReducedMotion]);

  return (
    <h1 className={className}>
      {text.split('').map((char, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-300 ${
            index < revealedCount
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2'
          }`}
          style={{
            transitionDelay: prefersReducedMotion ? '0ms' : `${index * 30}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  );
}
