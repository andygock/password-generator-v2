import React from 'react';
import PropTypes from 'prop-types';
import dict from './words';

const Output = ({ list, words, lines }) => {
  // keep track how many times user is clicking re-generate
  const [counter, setCounter] = React.useState(0);

  const arr = new Uint32Array(lines * words);
  const random = window.crypto
    .getRandomValues(arr)
    .map((v) => v % dict[list].length);

  // generate passphrases
  let index = 0;
  const rows = [];
  for (let row = 0; row < lines; row++) {
    const line = [];
    for (let n = 0; n < words; n++) {
      line.push(dict[list][random[index]]);
      index += 1;
    }
    rows.push(line);
  }

  return (
    <div>
      <button
        onClick={() => {
          setCounter(counter + 1);
        }}
      >
        Regenerate
      </button>
      {rows.map((row, rowNumber) => (
        <div key={rowNumber}>{row.join(' ')}</div>
      ))}
    </div>
  );
};

Output.propTypes = {
  list: PropTypes.string,
  words: PropTypes.number,
  lines: PropTypes.number,
};

export default Output;
