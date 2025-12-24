import apiFetch from "./api";

/**
 * Lấy danh sách danh mục (Categories)
 * @param {object} params - Các tham số lọc
 * @param {number} [params.page=1] - Trang hiện tại
 * @param {number} [params.limit=100] - Số lượng item (Mặc định lấy nhiều để hiển thị menu)
 * @param {string} [params.search] - Tìm kiếm theo tên danh mục
 * @returns {Promise<object>} Object chứa { totalPage, total, data: [...] }
 */
export const getCategories = (params = {}) => {
  const queryParams = {
    page: params.page || 1,
    limit: params.limit || 100, // Mặc định lấy 100 để hiển thị đủ trên menu/home
  };

  if (params.search) {
    queryParams.search = params.search;
  }

  const query = new URLSearchParams(queryParams).toString();
  
  // Gọi GET /api/categories
  return apiFetch(`/categories?${query}`);
};

/**
 * Lấy chi tiết một danh mục theo ID
 * @param {string|number} id - ID của danh mục
 */
export const getCategoryById = (id) => {
  if (!id) {
    return Promise.reject(new Error("Category ID is required."));
  }
  
  // Gọi GET /api/categories/:id
  return apiFetch(`/categories/${id}`);
};