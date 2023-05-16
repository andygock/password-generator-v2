import React from 'react';

import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';

import CopiedToClipboard from './CopiedToClipboard';
import dict from './words';

// stupid mode is for use on web sites which enforce password complexity using preset rules
// and forces users to create passwords which are hard to remember and easy to guess

const capFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// return random number between 0 and (2^bits - 1)
const randomNumber = (bits) => {
  const arr = new Uint16Array(1);
  const random = window.crypto.getRandomValues(arr);
  return random[0] % Math.pow(2, bits);
};

const randomSpecialChar = () => {
  // special chars used for stupid mode, adds 1 bit of entropy
  const specialChars = '!?$#$&-.';
  const arr = new Uint16Array(1);
  const random = window.crypto.getRandomValues(arr);
  return specialChars.charAt(random % 8);
};

const Output = ({ list, words, lines, stupidMode }) => {
  const [copied, setCopied] = React.useState('');
  const [passphrases, setPassphrases] = React.useState([]);
  const [stupidStrings, setStupidStrings] = React.useState([]);

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

  const generateStupidString = (bits) => {
    // append some numbers - adds bits of entropy
    // use (bits - 1), as we append randomSpecialChar() after which is 1 bit
    let rand = randomNumber(bits - 1);

    // return stupid string e.g '3564.'
    return rand + randomSpecialChar();
  };

  const generateStupidStringArray = (n) => {
    let res = [];
    for (let i = 0; i < n; i += 1) {
      res.push(generateStupidString(14)); // number of bits to add
    }
    setStupidStrings(res);
  };

  // generate passwords on page load and prop changes
  React.useEffect(() => {
    const passes = generate({ lines, words, wordArray: dict[list] });
    generateStupidStringArray(lines);
    setPassphrases(passes);
    setCopied('');
  }, [list, words, lines]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCopy = (text) => (e) => {
    if (copy(text)) setCopied(text);
  };

  return (
    <div>
      <button
        onClick={() => {
          const passes = generate({ lines, words, wordArray: dict[list] });
          generateStupidStringArray(lines);
          setPassphrases(passes);
          setCopied('');
        }}
      >
        Regenerate
      </button>
      <CopiedToClipboard text={copied} />
      <div className="output">
        {passphrases.map((row, rowNumber) => {
          // if in stupid mode
          // capitalise first letter of each word and add some special chars
          // this adds 14 bits of entropy
          const pass = stupidMode
            ? row.map((s) => capFirstLetter(s)).join('') +
              stupidStrings[rowNumber]
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
    </div>
  );
};

Output.propTypes = {
  list: PropTypes.string,
  words: PropTypes.number,
  lines: PropTypes.number,
  stupidMode: PropTypes.bool,
};

export default Output;
