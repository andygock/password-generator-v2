import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import PropTypes from 'prop-types';
import React from 'react';

const OutputStrings = ({ values = [] }) => {
  const [copied, setCopied] = React.useState('');
  const [copyNotify, setCopyNotify] = React.useState(false);

  const handleCopy = (text) => (e) => {
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
      {copyNotify && <div className="notify">Copied</div>}
    </div>
  );
};

OutputStrings.propTypes = {
  values: PropTypes.arrayOf(PropTypes.string),
};

export default OutputStrings;
