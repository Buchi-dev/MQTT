import { useState, useEffect } from 'react';
import { Card, Button } from './UI';
import { startSimulation, stopSimulation, getStatus, resetSimulation } from '../services/api';
import './SimulatorControls.css';

/**
 * SimulatorControls component for controlling the simulator
 */
const SimulatorControls = ({ onStatusChange, isManualMode = false }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Get initial status when component mounts
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const status = await getStatus();
        setIsRunning(status.simulation);
        onStatusChange && onStatusChange(status.simulation);
      } catch (error) {
        console.error('Error fetching simulator status:', error);
      }
    };

    fetchStatus();
  }, [onStatusChange]);

  // Handle start button click
  const handleStart = async () => {
    setIsLoading(true);
    try {
      const result = await startSimulation();
      if (result.success) {
        setIsRunning(true);
        onStatusChange && onStatusChange(true);
      }
    } catch (error) {
      console.error('Error starting simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle stop button click
  const handleStop = async () => {
    setIsLoading(true);
    try {
      const result = await stopSimulation();
      if (result.success) {
        setIsRunning(false);
        onStatusChange && onStatusChange(false);
      }
    } catch (error) {
      console.error('Error stopping simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reset button click
  const handleReset = async () => {
    setIsLoading(true);
    try {
      await resetSimulation();
      // Refresh status
      const status = await getStatus();
      setIsRunning(status.simulation);
      onStatusChange && onStatusChange(status.simulation);
    } catch (error) {
      console.error('Error resetting simulation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Simulator Controls" className="simulator-controls">
      <div className="status-indicators">
        <div className="status-indicator">
          <div className={`status-dot ${isRunning ? 'active' : 'inactive'}`}></div>
          <span>Status: {isRunning ? 'Running' : 'Stopped'}</span>
        </div>

        {isManualMode && (
          <div className="status-indicator manual-mode">
            <div className="status-dot manual"></div>
            <span>Manual Control: Active</span>
          </div>
        )}
      </div>
      
      <div className="controls-buttons">
        <Button 
          variant="success" 
          disabled={isRunning || isLoading}
          onClick={handleStart}
        >
          Start Simulation
        </Button>
        <Button 
          variant="danger" 
          disabled={!isRunning || isLoading}
          onClick={handleStop}
        >
          Stop Simulation
        </Button>
        <Button 
          variant="secondary"
          disabled={isLoading}
          onClick={handleReset}
        >
          Reset Defaults
        </Button>
      </div>
    </Card>
  );
};

export default SimulatorControls; 