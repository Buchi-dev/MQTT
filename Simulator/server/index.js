import express from 'express';
import cors from 'cors';
import { connectMqttClient, publishData } from './mqtt-client.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MQTT client
let mqttClient;

// Default sensor ranges
const DEFAULT_SENSOR_RANGES = {
  temperature: { min: 20, max: 30 },
  humidity: { min: 30, max: 70 },
  pressure: { min: 990, max: 1010 },
  light: { min: 200, max: 1000 }
};

// Simulation settings
let simulationSettings = {
  ranges: { ...DEFAULT_SENSOR_RANGES },
  updateFrequency: 3, // seconds
  noiseLevel: 1
};

// Simulation state
let simulationInterval;
let manualOverride = false;
let lastManualValues = null;

/**
 * Generate random value within range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} noise - Noise level (0-2)
 * @returns {number} Random value
 */
const generateRandomValue = (min, max, noise = 1) => {
  // Generate base random value
  const baseValue = Math.random() * (max - min) + min;
  
  // Apply noise (if noise level > 0)
  if (noise > 0) {
    // Calculate noise amount (up to noiseLevel% of range)
    const range = max - min;
    const noiseAmount = (Math.random() * 2 - 1) * (range * noise * 0.05);
    return parseFloat((baseValue + noiseAmount).toFixed(1));
  }
  
  return parseFloat(baseValue.toFixed(1));
};

/**
 * Start data simulation
 */
const startSimulation = () => {
  console.log('Starting IoT device simulation...');
  
  // Clear any existing interval
  if (simulationInterval) {
    clearInterval(simulationInterval);
  }
  
  // Create new interval with current settings
  simulationInterval = setInterval(() => {
    // Generate data based on settings
    let data;
    
    if (manualOverride && lastManualValues) {
      // Use manual values if override is active
      data = { ...lastManualValues, timestamp: new Date().toISOString() };
    } else {
      // Generate random data based on ranges
      data = {
        temperature: generateRandomValue(
          simulationSettings.ranges.temperature.min, 
          simulationSettings.ranges.temperature.max,
          simulationSettings.noiseLevel
        ),
        humidity: generateRandomValue(
          simulationSettings.ranges.humidity.min, 
          simulationSettings.ranges.humidity.max,
          simulationSettings.noiseLevel
        ),
        pressure: generateRandomValue(
          simulationSettings.ranges.pressure.min, 
          simulationSettings.ranges.pressure.max,
          simulationSettings.noiseLevel
        ),
        light: generateRandomValue(
          simulationSettings.ranges.light.min, 
          simulationSettings.ranges.light.max,
          simulationSettings.noiseLevel
        ),
        timestamp: new Date().toISOString()
      };
    }
    
    // Publish data to MQTT topic
    publishData(mqttClient, 'iot/simulated/data', data);
    console.log('Published data:', data);
  }, simulationSettings.updateFrequency * 1000); // Convert to milliseconds
};

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'running', 
    simulation: !!simulationInterval,
    settings: simulationSettings,
    manualOverride,
    lastManualValues
  });
});

app.post('/api/simulation/start', (req, res) => {
  if (!simulationInterval) {
    startSimulation();
    res.json({ success: true, message: 'Simulation started', settings: simulationSettings });
  } else {
    res.json({ success: false, message: 'Simulation already running' });
  }
});

app.post('/api/simulation/stop', (req, res) => {
  if (simulationInterval) {
    clearInterval(simulationInterval);
    simulationInterval = null;
    res.json({ success: true, message: 'Simulation stopped' });
  } else {
    res.json({ success: false, message: 'Simulation already stopped' });
  }
});

app.post('/api/simulation/settings', (req, res) => {
  const { ranges, updateFrequency, noiseLevel } = req.body;
  
  // Update settings
  if (ranges) {
    simulationSettings.ranges = ranges;
  }
  
  if (typeof updateFrequency === 'number') {
    simulationSettings.updateFrequency = Math.max(1, Math.min(10, updateFrequency));
  }
  
  if (typeof noiseLevel === 'number') {
    simulationSettings.noiseLevel = Math.max(0, Math.min(2, noiseLevel));
  }
  
  // Restart simulation if it's running
  if (simulationInterval) {
    clearInterval(simulationInterval);
    startSimulation();
  }
  
  res.json({ 
    success: true, 
    message: 'Settings updated', 
    settings: simulationSettings 
  });
});

app.post('/api/simulation/manual', (req, res) => {
  const { values, enabled } = req.body;
  
  if (typeof enabled === 'boolean') {
    manualOverride = enabled;
  }
  
  if (values) {
    lastManualValues = values;
  }
  
  // If we're enabling manual mode and have values, publish immediately
  if (manualOverride && lastManualValues && mqttClient) {
    const data = {
      ...lastManualValues,
      timestamp: new Date().toISOString()
    };
    
    publishData(mqttClient, 'iot/simulated/data', data);
  }
  
  res.json({ 
    success: true, 
    message: `Manual mode ${manualOverride ? 'enabled' : 'disabled'}`,
    manualOverride,
    lastManualValues
  });
});

app.post('/api/simulation/reset', (req, res) => {
  // Reset to defaults
  simulationSettings = {
    ranges: { ...DEFAULT_SENSOR_RANGES },
    updateFrequency: 3,
    noiseLevel: 1
  };
  
  manualOverride = false;
  lastManualValues = null;
  
  // Restart simulation if it's running
  if (simulationInterval) {
    clearInterval(simulationInterval);
    startSimulation();
  }
  
  res.json({ 
    success: true, 
    message: 'Simulation reset to defaults', 
    settings: simulationSettings 
  });
});

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Connect to MQTT broker
  mqttClient = await connectMqttClient();
  
  // Start simulation automatically
  startSimulation();
}); 