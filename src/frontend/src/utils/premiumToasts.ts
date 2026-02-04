import { toast } from 'sonner';

interface PremiumToastOptions {
  message: string;
  type?: 'success' | 'error' | 'info' | 'duplicate';
}

export function showPremiumToast({ message, type = 'info' }: PremiumToastOptions) {
  const toastOptions = {
    duration: 3000,
    className: 'premium-toast',
    style: {
      background: 'oklch(0.68 0.10 210 / 0.95)',
      border: '1px solid oklch(0.72 0.12 70)',
      color: 'oklch(0.96 0.005 60)',
      backdropFilter: 'blur(12px)',
      boxShadow: '0 0 20px oklch(0.72 0.12 70 / 0.4)',
    },
  };

  if (type === 'duplicate') {
    toast.info(message, toastOptions);
  } else if (type === 'error') {
    toast.error(message, {
      ...toastOptions,
      style: {
        ...toastOptions.style,
        background: 'oklch(0.60 0.20 25 / 0.95)',
        border: '1px solid oklch(0.72 0.12 70)',
      },
    });
  } else if (type === 'success') {
    toast.success(message, toastOptions);
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
