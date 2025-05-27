import { HashRouter, Route, Routes } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import CommandLineGenerator from './CommandLineGenerator';
import Footer from './Footer';
import DictionaryGenerator from './DictionaryGenerator';
import StringGenerator from './StringGenerator';
import Menu from './Menu';

const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <header>
          <div>
            <strong>Password Generator</strong> - Generate random passphrases in
            the browser. Click line to copy passphrase to clipboard.
          </div>
          <Menu />
        </header>
        <Routes>
          <Route exact path="/" element={<DictionaryGenerator />} />
          <Route exact path="/string" element={<StringGenerator />} />
          <Route exact path="/cli" element={<CommandLineGenerator />} />
          <Route
            exact
            path="/preset1/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<DictionaryGenerator mode="preset1" />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<DictionaryGenerator mode="normal" />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase/:numberOfPassphrases"
            element={<DictionaryGenerator mode="normal" />}
          />
          <Route
            exact
            path="/:wordsPerPassphrase"
            element={<DictionaryGenerator />}
          />
        </Routes>
        <Footer />
      </HashRouter>
    </div>
  );
};

export default App;
