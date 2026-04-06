import { HashRouter, Route, Routes } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import DictionaryGenerator from './DictionaryGenerator';
import Footer from './Footer';
import Menu from './Menu';
import StringGenerator from './StringGenerator';

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
          <Route path="/" element={<DictionaryGenerator />} />
          <Route path="/string" element={<StringGenerator />} />
          <Route
            path="/preset1/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<DictionaryGenerator mode="preset1" />}
          />
          <Route
            path="/:wordsPerPassphrase/:numberOfPassphrases/:wordList"
            element={<DictionaryGenerator mode="normal" />}
          />
          <Route
            path="/:wordsPerPassphrase/:numberOfPassphrases"
            element={<DictionaryGenerator mode="normal" />}
          />
          <Route
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
