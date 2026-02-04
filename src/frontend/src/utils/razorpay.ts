// Razorpay test mode helper for checkout integration
// Loads Razorpay Checkout script and initiates payment UI

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: () => void) => void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

let scriptLoaded = false;
let scriptLoading = false;
const scriptLoadPromises: Array<(value: boolean) => void> = [];

/**
 * Load Razorpay Checkout script once
 */
function loadRazorpayScript(): Promise<boolean> {
  if (scriptLoaded) {
    return Promise.resolve(true);
  }

  if (scriptLoading) {
    return new Promise((resolve) => {
      scriptLoadPromises.push(resolve);
    });
  }

  scriptLoading = true;

  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      scriptLoaded = true;
      scriptLoading = false;
      resolve(true);
      scriptLoadPromises.forEach((cb) => cb(true));
      scriptLoadPromises.length = 0;
    };
    script.onerror = () => {
      scriptLoading = false;
      resolve(false);
      scriptLoadPromises.forEach((cb) => cb(false));
      scriptLoadPromises.length = 0;
    };
    document.body.appendChild(script);
  });
}

export interface RazorpayPaymentParams {
  amount: number; // in rupees
  name: string;
  email: string;
  phone: string;
  description?: string;
}

export interface RazorpayPaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

/**
 * Initiate Razorpay test mode payment
 * @param params Payment parameters
 * @returns Promise with payment result
 */
export async function initiateRazorpayPayment(
  params: RazorpayPaymentParams
): Promise<RazorpayPaymentResult> {
  // Load script if not already loaded
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    return {
      success: false,
      error: 'Failed to load Razorpay. Please check your internet connection.',
    };
  }

  return new Promise((resolve) => {
    const options: RazorpayOptions = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // Test mode key (public, safe to expose)
      amount: Math.round(params.amount * 100), // Convert to paise
      currency: 'INR',
      name: 'DoRaa Sangam House',
      description: params.description || 'Luxury Saree Purchase',
      prefill: {
        name: params.name,
        email: params.email,
        contact: params.phone,
      },
      theme: {
        color: '#D4AF37', // Gold accent
      },
      handler: (response: RazorpaySuccessResponse) => {
        resolve({
          success: true,
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
        });
      },
      modal: {
        ondismiss: () => {
          resolve({
            success: false,
            error: 'Payment cancelled by user',
          });
        },
      },
    };

    const razorpay = new window.Razorpay!(options);
    razorpay.open();
  });
}
