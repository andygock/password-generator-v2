import PropTypes from 'prop-types';
import React from 'react';

const buttonStyle = {
  margin: '0 0rem 0 0.2rem',
};

// state is managed by parent
const NumberPicker = ({ onChange, min, max, value, ...otherProps }) => {
  const handleChange = (val) => {
    const newVal = typeof val === 'number' ? val : parseInt(val);

    // check limits
    if (isNaN(newVal)) return;
    if (newVal < min) return;
    if (max && newVal > max) return;

    onChange(newVal); // make callback
  };

  return (
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        {...otherProps}
      />
      <button
        style={buttonStyle}
        onClick={() => {
          handleChange(value - 1);
        }}
      >
        &darr;
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          handleChange(value + 1);
        }}
      >
        &uarr;
      </button>
    </div>
  );
};

NumberPicker.propTypes = {
  min: PropTypes.number,
  max: PropTypes.number,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
};

NumberPicker.defaultProps = {
  min: 0,
  onChange: () => null,
};

export default NumberPicker;
