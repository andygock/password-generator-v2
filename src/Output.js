import React from 'react';
import PropTypes from 'prop-types';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';
import dict from './words';

const Output = ({ list, words, lines }) => {
  const [copied, setCopied] = React.useState('');
  const [rows, setRows] = React.useState([]);

  const generate = () => {
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

    setRows(rows);
    setCopied('');
  };

  React.useEffect(() => {
    generate();
  }, [list, words, lines]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = () => {
    // copy passphrase to clipboard
  };

  const handleCopy = (text, result) => {
    if (result) {
      setCopied(text);
    }
  };

  return (
    <div className="">
      <button
        onClick={() => {
          generate();
        }}
      >
        Regenerate
      </button>
      {copied !== '' && <span>*copied to clipboard*</span>}
      {rows.map((row, rowNumber) => {
        const pass = row.join(' ');
        return (
          <CopyToClipboard key={rowNumber} text={pass} onCopy={handleCopy}>
            <div
              className={classNames('pointer', { selected: pass === copied })}
            >
              <span>{pass}</span>
            </div>
          </CopyToClipboard>
        );
      })}
    </div>
  );
};

Output.propTypes = {
  list: PropTypes.string,
  words: PropTypes.number,
  lines: PropTypes.number,
};

export default Output;
