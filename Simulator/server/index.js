import express from 'express';
import cors from 'cors';
import { connectMqttClient, publishData } from './mqtt-client.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize MQTT client
let mqttClient;

// Start data simulation
let simulationInterval;
const startSimulation = () => {
  console.log('Starting IoT device simulation...');
  simulationInterval = setInterval(() => {
    // Generate random sensor data
    const data = {
      temperature: parseFloat((Math.random() * 10 + 20).toFixed(1)), // 20-30°C
      humidity: parseFloat((Math.random() * 40 + 30).toFixed(1)),    // 30-70%
      pressure: parseFloat((Math.random() * 20 + 990).toFixed(1)),   // 990-1010 hPa
      light: parseFloat((Math.random() * 800 + 200).toFixed(1)),     // 200-1000 lux
      timestamp: new Date().toISOString()
    };
    
    // Publish data to MQTT topic
    publishData(mqttClient, 'iot/simulated/data', data);
    console.log('Published data:', data);
  }, 3000); // Publish every 3 seconds
};

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({ status: 'running', simulation: !!simulationInterval });
});

app.post('/api/simulation/start', (req, res) => {
  if (!simulationInterval) {
    startSimulation();
    res.json({ success: true, message: 'Simulation started' });
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

// Start the server
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  
  // Connect to MQTT broker
  mqttClient = await connectMqttClient();
  
  // Start simulation automatically
  startSimulation();
}); 