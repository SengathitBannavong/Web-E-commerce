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
 * Create a COD (Cash on Delivery) checkout
 * This will create an order with pending payment status
 * @param {string} shippingAddress - Shipping address for the order
 */
export const createCODCheckout = async (shippingAddress) => {
  return apiFetch("/payment-gateway/cod-checkout", {
    method: "POST",
    body: JSON.stringify({
      paymentMethod: 'cod',
      Shipping_Address: shippingAddress
    }),
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
