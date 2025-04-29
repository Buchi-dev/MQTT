import { useState, useEffect } from 'react';
import './App.css';
import StatusBar from './components/StatusBar';
import SensorReadings from './components/SensorReadings';
import SensorChart from './components/SensorChart';
import DataTable from './components/DataTable';
import { connectMqtt, subscribeTopic, onMessage, offMessage, IOT_DATA_TOPIC } from './services/mqtt';

// Maximum number of history items to keep
const MAX_HISTORY_ITEMS = 50;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [dataHistory, setDataHistory] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Connect to MQTT broker when component mounts
  useEffect(() => {
    const setupMqtt = async () => {
      try {
        await connectMqtt();
        setIsConnected(true);
        
        // Subscribe to the IoT data topic
        subscribeTopic(IOT_DATA_TOPIC);
        console.log(`Subscribed to ${IOT_DATA_TOPIC}`);
      } catch (error) {
        console.error('Failed to connect to MQTT:', error);
        setIsConnected(false);
      }
    };

    setupMqtt();
  }, []);

  // Handle incoming MQTT messages
  const handleMqttMessage = (topic, message) => {
    if (topic === IOT_DATA_TOPIC && message) {
      // Update current data
      setCurrentData(message);
      
      // Add to history
      setDataHistory(prev => {
        const newHistory = [message, ...prev];
        // Limit history size
        return newHistory.slice(0, MAX_HISTORY_ITEMS);
      });
      
      // Update last received timestamp
      setLastUpdate(new Date().toISOString());
    }
  };

  // Register MQTT message handler
  useEffect(() => {
    onMessage(handleMqttMessage);
    return () => offMessage(handleMqttMessage);
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <h1>IoT Dashboard</h1>
        <p>Real-time visualization of IoT device data</p>
      </header>
      
      <main className="app-content">
        <div className="dashboard-grid">
          <div className="readings-section">
            <SensorReadings data={currentData} />
          </div>
          
          <div className="chart-section">
            <SensorChart sensorData={currentData} />
          </div>
          
          <div className="table-section">
            <DataTable dataHistory={dataHistory} />
          </div>
        </div>
      </main>
      
      <StatusBar isConnected={isConnected} lastUpdate={lastUpdate} />
    </div>
  );
}

export default App;
