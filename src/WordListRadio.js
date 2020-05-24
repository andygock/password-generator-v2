import React from 'react';
import PropTypes from 'prop-types';

import words from './words';

const WordListRadio = ({ value, onChange }) => {
  const wordListOptions = [
    {
      text: 'EFF long word list',
      id: 'eff-long',
    },
    {
      text: 'EFF short word list v1',
      id: 'eff-short1',
    },
    {
      text: 'EFF short word list v2',
      id: 'eff-short2',
    },
  ];

  const handleChange = (e) => {
    const id = e.target.id;
    onChange(id);
  };

  return (
    <>
      {wordListOptions.map(({ text, id }) => (
        <label key={id}>
          <input
            type="radio"
            id={id}
            name="word-list"
            checked={value === id}
            onChange={handleChange}
          />{' '}
          {text} ({words[id].length})
        </label>
      ))}
    </>
  );
};

WordListRadio.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

WordListRadio.defaultProps = {
  onChange: () => null,
};

export default WordListRadio;
