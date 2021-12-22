/* eslint-disable no-unused-vars */
import React from 'react';
import { encode, decode } from 'base64-arraybuffer';
import randomBytes from 'randombytes';
import EstimateCrackingTime from './EstimateCrackingTime';
import OutputBase64 from './OutputBase64';
import config from './config';

const rows = 20;

const UIBase64 = () => {
  // currently only supports Base64 strings, might add some other options later
  const [mode, setMode] = React.useState('base64');
  const [sizeBytes, setSizeBytes] = React.useState(
    config.defaults.base64Bytes || 10
  );
  const [output, setOutput] = React.useState([]);

  const generate = React.useCallback(() => {
    const bytes = new Array(rows).fill(0).map((v) => randomBytes(sizeBytes));
    switch (mode) {
      case 'base64':
        setOutput(bytes.map((a) => encode(a).replace(/=+$/, '')));
        break;
      default:
        break;
    }
  }, [mode, sizeBytes]);

  React.useEffect(() => {
    generate();
  }, [sizeBytes, generate]);

  return (
    <div className="base64">
      <div className="flex">
        <div className="grow">
          <p>
            Generate random{' '}
            <a href="https://en.wikipedia.org/wiki/Base64">Base64</a> strings.
            Click line to copy to clipboard.
          </p>
          <div className="base64-input">
            <span
              className="base64-generate"
              role="button"
              onClick={(e) => generate()}
            >
              ↻
            </span>
            <input
              type="range"
              min="8"
              max="30"
              value={sizeBytes}
              onChange={(e) => {
                setSizeBytes(parseInt(e.target.value, 10));
              }}
            />
            <span className="bits">
              {sizeBytes * 8 < 100 && <>&nbsp;</>}
              {sizeBytes * 8}
              &nbsp;
              <a href="https://en.wikipedia.org/wiki/Password_strength">bits</a>
            </span>
          </div>
          <OutputBase64 values={output} />
        </div>
        <div className="">
          <EstimateCrackingTime bits={sizeBytes * 8} />
        </div>
      </div>
    </div>
  );
};

export default UIBase64;
