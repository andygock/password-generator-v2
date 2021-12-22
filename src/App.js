import React from 'react';
import { HashRouter, Routes, Route, Switch } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.scss';
import UI from './UI';
import UIBase64 from './UIBase64';
import Footer from './Footer';

const Hello = () => 'Hello';

const App2 = () => {
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
          <Route path="/" element={<Hello />} />
        </Routes>
        <Footer />
      </HashRouter>
      <a
        className="github-fork-ribbon right-bottom fixed"
        href="https://github.com/andygock/password-generator-v2"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
    </div>
  );
};

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
            element={<UI stupidMode />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<UI />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases"
            element={<UI />}
          />
          <Route exact path="/:wordsPerPassphrase" element={<UI />} />
        </Routes>
        <Footer />
      </HashRouter>
      <a
        className="github-fork-ribbon right-bottom fixed"
        href="https://github.com/andygock/password-generator-v2"
        data-ribbon="Fork me on GitHub"
        title="Fork me on GitHub"
      >
        Fork me on GitHub
      </a>
    </div>
  );
};

export default App;
