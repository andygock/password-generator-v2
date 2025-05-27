function CharsetSelector({
  charsets,
  selectedKey,
  onChange,
  style,
  hideLabel,
}) {
  return (
    <div style={style || { marginBottom: '1em' }}>
      {!hideLabel && <strong>Charset:</strong>}
      {charsets.map((c) => (
        <label key={c.key} style={{ marginLeft: '1em', cursor: 'pointer' }}>
          <input
            type="radio"
            name="charset"
            value={c.key}
            checked={selectedKey === c.key}
            onChange={() => onChange(c.key)}
            style={{ marginRight: 4 }}
          />
          {c.label}{' '}
          <span style={{ color: '#888', fontSize: '0.95em' }}>
            ({c.charset.length} chars)
          </span>
        </label>
      ))}
    </div>
  );
}

export default CharsetSelector;
