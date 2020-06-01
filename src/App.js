import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import UI from './UI';

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
          <Route exact path="/">
            <UI />
          </Route>
        </Switch>
      </Router>

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
