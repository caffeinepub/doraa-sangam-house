import { useCallback } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

export function useGoldRipple() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const createRipple = useCallback(
    (event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
      const button = event.currentTarget;
      const rect = button.getBoundingClientRect();

      // Get click/touch position
      let x: number, y: number;
      if ('touches' in event) {
        x = event.touches[0].clientX - rect.left;
        y = event.touches[0].clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }

      // Create ripple element
      const ripple = document.createElement('span');
      ripple.className = 'gold-ripple-effect';
      ripple.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: oklch(var(--accent) / 0.4);
        transform: translate(-50%, -50%);
        pointer-events: none;
      `;

      button.appendChild(ripple);

      // Animate ripple
      const size = Math.max(rect.width, rect.height) * 2;
      const duration = prefersReducedMotion ? 300 : 600;

      const animation = ripple.animate(
        [
          { width: '0px', height: '0px', opacity: 1 },
          { width: `${size}px`, height: `${size}px`, opacity: 0 },
        ],
        {
          duration,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }
      );

      animation.onfinish = () => {
        ripple.remove();
      };
    },
    [prefersReducedMotion]
  );

  return { createRipple };
}
