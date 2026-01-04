/**
 * API Health Check Utility
 * Monitors API connectivity and automatically attempts reconnection
 */
import axios from 'axios';

// Get API base URL from environment variable with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000/api";
const HEALTH_CHECK_ENDPOINT = "/health";
const CHECK_INTERVAL = 30000; // 30 seconds

class APIHealthMonitor {
  constructor() {
    this.isHealthy = true;
    this.listeners = [];
    this.checkInterval = null;
  }

  /**
   * Start monitoring API health
   */
  startMonitoring() {
    this.checkHealth();
    this.checkInterval = setInterval(() => this.checkHealth(), CHECK_INTERVAL);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await axios.get(`${API_BASE_URL}${HEALTH_CHECK_ENDPOINT}`, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000,
      });

      if (response.status === 200) {
        this.setHealthStatus(true, response.data);
        return { healthy: true, data: response.data };
      } else {
        this.setHealthStatus(false, { error: 'API returned error status' });
        return { healthy: false, error: 'API returned error status' };
      }
    } catch (error) {
      console.error('API Health Check Failed:', error.message);
      this.setHealthStatus(false, { error: error.message });
      return { healthy: false, error: error.message };
    }
  }

  /**
   * Set health status and notify listeners
   */
  setHealthStatus(isHealthy, data = null) {
    const wasHealthy = this.isHealthy;
    this.isHealthy = isHealthy;

    // Notify listeners of status change
    if (wasHealthy !== isHealthy) {
      this.notifyListeners({ isHealthy, data, changed: true });
    }
  }

  /**
   * Add listener for health status changes
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners
   */
  notifyListeners(status) {
    this.listeners.forEach(callback => {
      try {
        callback(status);
      } catch (error) {
        console.error('Error in health check listener:', error);
      }
    });
  }

  /**
   * Get current health status
   */
  getHealthStatus() {
    return {
      isHealthy: this.isHealthy,
      timestamp: new Date().toISOString(),
    };
  }
}

// Create singleton instance
const apiHealthMonitor = new APIHealthMonitor();

export default apiHealthMonitor;
