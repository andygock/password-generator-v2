import useCopyFeedback from './useCopyFeedback';
import styles from './PasswordOutput.module.css';
import ui from './ui.module.css';

// A labelled text control lets keyboard and assistive-tech users inspect and
// select the password independently of the copy action.
export default function PasswordOutput({ values, noun = 'Password' }) {
  const { copied, copyNotify, copyText } = useCopyFeedback({
    resetKey: values,
  });
  return (
    <div>
      <ol
        className={styles.list}
        aria-label={`Generated ${noun.toLowerCase()}s`}
      >
        {values.map((value, index) => (
          <li
            key={index}
            className={styles.row}
            data-copied={copied === value || undefined}
          >
            <span className={styles.number} aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div className={styles.secretField}>
              {/* The mirror sizes the selectable control without measuring DOM
                  geometry or depending on browser support for field-sizing. */}
              <span className={styles.measure} aria-hidden="true">
                {value}
              </span>
              <textarea
                className={styles.secret}
                aria-label={`${noun} ${index + 1}`}
                value={value}
                rows={1}
                readOnly
                spellCheck={false}
                autoComplete="off"
                onFocus={(event) => event.target.select()}
              />
            </div>
            <button
              type="button"
              className={styles.copy}
              aria-label={`Copy ${noun.toLowerCase()} ${index + 1}`}
              onClick={() => copyText(value, `${noun} copied`)}
            >
              {copied === value ? 'Copied' : 'Copy'}
            </button>
          </li>
        ))}
      </ol>
      <div className={ui.feedback} role="status" aria-live="polite">
        {copyNotify}
      </div>
    </div>
  );
}
