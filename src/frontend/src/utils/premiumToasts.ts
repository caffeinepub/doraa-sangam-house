import { toast } from 'sonner';

interface PremiumToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info' | 'duplicate';
  duration?: number;
}

export function showPremiumToast({ message, type = 'info', duration = 3000 }: PremiumToastOptions) {
  const baseStyle = {
    background: 'oklch(0.68 0.10 210 / 0.95)',
    border: '2px solid oklch(0.72 0.12 70)',
    color: 'oklch(0.68 0.10 210)',
    backdropFilter: 'blur(12px)',
    boxShadow: '0 0 20px oklch(0.72 0.12 70 / 0.4)',
    fontWeight: '500',
  };

  const toastOptions = {
    duration,
    className: 'premium-toast premium-toast-fade',
    style: baseStyle,
  };

  if (type === 'duplicate') {
    toast.info(message, toastOptions);
  } else if (type === 'error') {
    toast.error(message, {
      ...toastOptions,
      style: {
        ...baseStyle,
        background: 'rgba(0, 0, 0, 0.85)',
        border: '2px solid oklch(0.72 0.12 70)',
        color: 'oklch(0.96 0.005 60)',
      },
    });
  } else if (type === 'success') {
    toast.success(message, {
      ...toastOptions,
      style: {
        background: 'rgba(0, 0, 0, 0.85)',
        border: '2px solid oklch(0.72 0.12 70)',
        color: 'oklch(0.96 0.005 60)',
      },
    });
  } else {
    toast.info(message, toastOptions);
  }
}

export function showDuplicateFavoriteToast() {
  showPremiumToast({
    message: 'Product has been already added to favorites',
    type: 'duplicate',
  });
}

export function showDuplicateCartToast() {
  showPremiumToast({
    message: 'Product has been already added to cart',
    type: 'duplicate',
  });
}

export function showLockoutToast() {
  showPremiumToast({
    message: 'Too many attempts. Retry after 10 minutes',
    type: 'error',
  });
}

export function showProfileSaveSuccessToast() {
  showPremiumToast({
    message: 'Profile updated successfully!',
    type: 'success',
    duration: 3000,
  });
}

export function showProfileSaveErrorToast() {
  showPremiumToast({
    message: 'Failed to save. Try again.',
    type: 'error',
    duration: 3000,
  });
}
