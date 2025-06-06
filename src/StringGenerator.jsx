import React from 'react';
import { encode } from 'base64-arraybuffer';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import OutputStrings from './OutputStrings';
import { CHARSETS } from './charsets';
import CharsetSelector from './CharsetSelector';
import PasswordSizeSlider from './PasswordSizeSlider';
import CommandLine from './CommandLine';

const rows = 20;

function randomBytes(sizeBytes) {
  if (window.crypto && window.crypto.getRandomValues) {
    const randomBytes = new Uint8Array(sizeBytes);

    // https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues
    return window.crypto.getRandomValues(randomBytes);
  } else {
    throw new Error('Web Crypto API not supported');
  }
}

const StringGenerator = () => {
  // Support multiple charsets, not just Base64
  const [charsetKey, setCharsetKey] = React.useState('websafe');
  const [sizeBytes, setSizeBytes] = React.useState(
    config.defaults?.passwordBytes ?? 10
  );
  const [output, setOutput] = React.useState([]);

  // Find selected charset
  const selectedCharset = CHARSETS.find((c) => c.key === charsetKey);

  // Generate random string for a given charset
  function getRandomString(length, charset) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    const chars = [];
    for (let i = 0; i < length; ++i) {
      chars.push(charset[arr[i] % charset.length]);
    }
    return chars.join('');
  }

  const generate = React.useCallback(() => {
    let values;
    if (charsetKey === 'base64') {
      // Use base64-arraybuffer for base64
      const bytes = new Array(rows).fill(0).map((v) => randomBytes(sizeBytes));
      values = bytes.map((a) => encode(a).replace(/=+$/, ''));
    } else {
      // For other charsets, generate random string of appropriate length
      // 1 char per ~log2(charset.length) bits
      const charsNeeded = Math.ceil(
        (sizeBytes * 8) / Math.log2(selectedCharset.charset.length)
      );
      values = new Array(rows)
        .fill(0)
        .map(() => getRandomString(charsNeeded, selectedCharset.charset));
    }
    setOutput(values);
  }, [charsetKey, sizeBytes, selectedCharset]);

  React.useEffect(() => {
    generate();
  }, [sizeBytes, charsetKey, generate]);

  return (
    <div>
      <div className="ui container">
        <div className="col inputs">
          <PasswordSizeSlider sizeBytes={sizeBytes} onChange={setSizeBytes} />
          <CharsetSelector
            charsets={CHARSETS}
            selectedKey={charsetKey}
            onChange={setCharsetKey}
            hideLabel={true}
          />
        </div>
        <div className="col col-output">
          <OutputStrings values={output} />
          <button
            onClick={() => {
              setOutput([]);
              generate();
            }}
          >
            Regenerate
          </button>
        </div>
        <div className="col col-crack-time">
          <EstimateCrackingTime bits={sizeBytes * 8} type="brute force" />
        </div>
      </div>
      <div className="command-line">
        <CommandLine charsetKey={charsetKey} bits={sizeBytes * 8} />
      </div>
    </div>
  );
};

export default StringGenerator;
