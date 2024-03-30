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

const UI = ({ stupidMode }) => {
  const navigate = useNavigate();
  const params = useParams();

  // route format:
  //
  //   /:words/:passphrases/:wordList
  //   /:words/:passphrases/:wordList/stupid

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
      stupidMode,
      ...params,
    };

    // calculate new path string
    const path = `${newState.stupidMode === true ? '/stupid' : ''}/${
      newState.wordsPerPassphrase
    }/${newState.numberOfPassphrases}/${newState.wordList}`;

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
  if (stupidMode) entropyBits += 14;

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

        <p>Stupid mode</p>
        <label htmlFor="stupid-enable">
          <input
            type="checkbox"
            id="stupid-enable"
            checked={stupidMode}
            onChange={(e) => {
              if (e.target.checked) {
                // turn on stupid mode
                setParamsAndNavigate({
                  stupidMode: e.target.checked,
                  wordsPerPassphrase: 2,
                });
              } else {
                // turn off stupid mode
                setParamsAndNavigate({ stupidMode: e.target.checked });
              }
            }}
          />{' '}
          Enable with 2 words
        </label>

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
          stupidMode={stupidMode}
        />
      </div>

      <div className="col col-crack-time">
        <EstimateCrackingTime bits={entropyBits} />
      </div>
    </div>
  );
};

UI.propTypes = {
  stupidMode: PropTypes.bool,
};

UI.defaultProps = {
  stupidMode: false,
};

export default UI;
