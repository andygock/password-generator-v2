import { useId, useState } from 'react';
import ui from './ui.module.css';
import styles from './NumberPicker.module.css';

// Keep editing text local; only committed integers change generator settings.
const NumberPicker = ({
  onChange = () => null,
  min = 0,
  max,
  value,
  label,
  ...otherProps
}) => {
  const id = useId();
  const [draft, setDraft] = useState(String(value));
  const [previousValue, setPreviousValue] = useState(value);
  if (value !== previousValue) {
    // Back/forward navigation must replace any unfinished edit too.
    setPreviousValue(value);
    setDraft(String(value));
  }

  const normalise = (text) => {
    const parsed = String(text).trim() === '' ? NaN : Number(text);
    return Number.isFinite(parsed)
      ? Math.max(min, Math.min(max ?? Infinity, Math.trunc(parsed)))
      : value;
  };
  const draftValue = normalise(draft);
  const commit = (text) => {
    const next = normalise(text);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <div className={ui.field}>
      <label className={ui.label} htmlFor={id}>
        {label}
      </label>
      <div
        className={styles.control}
        onBlur={(event) => {
          // Commit when leaving the whole control so a step button can apply
          // the draft and step together without competing route updates.
          if (!event.currentTarget.contains(event.relatedTarget)) commit(draft);
        }}
      >
        <input
          {...otherProps}
          id={id}
          type="number"
          value={draft}
          min={min}
          max={max}
          step={1}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') event.currentTarget.blur();
            if (event.key === 'Escape') setDraft(String(value));
          }}
        />
        <button
          type="button"
          disabled={draftValue <= min}
          onClick={() => commit(draftValue - 1)}
          aria-label={'Decrease ' + label.toLowerCase()}
        >
          &darr;
        </button>
        <button
          type="button"
          disabled={typeof max === 'number' && draftValue >= max}
          onClick={() => commit(draftValue + 1)}
          aria-label={'Increase ' + label.toLowerCase()}
        >
          &uarr;
        </button>
      </div>
    </div>
  );
};

export default NumberPicker;
