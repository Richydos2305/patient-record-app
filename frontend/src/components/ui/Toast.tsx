import { useToast } from '../../contexts/ToastContext';
import styles from './Toast.module.css';

export function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} role="region" aria-label="Notifications">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
          aria-live="polite"
        >
          <div className={styles.content}>
            <div className={styles.icon}>
              {toast.type === 'success' && '✓'}
              {toast.type === 'error' && '✕'}
              {toast.type === 'info' && 'ℹ'}
              {toast.type === 'warning' && '⚠'}
            </div>
            <p className={styles.message}>{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={styles.close}
            aria-label="Close notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
