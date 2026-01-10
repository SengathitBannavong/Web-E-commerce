import apiFetch from "./api";

/**
 * Get current user's orders
 * @param {string|number} userId - Not used (kept for backwards compatibility)
 * @param {number} page
 * @param {number} limit
 */
export const getMyOrders = async (userId, page = 1, limit = 5) => {
    // Use /orders/all - userId comes from auth token
    return apiFetch(`/orders/all?page=${page}&limit=${limit}`);
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
/**
 * Cancel an order
 * @param {string|number} orderId 
 */
export const cancelOrder = async (orderId) => {
    return apiFetch(`/orders/cancel/${orderId}`, {
        method: "PUT"
    });
};
