import apiFetch from "./api";
export { apiFetch };

/**
 * Create a Stripe checkout session
 * This will redirect the user to Stripe's hosted checkout page
 * @param {string} shippingAddress - Optional shipping address (uses user's default if not provided)
 */
export const createCheckoutSession = async (shippingAddress = null) => {
  const payload = {};
  if (shippingAddress) {
    payload.Shipping_Address = shippingAddress;
  }
  
  return apiFetch("/payment-gateway/create-checkout-session", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

/**
 * Get payment details for a specific order
 * @param {string|number} orderId 
 */
export const getPaymentByOrderId = async (orderId) => {
  return apiFetch(`/payments/order/${orderId}`);
};

/**
 * Create a payment record
 * @param {object} paymentData - Payment details
 */
export const createPayment = async (paymentData) => {
  return apiFetch("/payments", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });
};
