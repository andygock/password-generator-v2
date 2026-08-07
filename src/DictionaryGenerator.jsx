import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import OutputWords from './OutputWords';
import WordListRadio from './WordListRadio';
import { presetExtraEntropyBits } from './random';
import { getWordListOption, loadWordList } from './words';

// calculate path based on parameters
function generatePath({
  wordsPerPassphrase,
  numberOfPassphrases,
  wordList,
  mode,
}) {
  // if no words, passphrases, or wordlist, assume defaults
  const wp = wordsPerPassphrase ?? config.defaults.wordsPerPassphrase;
  const np = numberOfPassphrases ?? config.defaults.numberOfPassphrases;
  const wl = wordList ?? config.defaults.wordList;
  const path = `${mode === 'preset1' ? '/preset1' : ''}/${wp}/${np}/${wl}`;
  return path;
}

const DictionaryGenerator = ({ mode }) => {
  const navigate = useNavigate();
  const params = useParams();
  const activeMode = mode ?? config.defaults.mode;
  const [loadedWordList, setLoadedWordList] = useState(null);
  const [wordListError, setWordListError] = useState('');

  // convert params to numbers when we need to, or set default values if not set
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  const rawWp = params.wordsPerPassphrase
    ? parseInt(params.wordsPerPassphrase, 10)
    : NaN;
  let wordsPerPassphrase = Number.isFinite(rawWp)
    ? rawWp
    : config.defaults.wordsPerPassphrase;
  wordsPerPassphrase = clamp(
    wordsPerPassphrase,
    config.limits.wordsPerPassphrase.min,
    config.limits.wordsPerPassphrase.max
  );

  const rawNp = params.numberOfPassphrases
    ? parseInt(params.numberOfPassphrases, 10)
    : NaN;
  let numberOfPassphrases = Number.isFinite(rawNp)
    ? rawNp
    : config.defaults.numberOfPassphrases;
  numberOfPassphrases = clamp(
    numberOfPassphrases,
    config.limits.numberOfPassphrases.min,
    config.limits.numberOfPassphrases.max
  );

  const wordList = getWordListOption(params.wordList)
    ? params.wordList
    : config.defaults.wordList;

  useEffect(() => {
    let cancelled = false;

    loadWordList(wordList)
      .then((words) => {
        if (!cancelled) {
          setLoadedWordList({ id: wordList, words });
          setWordListError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setWordListError(
            error instanceof Error ? error.message : 'Unable to load word list'
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [wordList]);

  // calculate new path, navigate to new path
  const setParamsAndNavigate = (params) => {
    // prioritise arguments, otherwise use params or app defaults set above
    const newState = {
      wordsPerPassphrase,
      numberOfPassphrases,
      wordList,
      mode: activeMode,
      ...params,
    };

    const path = generatePath(newState);
    // console.log('path', path);

    // navigate to new hash path
    navigate(path);
  };

  // reset to default parameters
  const handleReset = () => {
    navigate('/');
  };

  const wordListOption = getWordListOption(wordList);
  const dictLen = wordListOption?.count || 1;
  const wordArray =
    loadedWordList?.id === wordList ? loadedWordList.words : null;
  let entropyBits = Math.floor(wordsPerPassphrase * Math.log2(dictLen));

  if (activeMode === 'preset1') {
    entropyBits += presetExtraEntropyBits();
  }

  return (
    <div className="ui container">
      <div className="col inputs">
        <h3>Words per passphrase</h3>
        <NumberPicker
          onChange={(wordsPerPassphrase) => {
            setParamsAndNavigate({ wordsPerPassphrase });
          }}
          value={wordsPerPassphrase}
          min={config.limits.wordsPerPassphrase.min}
          max={config.limits.wordsPerPassphrase.max}
        />

        <h3>Number of passphrases</h3>
        <NumberPicker
          onChange={(numberOfPassphrases) => {
            setParamsAndNavigate({ numberOfPassphrases });
          }}
          value={numberOfPassphrases}
          min={config.limits.numberOfPassphrases.min}
          max={config.limits.numberOfPassphrases.max}
        />

        <h3>Word list</h3>
        <WordListRadio
          value={wordList}
          onChange={(wordList) => {
            setParamsAndNavigate({ wordList });
          }}
        />

        <h3>Presets</h3>

        {/* option for no presets */}
        <label htmlFor="preset-none">
          <input
            type="radio"
            id="preset-none"
            name="preset"
            checked={activeMode === 'normal'}
            onChange={(e) => {
              if (e.target.checked) {
                setParamsAndNavigate({ mode: 'normal' });
              }
            }}
          />{' '}
          None
        </label>

        {/* presets */}
        <label htmlFor="preset-1">
          <input
            type="radio"
            id="preset-1"
            name="preset"
            checked={activeMode === 'preset1'}
            onChange={(e) => {
              if (e.target.checked) {
                setParamsAndNavigate({ mode: 'preset1' });
              }
            }}
          />{' '}
          Capitalized + number + symbol
        </label>

        {/* extra preset for words with capitalised first letter, spaces, and number plus special char */}
        {/* designed for certain web sites that ask for this */}
        {/* routes to /#/custom1/{a}/{b}/{dict} */}
        {/* TODO */}

        <p className="entropy">
          {entropyBits}{' '}
          <a href="https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength">
            bits of entropy
          </a>{' '}
          per passphrase.
        </p>
        <p className="entropy">Dictionary size: {dictLen}</p>
        <div>
          <button type="button" onClick={handleReset}>
            Reset to defaults
          </button>
        </div>
      </div>

      <div className="col col-output">
        {wordListError ? (
          <div className="notify" role="alert">
            {wordListError}
          </div>
        ) : wordArray ? (
          <OutputWords
            words={wordsPerPassphrase}
            lines={numberOfPassphrases}
            wordArray={wordArray}
            mode={activeMode}
          />
        ) : (
          <p>Loading word list…</p>
        )}
      </div>

      <div className="col col-crack-time">
        <EstimateCrackingTime bits={entropyBits} />
      </div>
    </div>
  );
};

export default DictionaryGenerator;
