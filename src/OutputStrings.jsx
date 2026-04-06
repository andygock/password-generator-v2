import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';

const OutputStrings = ({ values = [] }) => {
  const [copied, setCopied] = React.useState('');
  const [copyNotify, setCopyNotify] = React.useState(false);
  const copyTimeoutRef = React.useRef(null);

  const handleCopy = (text) => () => {
    if (copy(text)) {
      setCopied(text);

      // copy notification
      setCopyNotify(true);
      // clear previous timeout, schedule hide
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => {
        setCopyNotify(false);
        copyTimeoutRef.current = null;
      }, 500);
    }
  };

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

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

export default OutputStrings;
