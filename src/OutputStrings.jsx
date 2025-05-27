import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import React from 'react';
import CopiedToClipboard from './CopiedToClipboard';

const OutputStrings = ({ values = [] }) => {
  const [copied, setCopied] = React.useState('');

  const handleCopy = (text) => (e) => {
    if (copy(text)) setCopied(text);
  };

  return (
    <div>
      <CopiedToClipboard text={copied} />
      <div className="output">
        {values.map((pass, index) => (
          <div
            key={index}
            onClick={handleCopy(pass)}
            className={classNames('pointer', {
              selected: pass === copied,
            })}
          >
            {pass}
          </div>
        ))}
      </div>
    </div>
  );
};

OutputStrings.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
};

export default OutputStrings;
