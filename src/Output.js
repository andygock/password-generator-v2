import React from 'react';
import PropTypes from 'prop-types';
import copy from 'copy-to-clipboard';
import classNames from 'classnames';
import dict from './words';
import CopiedToClipboard from './CopiedToClipboard';

const Output = ({ list, words, lines }) => {
  const [copied, setCopied] = React.useState('');
  const [passphrases, setPassphrases] = React.useState([]);

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

  React.useEffect(() => {
    const passes = generate({ lines, words, wordArray: dict[list] });
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
          setPassphrases(passes);
          setCopied('');
        }}
      >
        Regenerate
      </button>
      <CopiedToClipboard text={copied} />
      <div className="code">
        {passphrases.map((row, rowNumber) => {
          const pass = row.join(' ');
          return (
            <div
              key={pass}
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
};

export default Output;
