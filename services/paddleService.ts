// Type definition for the global Paddle object
declare global {
  interface Window {
    Paddle: any;
  }
}

const PADDLE_VENDOR_ID = Number(process.env.NEXT_PUBLIC_PADDLE_VENDOR_ID) || 12345; // Sandbox ID
const IS_SANDBOX = true;

/**
 * Loads the Paddle.js script dynamically if not already present.
 */
export const initializePaddle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Paddle) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.paddle.com/paddle/paddle.js';
    script.async = true;
    
    script.onload = () => {
      if (IS_SANDBOX) {
        window.Paddle.Environment.set('sandbox');
      }
      window.Paddle.Setup({ vendor: PADDLE_VENDOR_ID });
      console.log('Paddle initialized');
      resolve();
    };

    script.onerror = () => {
      console.error('Failed to load Paddle script');
      reject(new Error('Paddle script load failed'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Opens the Paddle checkout overlay.
 * @param priceId The Paddle Product/Plan ID (e.g. 12345 for Monthly)
 * @param userEmail The user's email to pre-fill
 * @param userId The internal user ID to pass through webhook
 */
export const openPaddleCheckout = async (priceId: number, userEmail?: string, userId?: string) => {
  try {
    await initializePaddle();

    window.Paddle.Checkout.open({
      product: priceId,
      email: userEmail,
      passthrough: userId,
      successCallback: (data: any) => {
        console.log('Payment Success:', data);
        alert('Payment Successful! Your subscription is active.');
        // In a real app, we would poll the backend for the webhook update
        // or optimistically update the UI state.
        window.dispatchEvent(new CustomEvent('tier-change'));
      },
      closeCallback: () => {
        console.log('Checkout closed');
      }
    });
  } catch (error) {
    console.error('Error opening checkout:', error);
    alert("Could not load payment system. Please check your connection.");
  }
};