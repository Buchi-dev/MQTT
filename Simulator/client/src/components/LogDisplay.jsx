import { useState, useEffect, useRef } from 'react';
import { Card } from './UI';
import './LogDisplay.css';

/**
 * LogDisplay component for showing data logs
 */
const LogDisplay = ({ logs = [], maxLogs = 100 }) => {
  const [visibleLogs, setVisibleLogs] = useState([]);
  const logContainerRef = useRef(null);
  const [autoScroll, setAutoScroll] = useState(true);

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

  // Auto scroll to the bottom when new logs are added (only if autoScroll is enabled)
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      const container = logContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [visibleLogs, autoScroll]);

  // Handle scroll events to determine if user has manually scrolled up
  const handleScroll = () => {
    if (!logContainerRef.current) return;
    
    const container = logContainerRef.current;
    const { scrollTop, scrollHeight, clientHeight } = container;
    
    // If user scrolls up more than 50px from bottom, disable auto-scroll
    // If user scrolls back to bottom, re-enable auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setAutoScroll(isNearBottom);
  };

  // Clear logs
  const handleClearLogs = () => {
    setVisibleLogs([]);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <Card title="Data Console" className="log-display-card">
      <div 
        className="log-container" 
        ref={logContainerRef}
        onScroll={handleScroll}
      >
        {visibleLogs.length === 0 ? (
          <div className="no-logs">No logs available</div>
        ) : (
          visibleLogs.map((log, index) => (
            <div 
              key={index} 
              className={`log-entry ${log.type ? `log-type-${log.type}` : ''}`}
            >
              <span className="log-time">{formatTime(log.timestamp)}</span>
              <span className="log-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
      <div className="log-controls">
        <button 
          className="clear-logs-btn"
          onClick={handleClearLogs}
        >
          Clear Console
        </button>
        <div className="auto-scroll-indicator">
          <span className={`auto-scroll-dot ${autoScroll ? 'active' : 'inactive'}`}></span>
          <span>Auto-scroll: {autoScroll ? 'ON' : 'OFF'}</span>
        </div>
      </div>
    </Card>
  );
};

export default LogDisplay; 