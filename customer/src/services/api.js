import axios from 'axios';

// Get API base URL from environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";

const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 second

/**
 * Create axios instance with global configuration
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Request interceptor to add auth token
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const errorMessage = error.response.data?.error || error.response.data?.message || `API call failed with status: ${error.response.status}`;
      console.error("API call error details:", error.response.data);
      error.message = errorMessage;
    } else if (error.request) {
      // Request made but no response
      console.error("No response received from API:", error.request);
      error.message = "Network error: No response from server";
    } else {
      // Error setting up request
      console.error("API request setup error:", error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Makes API calls with retry mechanism using axios
 * @param {string} endpoint The API endpoint to call
 * @param {object} options The options for the axios request (method, data, params, etc.)
 * @param {number} retryCount Current retry attempt
 * @returns {Promise<any>} The response data from the API
 */
async function apiFetch(endpoint, options = {}, retryCount = 0) {
  try {
    const config = {
      url: endpoint,
      method: options.method || 'GET',
      ...options,
    };

    // Handle body -> data conversion for axios
    if (options.body) {
      config.data = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      delete config.body;
    }

    const response = await apiClient(config);

    // Return null for 204 No Content
    if (response.status === 204) {
      return null;
    }

    return response.data;
  } catch (error) {
    // Retry logic for network errors
    if (retryCount < MAX_RETRIES && (!error.response || error.code === 'ECONNABORTED')) {
      console.log(`Retrying API call to ${endpoint} (attempt ${retryCount + 1}/${MAX_RETRIES})...`);
      await sleep(RETRY_DELAY * (retryCount + 1));
      return apiFetch(endpoint, options, retryCount + 1);
    }
    
    console.error(`API call to ${endpoint} failed:`, error.message);
    throw error;
  }
}

// Export both the configured axios instance and the apiFetch function
export { API_BASE_URL, apiClient };
export default apiFetch;
