import './Button.css';

/**
 * Button component with different variants
 */
const Button = ({ 
  children, 
  type = 'button', 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  icon = null,
  iconPosition = 'left',
  className = '',
  onClick 
}) => {
  return (
    <button
      type={type}
      className={`cc-button cc-button-${variant} cc-button-${size} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {icon && iconPosition === 'left' && <span className="cc-button-icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="cc-button-icon">{icon}</span>}
    </button>
  );
};

export default Button; 