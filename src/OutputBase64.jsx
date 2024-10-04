import React from 'react';

import PropTypes from 'prop-types';

import CopiedToClipboard from './CopiedToClipboard';

const OutputBase64 = ({ values = [] }) => {
  const [copiedText, setCopiedText] = React.useState('');

  // copy string to clipboard
  const copy = (str) => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopiedText(str);
  };

  const copyHandler = (str) => (e) => {
    copy(str);
  };

  return (
    <>
      <div className="base64-output">
        {values.map((v, index) => (
          <span key={index} onClick={copyHandler(v)} className="password">
            {v}
          </span>
        ))}
      </div>
      <CopiedToClipboard text={copiedText} />
    </>
  );
};

OutputBase64.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
};

export default OutputBase64;
