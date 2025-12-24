import apiFetch from "./api";

/**
 * Lấy danh sách sản phẩm
 * @param {object} params
 * @param {number} [params.page=1]
 * @param {number} [params.limit=10]
 * @param {string} [params.search]
 * @param {number|string} [params.category] 
 */
export const getProducts = (params = {}) => {
  // Tạo object chứa các tham số query
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 10,
  };

  // Nếu có search thì thêm vào
  if (params.search) {
    queryParams.search = params.search;
  }

  //  Nếu có category thì thêm vào query
  if (params.category) {
    queryParams.category = params.category;
  }

  // Chuyển object thành chuỗi query 
  const query = new URLSearchParams(queryParams).toString();

  return apiFetch(`/products?${query}`);
};

/**
 * Lấy chi tiết sản phẩm
 */
export const getProductById = (productId) => {
  if (!productId) {
    return Promise.reject(new Error("Product ID is required."));
  }
  return apiFetch(`/products/${productId}`);
};