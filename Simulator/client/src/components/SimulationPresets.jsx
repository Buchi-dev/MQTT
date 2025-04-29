import { useState } from 'react';
import { Card, Button } from './UI';
import './SimulationPresets.css';

// Predefined presets
const DEFAULT_PRESETS = [
  {
    id: 'normal',
    name: 'Normal Conditions',
    description: 'Moderate temperature and humidity, normal pressure',
    settings: {
      temperature: { min: 20, max: 25 },
      humidity: { min: 40, max: 60 },
      pressure: { min: 1000, max: 1010 },
      light: { min: 400, max: 600 }
    }
  },
  {
    id: 'hot-day',
    name: 'Hot Day',
    description: 'High temperature, low humidity',
    settings: {
      temperature: { min: 30, max: 35 },
      humidity: { min: 20, max: 30 },
      pressure: { min: 990, max: 1000 },
      light: { min: 800, max: 1000 }
    }
  },
  {
    id: 'rainy-day',
    name: 'Rainy Day',
    description: 'Low pressure, high humidity, low light',
    settings: {
      temperature: { min: 15, max: 20 },
      humidity: { min: 70, max: 90 },
      pressure: { min: 980, max: 990 },
      light: { min: 100, max: 300 }
    }
  },
  {
    id: 'night-time',
    name: 'Night Time',
    description: 'Cool temperature, moderate humidity, minimal light',
    settings: {
      temperature: { min: 10, max: 18 },
      humidity: { min: 50, max: 70 },
      pressure: { min: 1000, max: 1010 },
      light: { min: 0, max: 50 }
    }
  }
];

/**
 * SimulationPresets component for selecting predefined sensor configurations
 */
const SimulationPresets = ({ onApplyPreset }) => {
  const [presets] = useState(DEFAULT_PRESETS);
  
  const handleApplyPreset = (preset) => {
    onApplyPreset(preset.settings);
  };

  return (
    <Card 
      title="Simulation Presets" 
      className="simulation-presets"
      collapsible
      defaultCollapsed
    >
      <div className="presets-container">
        {presets.map((preset) => (
          <div className="preset-item" key={preset.id}>
            <div className="preset-info">
              <h4>{preset.name}</h4>
              <p>{preset.description}</p>
            </div>
            <Button 
              size="small" 
              onClick={() => handleApplyPreset(preset)}
            >
              Apply
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default SimulationPresets; 