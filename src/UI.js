import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import Output from './Output';
import WordListRadio from './WordListRadio';
import dict from './words';

const UI = ({ stupidMode }) => {
  const history = useHistory();

  // route format:
  //   /:words/:passphrases/:wordList
  //   /:words/:passphrases/:wordList/stupid

  // get parameters from router hash
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

  // set route to window.history, based on params
  const setHistory = (params) => {
    const newState = {
      wordsPerPassphrase,
      numberOfPassphrases,
      wordList,
      stupidMode,
      ...params,
    };

    // set new hash path to window.history
    const path = `/${newState.wordsPerPassphrase}/${
      newState.numberOfPassphrases
    }/${newState.wordList}${newState.stupidMode === true ? '/stupid' : ''}`;
    history.replace(path);
  };

  // reset to default parameters
  const handleReset = () => {
    setHistory({
      wordsPerPassphrase: config.defaults.wordsPerPassphrase,
      numberOfPassphrases: config.defaults.numberOfPassphrases,
      wordList: config.defaults.wordList,
      stupidMode: config.defaults.stupidMode,
    });
  };

  let entropyBits = Math.floor(
    Math.log(dict[wordList].length ** wordsPerPassphrase) / Math.log(2)
  );
  if (stupidMode) entropyBits += 14;

  return (
    <div className="container">
      <div className="col inputs">
        <p>Number of words per passphrase</p>
        <NumberPicker
          onChange={(wordsPerPassphrase) => {
            setHistory({ wordsPerPassphrase });
          }}
          value={wordsPerPassphrase}
        />
        <p>Number of passphrases</p>
        <NumberPicker
          onChange={(numberOfPassphrases) => {
            setHistory({ numberOfPassphrases });
          }}
          value={numberOfPassphrases}
        />
        <p>Word list</p>
        <WordListRadio
          value={wordList}
          onChange={(wordList) => {
            setHistory({ wordList });
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
                setHistory({
                  stupidMode: e.target.checked,
                  wordsPerPassphrase: 2,
                });
              } else {
                // turn off stupid mode
                setHistory({ stupidMode: e.target.checked });
              }
            }}
          />{' '}
          Enable with 2 words
        </label>

        <p className="entropy">
          Each passphrase have {entropyBits}{' '}
          <a href="https://en.wikipedia.org/wiki/Password_strength#Entropy_as_a_measure_of_password_strength">
            bits of entropy.
          </a>
        </p>
        <p className="entropy">
          Dictionary size is {dict[wordList].length} words.
        </p>
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

export default UI;
