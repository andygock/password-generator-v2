import { useId } from 'react';
import styles from './Tooltip.module.css';

// A small reusable disclosure for contextual help. CSS keeps hover and keyboard
// focus behaviour in sync without adding document-level event listeners.
export default function Tooltip({
  label = 'More information',
  align = 'left',
  children,
}) {
  const id = useId();

  return (
    <span
      className={`${styles.tooltip} ${
        align === 'right' ? styles.alignRight : ''
      }`}
    >
      <button
        type="button"
        className={styles.trigger}
        aria-label={label}
        aria-describedby={id}
      >
        ?
      </button>
      <span id={id} className={styles.content} role="tooltip">
        {children}
      </span>
    </span>
  );
}
