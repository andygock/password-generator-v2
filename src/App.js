import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import NumberPicker from './NumberPicker';
import WordListRadio from './WordListRadio';
import EstimateCrackingTime from './EstimateCrackingTime';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import Output from './Output';
import dict from './words';

const defaults = {
  words: 6,
  lines: 20,
  list: 'eff-long',
};

const baseLog = (base, val) => Math.log(val) / Math.log(base);

const App = () => {
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
    <div className="App">
      <header>
        <p>
          <strong>Password Generator</strong> - Generate random passphrases in
          the browser. Click line to copy passphrase to clipboard.
        </p>
      </header>

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

      <footer>
        <p>
          Runs entirely in the web browser using{' '}
          <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
            Web Crypto API
          </a>{' '}
          and{' '}
          <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases">
            EFF word lists
          </a>
          . Passphrases are not stored or transmitted. Source code is available
          on{' '}
          <a href="https://github.com/andygock/password-generator-v2">GitHub</a>{' '}
          with MIT License.
        </p>
        <p>
          &copy;
          <a href="https://gock.net/">Andy Gock</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
