import { useState, useEffect } from 'react';
import { Card, DataValue } from './UI';
import './SensorData.css';

// Default sensor values
const DEFAULT_SENSOR_VALUES = {
  temperature: null,
  humidity: null,
  pressure: null,
  light: null,
};

/**
 * SensorData component for displaying sensor readings
 */
const SensorData = ({ data }) => {
  const [sensorValues, setSensorValues] = useState(DEFAULT_SENSOR_VALUES);
  const [prevValues, setPrevValues] = useState(DEFAULT_SENSOR_VALUES);

  // Update sensor values when new data is received
  useEffect(() => {
    if (data) {
      setPrevValues(sensorValues);
      setSensorValues(data);
    }
  }, [data]);

  // Determine trend for a value
  const determineTrend = (current, previous) => {
    if (current === null || previous === null) return null;
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'stable';
  };

  // Format sensor value with fixed decimal places
  const formatValue = (value) => {
    return value !== null ? value.toFixed(1) : '--';
  };

  return (
    <Card title="Sensor Readings" className="sensor-data-card">
      <div className="sensor-grid">
        <DataValue 
          label="Temperature" 
          value={formatValue(sensorValues.temperature)} 
          unit="°C"
          trend={determineTrend(sensorValues.temperature, prevValues.temperature)}
        />
        
        <DataValue 
          label="Humidity" 
          value={formatValue(sensorValues.humidity)} 
          unit="%"
          trend={determineTrend(sensorValues.humidity, prevValues.humidity)}
        />
        
        <DataValue 
          label="Pressure" 
          value={formatValue(sensorValues.pressure)} 
          unit="hPa"
          trend={determineTrend(sensorValues.pressure, prevValues.pressure)}
        />
        
        <DataValue 
          label="Light" 
          value={formatValue(sensorValues.light)} 
          unit="lux"
          trend={determineTrend(sensorValues.light, prevValues.light)}
        />
      </div>
      
      <div className="timestamp">
        {sensorValues.timestamp ? (
          <span>Last updated: {new Date(sensorValues.timestamp).toLocaleString()}</span>
        ) : (
          <span>Waiting for data...</span>
        )}
      </div>
    </Card>
  );
};

export default SensorData; 