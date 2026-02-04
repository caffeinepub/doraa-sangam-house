import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import usePrefersReducedMotion from '../../hooks/usePrefersReducedMotion';

export function useAdminSaveFeedback() {
  const [savedItemId, setSavedItemId] = useState<string | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  const triggerSaveFeedback = useCallback(
    (itemId: string, message: string = 'Product saved successfully') => {
      setSavedItemId(itemId);
      toast.success(message);

      setTimeout(() => {
        setSavedItemId(null);
      }, prefersReducedMotion ? 300 : 1500);
    },
    [prefersReducedMotion]
  );

  const getSaveAnimationClass = useCallback(
    (itemId: string) => {
      if (savedItemId !== itemId) return '';
      return prefersReducedMotion ? 'admin-save-fade-reduced' : 'admin-save-fade-wave';
    },
    [savedItemId, prefersReducedMotion]
  );

  return {
    triggerSaveFeedback,
    getSaveAnimationClass,
    savedItemId,
  };
}
