import { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import './SensorSettings.css';

// Default sensor ranges
const DEFAULT_SENSOR_RANGES = {
  temperature: { min: 20, max: 30 },
  humidity: { min: 30, max: 70 },
  pressure: { min: 990, max: 1010 },
  light: { min: 200, max: 1000 }
};

/**
 * SensorSettings component for customizing sensor simulation parameters
 */
const SensorSettings = ({ onSaveSettings, defaultRanges = DEFAULT_SENSOR_RANGES }) => {
  const [ranges, setRanges] = useState(defaultRanges);
  const [advanced, setAdvanced] = useState(false);
  const [updateFrequency, setUpdateFrequency] = useState(3);
  const [noiseLevel, setNoiseLevel] = useState(1);

  // Handle input change for sensor ranges
  const handleRangeChange = (sensor, type, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setRanges(prev => ({
      ...prev,
      [sensor]: {
        ...prev[sensor],
        [type]: numValue
      }
    }));
  };

  // Handle save button click
  const handleSave = () => {
    // Validate ranges (min should be less than max)
    const validatedRanges = {};
    let hasErrors = false;

    Object.entries(ranges).forEach(([sensor, { min, max }]) => {
      if (min >= max) {
        hasErrors = true;
        alert(`Error: Min value must be less than max value for ${sensor}`);
        return;
      }
      validatedRanges[sensor] = { min, max };
    });

    if (hasErrors) return;

    // Save settings
    onSaveSettings({
      ranges: validatedRanges,
      updateFrequency,
      noiseLevel,
    });
  };

  const renderRangeInputs = (sensor, label) => (
    <div className="sensor-range" key={sensor}>
      <div className="sensor-label">{label}</div>
      <div className="range-inputs">
        <div className="range-input-group">
          <label>Min</label>
          <input
            type="number"
            value={ranges[sensor].min}
            onChange={(e) => handleRangeChange(sensor, 'min', e.target.value)}
            step="0.1"
          />
        </div>
        <div className="range-input-group">
          <label>Max</label>
          <input
            type="number"
            value={ranges[sensor].max}
            onChange={(e) => handleRangeChange(sensor, 'max', e.target.value)}
            step="0.1"
          />
        </div>
      </div>
    </div>
  );

  return (
    <Card 
      title="Sensor Settings" 
      className="sensor-settings"
      collapsible
      defaultCollapsed
    >
      <div className="settings-form">
        <h4>Sensor Ranges</h4>
        <div className="ranges-container">
          {renderRangeInputs('temperature', 'Temperature (°C)')}
          {renderRangeInputs('humidity', 'Humidity (%)')}
          {renderRangeInputs('pressure', 'Pressure (hPa)')}
          {renderRangeInputs('light', 'Light (lux)')}
        </div>

        <div className="advanced-settings-toggle">
          <label className="toggle-label">
            <input 
              type="checkbox" 
              checked={advanced} 
              onChange={() => setAdvanced(!advanced)}
            />
            Advanced Settings
          </label>
        </div>

        {advanced && (
          <div className="advanced-settings">
            <div className="setting-group">
              <label>Update Frequency (seconds)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={updateFrequency}
                onChange={(e) => setUpdateFrequency(parseInt(e.target.value))}
              />
              <span className="setting-value">{updateFrequency}s</span>
            </div>

            <div className="setting-group">
              <label>Noise Level</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={noiseLevel}
                onChange={(e) => setNoiseLevel(parseFloat(e.target.value))}
              />
              <span className="setting-value">{noiseLevel}</span>
            </div>
          </div>
        )}

        <div className="settings-actions">
          <Button onClick={handleSave}>Apply Settings</Button>
          <Button 
            variant="secondary" 
            onClick={() => setRanges(DEFAULT_SENSOR_RANGES)}
          >
            Reset to Default
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SensorSettings; 