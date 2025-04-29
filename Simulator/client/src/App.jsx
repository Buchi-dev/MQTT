import { useState, useEffect } from 'react'
import './App.css'
import LogDisplay from './components/LogDisplay'
import SimulatorControls from './components/SimulatorControls'
import SensorData from './components/SensorData'
import SensorSettings from './components/SensorSettings'
import ManualControl from './components/ManualControl'
import SimulationPresets from './components/SimulationPresets'
import { connectMqtt, subscribeTopic, onMessage, offMessage, IOT_DATA_TOPIC } from './services/mqtt'
import { 
  getStatus, 
  updateSettings, 
  setManualControl, 
  resumeAutomatic, 
  resetSimulation 
} from './services/api'

function App() {
  const [logs, setLogs] = useState([])
  const [sensorData, setSensorData] = useState(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [simulationSettings, setSimulationSettings] = useState(null)
  const [isManualMode, setIsManualMode] = useState(false)

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
    
    // Get initial simulation status and settings
    fetchStatus()
    
    // Cleanup on unmount
    return () => {
      offMessage(handleMqttMessage)
    }
  }, [])

  // Fetch simulator status
  const fetchStatus = async () => {
    try {
      const status = await getStatus()
      setIsSimulationRunning(status.simulation)
      setSimulationSettings(status.settings)
      setIsManualMode(status.manualOverride)
    } catch (error) {
      console.error('Error fetching status:', error)
    }
  }

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

  // Handle settings update
  const handleSaveSettings = async (settings) => {
    try {
      const response = await updateSettings(settings)
      setSimulationSettings(response.settings)
      addLog('Simulation settings updated')
    } catch (error) {
      console.error('Error updating settings:', error)
      addLog('Failed to update settings', 'error')
    }
  }

  // Handle preset selection
  const handleApplyPreset = async (presetSettings) => {
    try {
      const response = await updateSettings({ ranges: presetSettings })
      setSimulationSettings(response.settings)
      addLog('Preset applied')
    } catch (error) {
      console.error('Error applying preset:', error)
      addLog('Failed to apply preset', 'error')
    }
  }

  // Handle manual control
  const handleApplyManualValues = async (values) => {
    try {
      const response = await setManualControl(values, true)
      setIsManualMode(response.manualOverride)
      addLog('Manual values applied')
    } catch (error) {
      console.error('Error applying manual values:', error)
      addLog('Failed to apply manual values', 'error')
    }
  }

  // Handle resume automatic mode
  const handleResumeAutomatic = async () => {
    try {
      const response = await resumeAutomatic()
      setIsManualMode(response.manualOverride)
      addLog('Resumed automatic simulation')
    } catch (error) {
      console.error('Error resuming automatic mode:', error)
      addLog('Failed to resume automatic mode', 'error')
    }
  }

  // Add a log entry
  const addLog = (message, type = 'info') => {
    setLogs(prevLogs => [...prevLogs, {
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
          <SimulatorControls 
            onStatusChange={handleStatusChange} 
            isManualMode={isManualMode}
          />
          <SensorData data={sensorData} />
          
          <div className="sensor-controls">
            <ManualControl 
              onApplyManualValues={handleApplyManualValues}
              onResumeAutomatic={handleResumeAutomatic}
            />
            <SimulationPresets onApplyPreset={handleApplyPreset} />
            <SensorSettings 
              onSaveSettings={handleSaveSettings}
              defaultRanges={simulationSettings?.ranges}
            />
          </div>
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
