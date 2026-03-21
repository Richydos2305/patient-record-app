import styles from './Loading.module.css';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  fullScreen?: boolean;
}

export function Loading({ size = 'medium', message, fullScreen = false }: LoadingProps) {
  const content = (
    <div className={styles.content}>
      <div className={`${styles.spinner} ${styles[size]}`}>
        <svg className={styles.spinnerIcon} viewBox="0 0 50 50">
          <circle
            className={styles.spinnerPath}
            cx="25"
            cy="25"
            r="20"
            fill="none"
            strokeWidth="5"
          />
        </svg>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={styles.fullScreen} role="status" aria-live="polite">
        {content}
      </div>
    );
  }

  return (
    <div className={styles.container} role="status" aria-live="polite">
      {content}
    </div>
  );
}
