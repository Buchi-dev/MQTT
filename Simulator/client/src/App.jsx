import { useState, useEffect } from 'react'
import './App.css'
import LogDisplay from './components/LogDisplay'
import SimulatorControls from './components/SimulatorControls'
import SensorData from './components/SensorData'
import { connectMqtt, subscribeTopic, onMessage, offMessage, IOT_DATA_TOPIC } from './services/mqtt'

function App() {
  const [logs, setLogs] = useState([])
  const [sensorData, setSensorData] = useState(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)

  // Connect to MQTT broker when component mounts
  useEffect(() => {
    const setupMqtt = async () => {
      try {
        await connectMqtt()
        subscribeTopic(IOT_DATA_TOPIC)
        
        // Log connection success
        addLog('Connected to MQTT broker')
      } catch (error) {
        console.error('Failed to connect to MQTT:', error)
        addLog('Failed to connect to MQTT broker', 'error')
      }
    }

    setupMqtt()
    
    // Cleanup on unmount
    return () => {
      offMessage(handleMqttMessage)
    }
  }, [])

  // Handle incoming MQTT messages
  const handleMqttMessage = (topic, message) => {
    if (topic === IOT_DATA_TOPIC) {
      // Update sensor data
      setSensorData(message)
      
      // Add log entry
      const messageText = `Received data: Temp=${message.temperature.toFixed(1)}°C, Humidity=${message.humidity.toFixed(1)}%, Pressure=${message.pressure.toFixed(1)}hPa, Light=${message.light.toFixed(1)}lux`
      addLog(messageText)
    }
  }

  // Register MQTT message handler
  useEffect(() => {
    onMessage(handleMqttMessage)
    return () => offMessage(handleMqttMessage)
  }, [])

  // Handle simulation status change
  const handleStatusChange = (isRunning) => {
    setIsSimulationRunning(isRunning)
    addLog(isRunning ? 'Simulation started' : 'Simulation stopped')
  }

  // Add a log entry
  const addLog = (message, type = 'info') => {
    setLogs([{
      message,
      type,
      timestamp: new Date()
    }])
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>IoT Device Simulator</h1>
        <p>Simulates sensor data and publishes it via MQTT</p>
      </header>
      
      <main className="app-content">
        <div className="content-section">
          <SimulatorControls onStatusChange={handleStatusChange} />
          <SensorData data={sensorData} />
        </div>
        
        <div className="logs-section">
          <LogDisplay logs={logs} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>IoT Device Simulator using MQTT over WebSocket (ws://localhost:9001)</p>
      </footer>
    </div>
  )
}

export default App
