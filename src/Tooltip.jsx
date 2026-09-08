import { cloneElement, useId } from 'react';
import styles from './Tooltip.module.css';

// A small reusable disclosure for contextual help. CSS keeps hover and keyboard
// focus behaviour in sync without adding document-level event listeners.
export default function Tooltip({
  label = 'More information',
  align = 'left',
  placement = 'bottom',
  trigger,
  children,
}) {
  const id = useId();
  const target = trigger ? (
    cloneElement(trigger, {
      className: `${trigger.props.className || ''} ${styles.target}`,
      'aria-describedby': [trigger.props['aria-describedby'], id]
        .filter(Boolean)
        .join(' '),
    })
  ) : (
    <button
      type="button"
      className={styles.trigger}
      aria-label={label}
      aria-describedby={id}
    >
      ?
    </button>
  );

  return (
    <span
      className={`${styles.tooltip} ${
        align === 'right' ? styles.alignRight : ''
      } ${placement === 'top' ? styles.above : ''}`}
    >
      {target}
      <span id={id} className={styles.content} role="tooltip">
        {children}
      </span>
    </span>
  );
}
