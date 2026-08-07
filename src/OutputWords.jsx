import classNames from 'classnames';
import React from 'react';
import config from './config';
import {
  PRESET_NUMBER_BITS,
  generateWordRows,
  randomNumber,
  randomSpecialChar,
} from './random';
import useCopyFeedback from './useCopyFeedback';

const capFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const generatePresetStrings = (count) => {
  const values = [];
  for (let index = 0; index < count; index += 1) {
    values.push(randomNumber(PRESET_NUMBER_BITS) + randomSpecialChar());
  }
  return values;
};

const OutputWords = ({ wordArray, words, lines, mode }) => {
  const [passphrases, setPassphrases] = React.useState([]);
  const [presetStrings, setPresetStrings] = React.useState([]);
  const [error, setError] = React.useState('');
  const { copied, copyNotify, copyText, resetCopied } = useCopyFeedback();

  const regenerate = React.useCallback(() => {
    const clamp = (v, min, max) =>
      Math.max(min, Math.min(max, Number(v) || min));
    const safeWords = clamp(
      words,
      config.limits.wordsPerPassphrase.min,
      config.limits.wordsPerPassphrase.max
    );
    const safeLines = clamp(
      lines,
      config.limits.numberOfPassphrases.min,
      config.limits.numberOfPassphrases.max
    );

    try {
      const passes = generateWordRows({
        lines: safeLines,
        words: safeWords,
        wordArray,
      });
      setPresetStrings(generatePresetStrings(safeLines));
      setPassphrases(passes);
      setError('');
      resetCopied();
    } catch (e) {
      setPassphrases([]);
      setPresetStrings([]);
      setError(
        e instanceof Error ? e.message : 'Unable to generate passphrase'
      );
    }
  }, [wordArray, words, lines, resetCopied]);

  // generate passwords on page load and prop changes
  React.useEffect(() => {
    regenerate();
  }, [regenerate]);

  const formatPassphrase = (row, rowNumber) =>
    mode === 'preset1'
      ? row.map((s) => capFirstLetter(s)).join('') + presetStrings[rowNumber]
      : row.join(' ');

  const handleCopy = (text) => () => copyText(text, 'Passphrase copied');

  return (
    <div>
      <div className="output">
        {passphrases.map((row, rowNumber) => {
          const pass = formatPassphrase(row, rowNumber);

          return (
            <button
              type="button"
              key={rowNumber}
              className={classNames('pointer', { selected: pass === copied })}
              onClick={handleCopy(pass)}
              aria-label={`Copy passphrase ${rowNumber + 1}`}
            >
              {pass}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={regenerate}
      >
        Regenerate
      </button>
      {error && (
        <div className="notify" role="alert">
          {error}
        </div>
      )}
      {copyNotify && (
        <div className="notify" aria-live="polite">
          {copyNotify}
        </div>
      )}
    </div>
  );
};

export default OutputWords;
