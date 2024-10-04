import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import Footer from './Footer';
import UI from './UI';
import UIBase64 from './UIBase64';
import CommandLine from './CommandLine';

const App = () => {
  return (
    <div className="App">
      <header>
        <p>
          <strong>Password Generator</strong> - Generate random passphrases in
          the browser. Click line to copy passphrase to clipboard.
        </p>
      </header>

      <HashRouter>
        <Routes>
          <Route exact path="/" element={<UI />} />
          <Route exact path="/base64" element={<UIBase64 />} />
          <Route
            exact
            path="/stupid/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<UI mode="stupid" />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<UI mode="normal" />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases"
            element={<UI mode="normal" />}
          />
          <Route exact path="/:wordsPerPassphrase" element={<UI />} />
        </Routes>
        <CommandLine />
        <Footer />
      </HashRouter>
    </div>
  );
};

export default App;
