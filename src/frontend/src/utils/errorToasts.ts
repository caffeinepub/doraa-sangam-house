import { toast } from 'sonner';

/**
 * Phase 7: Minimal basic error toast helper
 * Shows top-right toast with gold border, pearl off-white text (#F5F5F0), 4s fade
 */
export function showBasicErrorToast(message: string = 'Error: Please try again') {
  toast.error(message, {
    duration: 4000,
    className: 'basic-error-toast',
    style: {
      border: '1px solid oklch(0.72 0.12 70)',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      color: '#F5F5F0',
      backdropFilter: 'blur(12px)',
      borderRadius: '0.75rem',
      fontWeight: '600',
      fontSize: '1rem',
      padding: '1rem 1.25rem',
    },
  });
}
