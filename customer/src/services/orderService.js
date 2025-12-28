import apiFetch from "./api";

/**
 * Get current user's orders
 * @param {string|number} userId
 * @param {number} page
 * @param {number} limit
 */
export const getMyOrders = async (userId, page = 1, limit = 5) => {
    return apiFetch(`/orders/${userId}?page=${page}&limit=${limit}`);
};

/**
 * Get order details by ID
 * @param {string|number} id 
 */
export const getOrderById = async (id) => {
    return apiFetch(`/orders/${id}`);
};

/**
 * Create a new order
 * @param {string|number} userId
 * @param {object} orderData
 */
export const createOrder = async (userId, orderData) => {
    return apiFetch(`/orders/${userId}`, {
        method: "POST",
        body: JSON.stringify(orderData),
    });
};
