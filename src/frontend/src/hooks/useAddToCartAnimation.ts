import { useCallback } from 'react';
import usePrefersReducedMotion from './usePrefersReducedMotion';

interface AnimationOptions {
  sourceElement: HTMLElement;
  onComplete?: () => void;
}

export function useAddToCartAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const animate = useCallback(
    ({ sourceElement, onComplete }: AnimationOptions) => {
      // Skip animation if reduced motion is preferred
      if (prefersReducedMotion) {
        onComplete?.();
        return;
      }

      // Find cart button in header
      const cartButton = document.querySelector('[data-cart-button]');
      if (!cartButton) {
        onComplete?.();
        return;
      }

      // Get positions
      const sourceRect = sourceElement.getBoundingClientRect();
      const targetRect = cartButton.getBoundingClientRect();

      // Create flying saree element with cloth-like appearance
      const flyingElement = document.createElement('div');
      flyingElement.className = 'fly-to-cart-saree';
      flyingElement.style.cssText = `
        position: fixed;
        left: ${sourceRect.left + sourceRect.width / 2}px;
        top: ${sourceRect.top + sourceRect.height / 2}px;
        width: 60px;
        height: 80px;
        background: linear-gradient(135deg, oklch(var(--primary)) 0%, oklch(var(--accent)) 100%);
        border-radius: 8px;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 0 30px oklch(var(--primary) / 0.6), 0 0 60px oklch(var(--accent) / 0.4);
        transform: translate(-50%, -50%) rotate(0deg);
        opacity: 1;
      `;

      document.body.appendChild(flyingElement);

      // Calculate trajectory
      const deltaX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
      const deltaY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

      // Animate with cloth-like flow
      const animation = flyingElement.animate(
        [
          {
            transform: 'translate(-50%, -50%) rotate(0deg) scale(1)',
            opacity: 1,
          },
          {
            transform: `translate(calc(-50% + ${deltaX * 0.5}px), calc(-50% + ${deltaY * 0.3}px)) rotate(180deg) scale(0.8)`,
            opacity: 0.9,
            offset: 0.5,
          },
          {
            transform: `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) rotate(360deg) scale(0.2)`,
            opacity: 0,
          },
        ],
        {
          duration: 800,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        }
      );

      animation.onfinish = () => {
        flyingElement.remove();
        onComplete?.();
      };
    },
    [prefersReducedMotion]
  );

  return { animate };
}
