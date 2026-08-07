import { lazy, Suspense } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import '../node_modules/normalize.css/normalize.css';
import './App.css';
import Footer from './Footer';
import Menu from './Menu';

const DictionaryGenerator = lazy(() => import('./DictionaryGenerator'));
const StringGenerator = lazy(() => import('./StringGenerator'));

const App = () => {
  return (
    <div className="App">
      <HashRouter>
        <header>
          <div>
            <strong>Password Generator</strong> - Generate random passphrases
            in the browser. Click a line to copy it.
          </div>
          <Menu />
        </header>
        <Suspense fallback={<p>Loading…</p>}>
          <Routes>
            <Route path="/" element={<DictionaryGenerator mode="normal" />} />
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
              element={<DictionaryGenerator mode="normal" />}
            />
          </Routes>
        </Suspense>
        <Footer />
      </HashRouter>
    </div>
  );
};

export default App;
