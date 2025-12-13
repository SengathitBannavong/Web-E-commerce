// A simple fetch wrapper for making API calls

const API_BASE_URL = "http://localhost:8080"; // Default backend URL

/**
 * Fetches data from the API.
 * @param {string} endpoint The API endpoint to call (e.g., '/products').
 * @param {RequestInit} options The options for the fetch request.
 * @returns {Promise<any>} The JSON response from the API.
 */
async function apiFetch(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      // Try to parse error response from the server
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API call failed with status: ${response.status}`
      );
    }

    return response.json();
  } catch (error) {
    console.error(`API call to ${endpoint} failed:`, error);
    throw error;
  }
}

export default apiFetch;
