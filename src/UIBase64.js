/* eslint-disable no-unused-vars */
import React from 'react';
import Base64 from 'base64-arraybuffer';
import randomBytes from 'randombytes';

const rows = 20;

const Output = ({ values }) => {
  // copy string to clipboard
  const copy = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };

  const copyHandler = (str) => (e) => {
    copy(str);
  };

  return (
    <div className="base64-output">
      {values.map((v, index) => (
        <span key={index} onClick={copyHandler(v)} className="password">
          {v}
        </span>
      ))}
    </div>
  );
};

const UIBase64 = () => {
  // currently only supports Base64 strings, might add some other options later
  const [mode, setMode] = React.useState('base64');
  const [sizeBytes, setSizeBytes] = React.useState(16);
  const [output, setOutput] = React.useState([]);

  const generate = React.useCallback(() => {
    const bytes = new Array(rows).fill(0).map((v) => randomBytes(sizeBytes));
    switch (mode) {
      case 'base64':
        setOutput(bytes.map((a) => Base64.encode(a).replace(/=+$/, '')));
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
      <p>
        Generate random{' '}
        <a href="https://en.wikipedia.org/wiki/Base64">Base64</a> strings. Click
        line to copy to clipboard.
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
      <Output values={output} />
    </div>
  );
};

export default UIBase64;
