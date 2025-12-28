import apiFetch from "./api";

export const getMyCart = async () => {
  return apiFetch("/carts/items");
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
