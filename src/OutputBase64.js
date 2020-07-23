import PropTypes from 'prop-types';
import React from 'react';

const OutputBase64 = ({ values }) => {
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

OutputBase64.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
};

OutputBase64.defaultProps = {
  values: [],
};

export default OutputBase64;
