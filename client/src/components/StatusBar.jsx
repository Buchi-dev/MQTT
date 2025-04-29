import { useState, useEffect } from 'react';
import './StatusBar.css';

const StatusBar = ({ isConnected, lastUpdate }) => {
  const [timeAgo, setTimeAgo] = useState('');

  // Update time ago text every second
  useEffect(() => {
    if (!lastUpdate) return;

    const updateTimeAgo = () => {
      const now = new Date();
      const updateTime = new Date(lastUpdate);
      const diffInSeconds = Math.floor((now - updateTime) / 1000);
      
      if (diffInSeconds < 60) {
        setTimeAgo(`${diffInSeconds} seconds ago`);
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`${Math.floor(diffInSeconds / 60)} minutes ago`);
      } else {
        setTimeAgo(`${Math.floor(diffInSeconds / 3600)} hours ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 1000);
    
    return () => clearInterval(interval);
  }, [lastUpdate]);

  return (
    <div className="status-bar">
      <div className="status-item">
        <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
        <span>MQTT: {isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>
      
      {lastUpdate && (
        <div className="status-item">
          <span>Last update: {timeAgo}</span>
        </div>
      )}
    </div>
  );
};

export default StatusBar; 