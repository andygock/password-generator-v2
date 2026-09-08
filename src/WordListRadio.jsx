import { WORD_LIST_OPTIONS } from './words';
import ui from './ui.module.css';

export default function WordListRadio({ value, onChange = () => null }) {
  return (
    <fieldset className={ui.field}>
      <legend>Word list</legend>
      {WORD_LIST_OPTIONS.map(({ text, id, count }) => (
        <label key={id} className={ui.option}>
          <input
            type="radio"
            name="word-list"
            value={id}
            checked={value === id}
            onChange={() => onChange(id)}
          />
          <span className={ui.optionText}>
            <span>{text}</span>
            <span className={ui.muted}>{count.toLocaleString('en-AU')}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
