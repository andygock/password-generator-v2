const buttonStyle = {
  margin: '0 0rem 0 0.2rem',
};

// state is managed by parent
const NumberPicker = ({
  onChange = () => null,
  min = 0,
  max,
  value,
  ...otherProps
}) => {
  const handleChange = (val) => {
    const parsed = typeof val === 'number' ? val : Number(val);
    if (!Number.isFinite(parsed)) return;
    let newVal = Math.trunc(parsed);
    if (newVal < min) newVal = min;
    if (typeof max === 'number' && newVal > max) newVal = max;
    onChange(newVal);
  };

  return (
    <div>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={1}
        onChange={(e) => handleChange(e.target.value)}
        {...otherProps}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          handleChange(Number(value) - 1);
        }}
      >
        &darr;
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          handleChange(Number(value) + 1);
        }}
      >
        &uarr;
      </button>
    </div>
  );
};

export default NumberPicker;
