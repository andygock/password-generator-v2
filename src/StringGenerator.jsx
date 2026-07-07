import React from 'react';
import { encode } from 'base64-arraybuffer';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import OutputStrings from './OutputStrings';
import { CHARSETS } from './charsets';
import CharsetSelector from './CharsetSelector';
import PasswordSizeSlider from './PasswordSizeSlider';
import CommandLine from './CommandLine';
import { randomBytes, getRandomString } from './random';

const rows = config.defaults.numberOfPassphrases;

const StringGenerator = () => {
  // Support multiple charsets, not just Base64
  const [charsetKey, setCharsetKey] = React.useState(
    config.defaults?.charsetKey || 'websafe'
  );
  const [sizeBytes, setSizeBytes] = React.useState(
    config.defaults?.passwordBytes ?? 10
  );
  const [output, setOutput] = React.useState([]);
  const [error, setError] = React.useState('');

  // Find selected charset with fallback
  const selectedCharset =
    CHARSETS.find((c) => c.key === charsetKey) || CHARSETS[0];
  const generatedLength = output[0]?.length || 0;

  // Generate random string for a given charset (shared helper)

  const generate = React.useCallback(() => {
    try {
      let values;
      if (charsetKey === 'base64') {
        // Use base64-arraybuffer for base64
        const bytes = new Array(rows).fill(0).map(() => randomBytes(sizeBytes));
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
      setError('');
      setOutput(values);
    } catch (e) {
      setOutput([]);
      setError(e instanceof Error ? e.message : 'Unable to generate password');
    }
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
          <p className="muted">Generated length: {generatedLength} characters</p>
        </div>
        <div className="col col-output">
          {error && (
            <div className="notify" role="alert">
              {error}
            </div>
          )}
          <OutputStrings values={output} />
          <button
            type="button"
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
