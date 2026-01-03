import { useEffect, useState } from 'react';
import apiHealthMonitor from '../utils/apiHealthCheck';
import './APIStatusIndicator.css';

export default function APIStatusIndicator() {
  const [status, setStatus] = useState({ isHealthy: true, showBanner: false });

  useEffect(() => {
    // Initial health check
    apiHealthMonitor.checkHealth();

    // Start monitoring
    apiHealthMonitor.startMonitoring();

    // Listen for status changes
    const handleStatusChange = (healthStatus) => {
      setStatus({
        isHealthy: healthStatus.isHealthy,
        showBanner: !healthStatus.isHealthy,
      });

      // Auto-hide success message after reconnection
      if (healthStatus.isHealthy && healthStatus.changed) {
        setTimeout(() => {
          setStatus(prev => ({ ...prev, showBanner: false }));
        }, 5000);
      }
    };

    apiHealthMonitor.addListener(handleStatusChange);

    // Cleanup
    return () => {
      apiHealthMonitor.removeListener(handleStatusChange);
      apiHealthMonitor.stopMonitoring();
    };
  }, []);

  if (!status.showBanner) return null;

  return (
    <div className={`api-status-banner ${status.isHealthy ? 'healthy' : 'unhealthy'}`}>
      <div className="container">
        {status.isHealthy ? (
          <div className="status-message">
            <span className="status-icon">✓</span>
            <span>Connected to server successfully</span>
          </div>
        ) : (
          <div className="status-message">
            <span className="status-icon">⚠</span>
            <span>Unable to connect to server. Retrying...</span>
          </div>
        )}
      </div>
    </div>
  );
}
