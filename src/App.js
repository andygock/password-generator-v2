import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import NumberPicker from './NumberPicker';
import WordListRadio from './WordListRadio';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import Output from './Output';

const defaults = {
  words: 6,
  lines: 20,
  list: 'eff-long',
};

const App = () => {
  const [wordsPerPassphrase, setWordsPerPassphrase] = React.useState(
    defaults.words
  );
  const [numberOfPassphrases, setNumberOfPassphrases] = React.useState(
    defaults.lines
  );
  const [wordlist, setWordlist] = React.useState(defaults.list);

  const handleReset = () => {
    setWordsPerPassphrase(defaults.words);
    setNumberOfPassphrases(defaults.lines);
    setWordlist(defaults.list);
  };

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

          <div>
            <button onClick={handleReset}>Reset to defaults</button>
          </div>
        </div>

        <div className="col">
          <Output
            words={wordsPerPassphrase}
            lines={numberOfPassphrases}
            list={wordlist}
          />
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
