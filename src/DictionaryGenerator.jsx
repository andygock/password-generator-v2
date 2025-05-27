import PropTypes from 'prop-types';
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
  wordsPerPassphrase = 6,
  numberOfPassphrases = 20,
  wordList = 'eff-long',
  mode = 'normal',
}) {
  // if no words, passphrases, or wordlist, assume defaults
  // setting default not supported yet
  const path = `${
    mode === 'preset1' ? '/preset1' : ''
  }/${wordsPerPassphrase}/${numberOfPassphrases}/${wordList}`;
  return path;
}

const DictionaryGenerator = ({ mode }) => {
  const navigate = useNavigate();
  const params = useParams();

  // convert params to numbers when we need to, or set default values if not set
  const wordsPerPassphrase = parseInt(
    params.wordsPerPassphrase || config.defaults.wordsPerPassphrase,
    10
  );
  const numberOfPassphrases = parseInt(
    params.numberOfPassphrases || config.defaults.numberOfPassphrases,
    10
  );
  const wordList = params.wordList || config.defaults.wordList;

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

  let entropyBits = Math.floor(
    Math.log(dict[wordList].length ** wordsPerPassphrase) / Math.log(2)
  );

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
        />

        <h3>Number of passphrases</h3>
        <NumberPicker
          onChange={(numberOfPassphrases) => {
            setParamsAndNavigate({ numberOfPassphrases });
          }}
          value={numberOfPassphrases}
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
          <button onClick={handleReset}>Reset to defaults</button>
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

DictionaryGenerator.propTypes = {
  mode: PropTypes.string,
};

export default DictionaryGenerator;
