export default function PasswordSizeSlider({
  sizeBytes,
  onChange,
  ...otherProps
}) {
  const handleBitSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    onChange(newSize);
  };
  return (
    <div>
      <label htmlFor="size-bytes-range" className="heading">
        Password Length
        <span className="bits">
          {sizeBytes * 8 < 100 && <>&nbsp;</>}
          {sizeBytes * 8}
          &nbsp;
          <a
            href="https://en.wikipedia.org/wiki/Password_strength"
            target="_blank"
            rel="noopener noreferrer"
          >
            bits
          </a>
        </span>
      </label>
      <input
        id="size-bytes-range"
        type="range"
        min={4}
        max={64}
        step={1}
        value={sizeBytes}
        onChange={handleBitSizeChange}
        {...otherProps}
      />
    </div>
  );
}
