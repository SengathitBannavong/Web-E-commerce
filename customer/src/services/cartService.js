import apiFetch from "./api";

/**
 * Get current user's cart with all items
 * Fixed: Changed from /carts/items to /carts/details to match server route
 */
export const getMyCart = async () => {
  return apiFetch("/carts/details");
};

/**
 * Add item to cart
 * @param {string|number} productId
 * @param {number} quantity
 */
export const addToCart = async (productId, quantity = 1) => {
  return apiFetch(`/carts/items/${productId}`, {
    method: "POST",
    body: JSON.stringify({ quantity }),
  });
};

/**
 * Update cart item quantity
 * @param {string|number} productId
 * @param {number} quantity
 */
export const updateCartItem = async (productId, quantity) => {
  return apiFetch(`/carts/items/${productId}`, {
    method: "PUT",
    body: JSON.stringify({ quantity }),
  });
};

/**
 * Remove item from cart
 * @param {string|number} productId
 */
export const removeCartItem = async (productId) => {
  return apiFetch(`/carts/items/${productId}`, {
    method: "DELETE",
  });
};

/**
 * Clear all items from cart
 */
export const clearCart = async () => {
  return apiFetch("/carts/clear", {
    method: "DELETE",
  });
};
