import React from 'react';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import Output from './Output';
import WordListRadio from './WordListRadio';
import dict from './words';

const defaults = {
  words: 6,
  lines: 20,
  list: 'eff-long',
};

const UI = () => {
  const [wordsPerPassphrase, setWordsPerPassphrase] = React.useState(
    defaults.words
  );
  const [numberOfPassphrases, setNumberOfPassphrases] = React.useState(
    defaults.lines
  );
  const [wordlist, setWordlist] = React.useState(defaults.list);

  const [stupidMode, setStupidMode] = React.useState(false);

  const handleReset = () => {
    setWordsPerPassphrase(defaults.words);
    setNumberOfPassphrases(defaults.lines);
    setWordlist(defaults.list);
    setStupidMode(false);
  };

  let entropyBits = Math.floor(
    Math.log(dict[wordlist].length ** wordsPerPassphrase) / Math.log(2)
  );
  if (stupidMode) entropyBits += 14;

  return (
    <div className="container">
      <div className="col inputs">
        <p>Number of words per passphrase</p>
        <NumberPicker
          onChange={(val) => setWordsPerPassphrase(val)}
          value={wordsPerPassphrase}
        />
        <p>Number of passphrases</p>
        <NumberPicker
          onChange={(val) => setNumberOfPassphrases(val)}
          value={numberOfPassphrases}
        />
        <p>Word list</p>
        <WordListRadio value={wordlist} onChange={setWordlist} />

        <p>Stupid mode</p>
        <label htmlFor="stupid-enable">
          <input
            type="checkbox"
            id="stupid-enable"
            checked={stupidMode}
            onChange={(e) => {
              if (e.target.checked) setWordsPerPassphrase(2);
              setStupidMode(e.target.checked);
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
          Dictionary size is {dict[wordlist].length} words.
        </p>
        <div>
          <button onClick={handleReset}>Reset to defaults</button>
        </div>
      </div>

      <div className="col col-output">
        <Output
          words={wordsPerPassphrase}
          lines={numberOfPassphrases}
          list={wordlist}
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
