import { Card } from './UI';
import './SensorReadings.css';

const SensorReadings = ({ data }) => {
  // Format value with fixed decimal places
  const formatValue = (value, decimals = 1) => {
    if (value === null || value === undefined) return '--';
    return typeof value === 'number' ? value.toFixed(decimals) : value;
  };

  // Check if we have any data
  const hasData = data && Object.keys(data).length > 0;

  return (
    <Card title="Current Readings" className="sensor-readings-card">
      {!hasData ? (
        <div className="no-data-message">
          Waiting for sensor data...
        </div>
      ) : (
        <div className="readings-grid">
          <div className="reading-item">
            <div className="reading-icon temperature">🌡️</div>
            <div className="reading-details">
              <div className="reading-label">Temperature</div>
              <div className="reading-value">{formatValue(data.temperature)}°C</div>
            </div>
          </div>

          <div className="reading-item">
            <div className="reading-icon humidity">💧</div>
            <div className="reading-details">
              <div className="reading-label">Humidity</div>
              <div className="reading-value">{formatValue(data.humidity)}%</div>
            </div>
          </div>

          <div className="reading-item">
            <div className="reading-icon pressure">🔄</div>
            <div className="reading-details">
              <div className="reading-label">Pressure</div>
              <div className="reading-value">{formatValue(data.pressure)} hPa</div>
            </div>
          </div>

          <div className="reading-item">
            <div className="reading-icon light">☀️</div>
            <div className="reading-details">
              <div className="reading-label">Light</div>
              <div className="reading-value">{formatValue(data.light)} lux</div>
            </div>
          </div>
        </div>
      )}

      {hasData && data.timestamp && (
        <div className="reading-timestamp">
          Last updated: {new Date(data.timestamp).toLocaleTimeString()}
        </div>
      )}
    </Card>
  );
};

export default SensorReadings; 