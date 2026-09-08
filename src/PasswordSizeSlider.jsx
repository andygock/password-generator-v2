import { useId } from 'react';
import config from './config';
import ui from './ui.module.css';

export default function PasswordSizeSlider({ sizeBytes, onChange }) {
  const id = useId();
  return (
    <div className={ui.field}>
      <label htmlFor={id} className={ui.optionText}>
        <span className={ui.label}>Target entropy</span>
        <span className={ui.badge}>{sizeBytes * 8} bits</span>
      </label>
      <input
        id={id}
        type="range"
        min={config.limits.passwordBytes.min}
        max={config.limits.passwordBytes.max}
        step={1}
        value={sizeBytes}
        aria-valuetext={`${sizeBytes * 8} bits`}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </div>
  );
}
