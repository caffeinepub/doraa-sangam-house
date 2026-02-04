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

  // Split text into words and track character positions
  const words = text.split(' ');
  let charIndex = 0;

  return (
    <h1 className={className}>
      {words.map((word, wordIndex) => {
        const wordStartIndex = charIndex;
        const wordChars = word.split('');
        charIndex += word.length + 1; // +1 for space

        return (
          <span
            key={wordIndex}
            className={word === 'Elegance' ? 'inline-block whitespace-nowrap' : 'inline-block'}
          >
            {wordChars.map((char, charIndexInWord) => {
              const globalCharIndex = wordStartIndex + charIndexInWord;
              return (
                <span
                  key={globalCharIndex}
                  className={`inline-block transition-all duration-300 ${
                    globalCharIndex < revealedCount
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-2'
                  }`}
                  style={{
                    transitionDelay: prefersReducedMotion ? '0ms' : `${globalCharIndex * 30}ms`,
                  }}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span
                className={`inline-block transition-all duration-300 ${
                  wordStartIndex + word.length < revealedCount
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-2'
                }`}
                style={{
                  transitionDelay: prefersReducedMotion
                    ? '0ms'
                    : `${(wordStartIndex + word.length) * 30}ms`,
                }}
              >
                {'\u00A0'}
              </span>
            )}
          </span>
        );
      })}
    </h1>
  );
}
