import ui from './ui.module.css';

export default function CharsetSelector({ charsets, selectedKey, onChange }) {
  const selected =
    charsets.find((charset) => charset.key === selectedKey) || charsets[0];
  return (
    <fieldset className={ui.field}>
      <legend>Character set</legend>
      {charsets.map((charset) => (
        <label key={charset.key} className={ui.option}>
          <input
            type="radio"
            name="charset"
            value={charset.key}
            checked={selectedKey === charset.key}
            onChange={() => onChange(charset.key)}
          />
          <span className={ui.optionText}>
            <span>{charset.label}</span>
            <span className={ui.muted}>{charset.charset.length}</span>
          </span>
        </label>
      ))}
      <code className={ui.keyspace} aria-label="Available characters">
        {selected?.charset}
      </code>
    </fieldset>
  );
}
