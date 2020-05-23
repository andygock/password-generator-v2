import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import NumberPicker from './NumberPicker';
import WordListRadio from './WordListRadio';
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
      <header className="App-header">
        <h1>Password Generator</h1>
      </header>

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

      <Output
        words={wordsPerPassphrase}
        lines={numberOfPassphrases}
        list={wordlist}
      />
    </div>
  );
};

export default App;
