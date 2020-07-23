import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.scss';
import UI from './UI';
import UIBase64 from './UIBase64';
import Footer from './Footer';

const App = () => {
  return (
    <div className="App">
      <header>
        <p>
          <strong>Password Generator</strong> - Generate random passphrases in
          the browser. Click line to copy passphrase to clipboard.
        </p>
      </header>

      <Router>
        <Switch>
          <Route exact path="/base64">
            <UIBase64 />
          </Route>

          <Route exact path="/">
            <UI />
          </Route>
          <Route exact path="/dict">
            <UI />
          </Route>
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
          >
            <UI stupidMode={false} />
          </Route>
          <Route
            exact
            path="/dict/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
          >
            <UI stupidMode={false} />
          </Route>
          <Route exact path="/:wordsPerPassphrase/:numberOfPassphrases">
            <UI stupidMode={false} />
          </Route>
          <Route exact path="/dict/:wordsPerPassphrase/:numberOfPassphrases">
            <UI stupidMode={false} />
          </Route>
          <Route exact path="/:wordsPerPassphrase">
            <UI stupidMode={false} />
          </Route>
          <Route exact path="/dict/:wordsPerPassphrase">
            <UI stupidMode={false} />
          </Route>
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList/stupid"
          >
            <UI stupidMode={true} />
          </Route>

          <Route
            exact
            path="/dict/:wordsPerPassphrase/:numberOfPassphrases/:wordList/stupid"
          >
            <UI stupidMode={true} />
          </Route>
        </Switch>
        <Footer />
      </Router>
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
