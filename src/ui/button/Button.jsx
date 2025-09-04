// src/components/ui/button/Button.jsx
import React from 'react';
import styles from './Button.module.css';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  isLoading = false,
  className = '',
  ...props 
}) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Завантаження...' : children}
    </button>
  );
};

export default Button;