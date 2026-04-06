import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';
import dict from './words';
import { generateWordRows, randomNumber, randomSpecialChar } from './random';

const capFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const OutputWords = ({ list, words, lines, mode }) => {
  const [copied, setCopied] = React.useState('');
  const [passphrases, setPassphrases] = React.useState([]);
  const [presetStrings, setPresetStrings] = React.useState([]);
  const [copyNotify, setCopyNotify] = React.useState(false);

  const generate = ({ lines, words, wordArray }) =>
    generateWordRows({ lines, words, wordArray });

  const generateNumbersAndSpecialChar = (bits) => {
    // append some numbers - adds bits of entropy
    // use (bits - 1), as we append randomSpecialChar() after which is 1 bit
    const rand = randomNumber(bits - 1);
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
  }, [list, words, lines]);

  const handleCopy = (text) => () => {
    if (copy(text)) {
      setCopied(text);

      // copy notification
      setCopyNotify(true);
      setTimeout(() => {
        setCopyNotify(false);
      }, 500);
    }
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
      {copyNotify && <div className="notify">Copied</div>}
    </div>
  );
};

export default OutputWords;
