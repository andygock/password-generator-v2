import React from 'react';

import PropTypes from 'prop-types';

import words from './words';

const baseLog = (base, val) => Math.log(val) / Math.log(base);

const WordListRadio = ({ value, onChange = () => null }) => {
  const wordListOptions = [
    {
      text: 'Orchard Street Long',
      id: 'orchard-street-long',
    },
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
      {wordListOptions.map(({ text, id }) => {
        const wordCount = words[id].length;
        return (
          <label key={id}>
            <input
              type="radio"
              id={id}
              name="word-list"
              checked={value === id}
              onChange={handleChange}
            />
            {text} ({wordCount}, 2<sup>{baseLog(2, wordCount).toFixed(1)}</sup>)
          </label>
        );
      })}
    </>
  );
};

WordListRadio.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
};

export default WordListRadio;
