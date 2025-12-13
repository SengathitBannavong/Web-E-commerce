import apiFetch from "./api";

/**
 * Fetches a list of products from the server.
 * @param {object} params - The query parameters.
 * @param {number} [params.page=1] - The page number to fetch.
 * @param {number} [params.limit=10] - The number of items per page.
 * @param {string} [params.search] - A search term to filter products by name.
 * @returns {Promise<object>} An object containing product data and pagination info.
 */
export const getProducts = (params = {}) => {
  const query = new URLSearchParams({
    page: params.page || 1,
    limit: params.limit || 10,
    ...params.search && { search: params.search },
  }).toString();

  return apiFetch(`/products?${query}`);
};

/**
 * Fetches a single product by its ID.
 * @param {string} productId The ID of the product to fetch.
 * @returns {Promise<object>} The product data.
 */
export const getProductById = (productId) => {
  if (!productId) {
    return Promise.reject(new Error("Product ID is required."));
  }
  return apiFetch(`/products/${productId}`);
};
