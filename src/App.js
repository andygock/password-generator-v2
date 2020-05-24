import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import NumberPicker from './NumberPicker';
import WordListRadio from './WordListRadio';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import Output from './Output';

const defaults = {
  words: 6,
  lines: 10,
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
        <h1>Password Generator</h1>
      </header>

      <div className="container">
        <div className="col">
          <h3>Number of words per passphrase</h3>
          <NumberPicker
            onChange={(val) => setWordsPerPassphrase(val)}
            value={wordsPerPassphrase}
          />

          <h3>Number of passphrases</h3>
          <NumberPicker
            onChange={(val) => setNumberOfPassphrases(val)}
            value={numberOfPassphrases}
          />

          <h3>Word list</h3>
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
