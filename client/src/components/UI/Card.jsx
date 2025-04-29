import { useState } from 'react';
import './Card.css';

/**
 * Card component for displaying content in a container
 */
const Card = ({ 
  title, 
  children, 
  className = '', 
  collapsible = false, 
  defaultCollapsed = false,
  footer = null,
  headerRight = null
}) => {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  return (
    <div className={`cc-card ${className}`}>
      {title && (
        <div className="cc-card-header">
          <div className="cc-card-title">
            {collapsible && (
              <button 
                className={`cc-collapse-btn ${collapsed ? 'collapsed' : ''}`}
                onClick={() => setCollapsed(!collapsed)}
              >
                ▼
              </button>
            )}
            <h3>{title}</h3>
          </div>
          {headerRight && (
            <div className="cc-card-header-right">
              {headerRight}
            </div>
          )}
        </div>
      )}
      
      <div className={`cc-card-body ${collapsed ? 'collapsed' : ''}`}>
        {children}
      </div>
      
      {footer && (
        <div className="cc-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 