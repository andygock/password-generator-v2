import classNames from 'classnames';
import useCopyFeedback from './useCopyFeedback';

const OutputStrings = ({ values = [] }) => {
  const { copied, copyNotify, copyText } = useCopyFeedback();
  const handleCopy = (text) => () => copyText(text, 'Password copied');

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
              aria-label={`Copy password ${index + 1}`}
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
