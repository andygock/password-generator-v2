import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import React from 'react';
import dict from './words';

const capFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// return random number between 0 and (2^bits - 1)
const randomNumber = (bits) => {
  const arr = new Uint16Array(1);
  const random = window.crypto.getRandomValues(arr);
  return random[0] % Math.pow(2, bits);
};

const randomSpecialChar = () => {
  // 8 special chars used for preset1 mode, adds 1 bit of entropy
  const specialChars = '!?$#$&-.';

  const arr = new Uint16Array(1);
  const random = window.crypto.getRandomValues(arr);
  return specialChars.charAt(random % 8);
};

const OutputWords = ({ list, words, lines, mode }) => {
  const [copied, setCopied] = React.useState('');
  const [passphrases, setPassphrases] = React.useState([]);
  const [presetStrings, setPresetStrings] = React.useState([]);

  const generate = ({ lines, words, wordArray }) => {
    const arr = new Uint32Array(lines * words);
    const random = window.crypto
      .getRandomValues(arr)
      .map((v) => v % wordArray.length);

    // generate passphrases
    let index = 0;
    const rows = [];
    for (let row = 0; row < lines; row++) {
      const line = [];
      for (let n = 0; n < words; n++) {
        line.push(wordArray[random[index]]);
        index += 1;
      }
      rows.push(line);
    }

    return rows;
  };

  const generateNumbersAndSpecialChar = (bits) => {
    // append some numbers - adds bits of entropy
    // use (bits - 1), as we append randomSpecialChar() after which is 1 bit
    let rand = randomNumber(bits - 1);

    // return string e.g '3564%'
    return rand + randomSpecialChar();
  };

  const generateNumbersAndSpecialCharArray = (n) => {
    let res = [];
    for (let i = 0; i < n; i += 1) {
      res.push(generateNumbersAndSpecialChar(14)); // number of bits to add
    }
    setPresetStrings(res);
  };

  // generate passwords on page load and prop changes
  React.useEffect(() => {
    const passes = generate({ lines, words, wordArray: dict[list] });
    generateNumbersAndSpecialCharArray(lines);
    setPassphrases(passes);
    setCopied('');
  }, [list, words, lines]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = (text) => (e) => {
    if (copy(text)) setCopied(text);
  };

  return (
    <div>
      <div className="output">
        {passphrases.map((row, rowNumber) => {
          // if in preset1 mode
          // capitalise first letter of each word and add some special chars
          const pass =
            mode === 'preset1'
              ? row.map((s) => capFirstLetter(s)).join(' ') +
                ' ' +
                presetStrings[rowNumber]
              : row.join(' ');

          return (
            <div
              key={rowNumber}
              className={classNames('pointer', { selected: pass === copied })}
              onClick={handleCopy(pass)}
            >
              {pass}
            </div>
          );
        })}
      </div>
      <button
        onClick={() => {
          const passes = generate({ lines, words, wordArray: dict[list] });
          generateNumbersAndSpecialCharArray(lines);
          setPassphrases(passes);
          setCopied('');
        }}
      >
        Regenerate
      </button>
    </div>
  );
};

OutputWords.propTypes = {
  list: PropTypes.string,
  words: PropTypes.number,
  lines: PropTypes.number,
  mode: PropTypes.string,
};

export default OutputWords;
