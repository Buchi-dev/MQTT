import './DataValue.css';

/**
 * DataValue component for displaying sensor readings
 */
const DataValue = ({ 
  label, 
  value, 
  unit = '', 
  icon = null, 
  trend = null,
  className = ''
}) => {
  // Determine trend class
  let trendClass = '';
  if (trend === 'up') {
    trendClass = 'cc-trend-up';
  } else if (trend === 'down') {
    trendClass = 'cc-trend-down';
  } else if (trend === 'stable') {
    trendClass = 'cc-trend-stable';
  }

  return (
    <div className={`cc-data-value ${className}`}>
      {icon && (
        <div className="cc-data-icon">
          {icon}
        </div>
      )}
      <div className="cc-data-content">
        <div className="cc-data-label">{label}</div>
        <div className={`cc-data-reading ${trendClass}`}>
          <span className="cc-data-number">{value}</span>
          {unit && <span className="cc-data-unit">{unit}</span>}
          {trend && (
            <span className={`cc-data-trend ${trendClass}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataValue; 