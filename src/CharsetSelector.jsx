function CharsetSelector({ charsets, selectedKey, onChange, hideLabel }) {
  // get selected charset based on selectedKey
  const selectedCharset = charsets.find((c) => c.key === selectedKey);
  return (
    <div>
      <p>Character Set</p>
      {charsets.map((c) => (
        <label key={c.key}>
          <input
            type="radio"
            name="charset"
            value={c.key}
            checked={selectedKey === c.key}
            onChange={() => onChange(c.key)}
          />
          {c.label} <span>({c.charset.length} chars)</span>
        </label>
      ))}
      <div>
        <div className="heading">Key space</div>
        <div className="keyspace">{selectedCharset.charset}</div>
      </div>
    </div>
  );
}

export default CharsetSelector;
