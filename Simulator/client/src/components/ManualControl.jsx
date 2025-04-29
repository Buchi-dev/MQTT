import { useState } from 'react';
import { Card, Button } from './UI';
import './ManualControl.css';

/**
 * ManualControl component for overriding sensor values manually
 */
const ManualControl = ({ onApplyManualValues, onResumeAutomatic }) => {
  const [manualMode, setManualMode] = useState(false);
  const [values, setValues] = useState({
    temperature: 25.0,
    humidity: 50.0,
    pressure: 1000.0,
    light: 500.0
  });

  // Handle input change for sensor values
  const handleValueChange = (sensor, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    setValues(prev => ({
      ...prev,
      [sensor]: numValue
    }));
  };

  // Handle enable manual mode button click
  const handleEnableManual = () => {
    setManualMode(true);
  };

  // Handle apply manual values button click
  const handleApplyManual = () => {
    onApplyManualValues(values);
  };

  // Handle resume automatic mode button click
  const handleResumeAutomatic = () => {
    setManualMode(false);
    onResumeAutomatic();
  };

  return (
    <Card 
      title="Manual Control" 
      className="manual-control"
      collapsible
      defaultCollapsed
    >
      <div className="control-mode-indicator">
        <div className={`mode-dot ${manualMode ? 'manual' : 'automatic'}`}></div>
        <span>Mode: {manualMode ? 'Manual' : 'Automatic'}</span>
      </div>

      <div className="manual-controls">
        <div className="control-sliders">
          <div className="control-group">
            <label>Temperature (°C)</label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0"
                max="50"
                step="0.1"
                value={values.temperature}
                onChange={(e) => handleValueChange('temperature', e.target.value)}
                disabled={!manualMode}
              />
              <input
                type="number"
                value={values.temperature}
                onChange={(e) => handleValueChange('temperature', e.target.value)}
                step="0.1"
                disabled={!manualMode}
                className="value-input"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Humidity (%)</label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={values.humidity}
                onChange={(e) => handleValueChange('humidity', e.target.value)}
                disabled={!manualMode}
              />
              <input
                type="number"
                value={values.humidity}
                onChange={(e) => handleValueChange('humidity', e.target.value)}
                step="0.1"
                disabled={!manualMode}
                className="value-input"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Pressure (hPa)</label>
            <div className="slider-with-value">
              <input
                type="range"
                min="950"
                max="1050"
                step="0.1"
                value={values.pressure}
                onChange={(e) => handleValueChange('pressure', e.target.value)}
                disabled={!manualMode}
              />
              <input
                type="number"
                value={values.pressure}
                onChange={(e) => handleValueChange('pressure', e.target.value)}
                step="0.1"
                disabled={!manualMode}
                className="value-input"
              />
            </div>
          </div>

          <div className="control-group">
            <label>Light (lux)</label>
            <div className="slider-with-value">
              <input
                type="range"
                min="0"
                max="2000"
                step="1"
                value={values.light}
                onChange={(e) => handleValueChange('light', e.target.value)}
                disabled={!manualMode}
              />
              <input
                type="number"
                value={values.light}
                onChange={(e) => handleValueChange('light', e.target.value)}
                step="1"
                disabled={!manualMode}
                className="value-input"
              />
            </div>
          </div>
        </div>

        <div className="control-actions">
          {!manualMode ? (
            <Button onClick={handleEnableManual}>Enable Manual Mode</Button>
          ) : (
            <>
              <Button onClick={handleApplyManual} variant="primary">Apply Values</Button>
              <Button onClick={handleResumeAutomatic} variant="secondary">Resume Automatic</Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ManualControl; 