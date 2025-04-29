import { useState, useEffect, useRef } from 'react';
import { Card } from './UI';
import './LogDisplay.css';

/**
 * LogDisplay component for showing data logs
 */
const LogDisplay = ({ logs = [], maxLogs = 10 }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const logEndRef = useRef(null);

  // Update visible logs when new logs come in
  useEffect(() => {
    if (logs.length > 0) {
      setVisibleLogs(prev => {
        const newLogs = [...prev, ...logs];
        // Limit the number of logs to display
        return newLogs.slice(Math.max(0, newLogs.length - maxLogs));
      });
    }
  }, [logs, maxLogs]);

  // Auto scroll to the bottom when new logs are added
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleLogs]);

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Card title="Data Logs" className="log-display-card">
      <div className="log-container">
        {visibleLogs.length === 0 ? (
          <div className="no-logs">No logs available</div>
        ) : (
          visibleLogs.map((log, index) => (
            <div key={index} className="log-entry">
              <span className="log-time">{formatTime(log.timestamp)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </Card>
  );
};

export default LogDisplay; 