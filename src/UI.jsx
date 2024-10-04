import React from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';

import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import Output from './Output';
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
    mode === 'stupid' ? '/stupid' : ''
  }/${wordsPerPassphrase}/${numberOfPassphrases}/${wordList}`;
  return path;
}

const UI = ({ mode }) => {
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

    // calculate new path string
    // /stupid/:words/:passphrases/:wordlist
    const path = generatePath(newState);

    console.log('path', path);

    // navigate to new hash path
    navigate(path);
  };

  const handleChangePreset = (e) => {
    // changing presets will navigate to a new path
  };

  // reset to default parameters
  const handleReset = () => {
    navigate('/');
  };

  let entropyBits = Math.floor(
    Math.log(dict[wordList].length ** wordsPerPassphrase) / Math.log(2)
  );

  if (mode === 'stupid') {
    // the extra bits of entropy are for the digits and special characters
    // 14 bits for the number, 1 bit for the special character
    entropyBits += 15;
  }

  return (
    <div className="ui container">
      <div className="col inputs">
        <p>Number of words per passphrase</p>
        <NumberPicker
          onChange={(wordsPerPassphrase) => {
            setParamsAndNavigate({ wordsPerPassphrase });
          }}
          value={wordsPerPassphrase}
        />

        <p>Number of passphrases</p>
        <NumberPicker
          onChange={(numberOfPassphrases) => {
            setParamsAndNavigate({ numberOfPassphrases });
          }}
          value={numberOfPassphrases}
        />

        <p>Word list</p>
        <WordListRadio
          value={wordList}
          onChange={(wordList) => {
            setParamsAndNavigate({ wordList });
          }}
        />

        <p>Presets</p>

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
            title="2 words + up to 4 digits + 1 special character (not secure), used for some web sites that require this weak method"
            type="radio"
            id="preset-1"
            name="preset"
            checked={mode === 'stupid'}
            onChange={(e) => {
              if (e.target.checked) {
                setParamsAndNavigate({ mode: 'stupid' });
              }
            }}
          />{' '}
          Stupid mode (not secure)
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
        <Output
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

UI.propTypes = {
  mode: PropTypes.string,
};

export default UI;
