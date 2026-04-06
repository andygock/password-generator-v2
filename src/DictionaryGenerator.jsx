import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import OutputWords from './OutputWords';
import WordListRadio from './WordListRadio';
import dict from './words';

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

  const wordList = dict[params.wordList]
    ? params.wordList
    : config.defaults.wordList;

  // calculate new path, navigate to new path
  const setParamsAndNavigate = (params) => {
    // prioritise arguments, otherwise use params or app defaults set above
    const newState = {
      wordsPerPassphrase,
      numberOfPassphrases,
      wordList,
      mode,
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

  const dictArray = dict[wordList] || dict[config.defaults.wordList] || [];
  const dictLen = dictArray.length || 1;
  let entropyBits = Math.floor(wordsPerPassphrase * Math.log2(dictLen));

  if (mode === 'preset1') {
    // the extra bits of entropy are for the digits and special characters
    // 14 bits for the number
    // 1 bit for the special character
    entropyBits += 15;
  }

  return (
    <div className="ui container">
      <div className="col inputs">
        <h3>Number of words per passphrase</h3>
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
            checked={mode === 'normal'}
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
            checked={mode === 'preset1'}
            onChange={(e) => {
              if (e.target.checked) {
                setParamsAndNavigate({ mode: 'preset1' });
              }
            }}
          />{' '}
          Preset 1
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
        <p className="entropy">Dictionary size: {dict[wordList].length}</p>
        <div>
          <button type="button" onClick={handleReset}>
            Reset to defaults
          </button>
        </div>
      </div>

      <div className="col col-output">
        <OutputWords
          words={wordsPerPassphrase}
          lines={numberOfPassphrases}
          list={wordList}
          mode={mode}
        />
      </div>

      <div className="col col-crack-time">
        <EstimateCrackingTime bits={entropyBits} />
      </div>
    </div>
  );
};

export default DictionaryGenerator;
