// components/ui/LoadingSpinner.jsx
import styles from './LoadingSpinner.module.css';

export default function LoadingSpinner({ fullScreen = false }) {
  return (
    <div className={`${styles.spinner} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.loader}></div>
    </div>
  );
}