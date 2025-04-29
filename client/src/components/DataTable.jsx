import { useState, useEffect } from 'react';
import { Card } from './UI';
import './DataTable.css';

const MAX_HISTORY_ITEMS = 10;

const DataTable = ({ dataHistory = [] }) => {
  const [sortConfig, setSortConfig] = useState({
    key: 'timestamp',
    direction: 'desc'
  });
  
  // Sort data based on current sort configuration
  const sortedData = [...dataHistory].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  // Handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key 
        ? (prevConfig.direction === 'asc' ? 'desc' : 'asc') 
        : 'asc'
    }));
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format data values
  const formatValue = (value) => {
    if (value === null || value === undefined) return '--';
    return typeof value === 'number' ? value.toFixed(1) : value;
  };

  return (
    <Card title="Data History" className="data-table-card">
      {dataHistory.length === 0 ? (
        <div className="no-data-message">
          Waiting for data to populate history...
        </div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('timestamp')}
                  className={sortConfig.key === 'timestamp' ? `sorted-${sortConfig.direction}` : ''}
                >
                  Timestamp
                </th>
                <th 
                  onClick={() => handleSort('temperature')}
                  className={sortConfig.key === 'temperature' ? `sorted-${sortConfig.direction}` : ''}
                >
                  Temperature (°C)
                </th>
                <th 
                  onClick={() => handleSort('humidity')}
                  className={sortConfig.key === 'humidity' ? `sorted-${sortConfig.direction}` : ''}
                >
                  Humidity (%)
                </th>
                <th 
                  onClick={() => handleSort('pressure')}
                  className={sortConfig.key === 'pressure' ? `sorted-${sortConfig.direction}` : ''}
                >
                  Pressure (hPa)
                </th>
                <th 
                  onClick={() => handleSort('light')}
                  className={sortConfig.key === 'light' ? `sorted-${sortConfig.direction}` : ''}
                >
                  Light (lux)
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((item, index) => (
                <tr key={index}>
                  <td>{formatTimestamp(item.timestamp)}</td>
                  <td>{formatValue(item.temperature)}</td>
                  <td>{formatValue(item.humidity)}</td>
                  <td>{formatValue(item.pressure)}</td>
                  <td>{formatValue(item.light)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default DataTable; 