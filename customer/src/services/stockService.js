import apiFetch from "./api";

/**
 * Get stock information for a specific product
 * @param {string|number} productId 
 * @returns {Promise<object>} Stock information including quantity available
 */
export const getStockByProductId = async (productId) => {
  if (!productId) {
    return Promise.reject(new Error("Product ID is required."));
  }
  return apiFetch(`/stocks/${productId}`);
};

/**
 * Check if a product is in stock
 * @param {string|number} productId 
 * @param {number} requestedQuantity - Quantity user wants to purchase
 * @returns {Promise<boolean>} True if stock is available for the requested quantity
 */
export const checkProductAvailability = async (productId, requestedQuantity = 1) => {
  try {
    const stock = await getStockByProductId(productId);
    return stock && stock.Quantity >= requestedQuantity;
  } catch (error) {
    console.error("Error checking stock availability:", error);
    return false;
  }
};
