import classNames from 'classnames';
import copy from 'copy-to-clipboard';
import React from 'react';

const OutputStrings = ({ values = [] }) => {
  const [copied, setCopied] = React.useState('');
  const [copyNotify, setCopyNotify] = React.useState('');
  const copyTimeoutRef = React.useRef(null);

  const handleCopy = (text) => () => {
    const ok = copy(text);
    if (ok) {
      setCopied(text);
      setCopyNotify('Copied');
    } else {
      setCopyNotify('Copy failed');
    }

    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
    }
    copyTimeoutRef.current = setTimeout(() => {
      setCopyNotify('');
      copyTimeoutRef.current = null;
    }, 500);
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
        {values.map((pass, index) => {
          const key = pass || `i-${index}`;
          return (
            <button
              type="button"
              key={key}
              onClick={handleCopy(pass)}
              className={classNames('pointer', {
                selected: pass === copied,
              })}
            >
              {pass}
            </button>
          );
        })}
      </div>
      {copyNotify && (
        <div className="notify" aria-live="polite">
          {copyNotify}
        </div>
      )}
    </div>
  );
};

export default OutputStrings;
