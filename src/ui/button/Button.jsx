//компонента не використовується, можна видаляти
import React, { forwardRef } from 'react';
import PropTypes from "prop-types";
import styles from './Button.module.css';

const Button = forwardRef(function Button(
  {
  children, 
  onClick, 
  variant = 'primary', // primary | secondary | danger | ghost
  size = "md", // sm | md | lg
  disabled = false,
  isLoading = false,
  type = 'button',
  className = '',
  iconLeft = null,
  iconRight = null,
  ariaLabel,
  ...props 
  },
  ref
) {
  const isDisabled = disabled || isLoading;
  const variantClass = styles[variant] || styles.primary;
  const sizeClass = styles[size] || styles.md;

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading ? "true" : undefined}
      aria-disabled={isDisabled ? "true" : undefined}
      aria-label={ariaLabel}
      className={`${styles.button} ${variantClass} ${sizeClass} ${
        isDisabled ? styles.disabled : ""
      } ${className}`}
      {...props}
    >
      {isLoading && (
        <span className={styles.loader} aria-hidden='true'/>
      )}
      {iconLeft && !isLoading &&(
        <span className={styles.icon} aria-hidden='true'>{iconLeft}
        </span>
      )}
      <span className={isLoading ? styles.labelLoading : ""}>
        {children}
      </span>

      {iconRight && !isLoading && (
        <span className={styles.icon} aria-hidden="true">
          {iconRight}
        </span>
      )}
      {/* Для скрінрідерів: коли завантаження — пояснюємо стан */}
      {isLoading && (
        <span className={styles.srOnly}>Завантаження…</span>
      )}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "ghost"]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  className: PropTypes.string,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  ariaLabel: PropTypes.string,
};


Button.displayName = "Button";


export default Button;