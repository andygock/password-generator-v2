import { lazy, Suspense } from 'react';
import {
  HashRouter,
  Navigate,
  Route,
  Routes,
  useMatch,
} from 'react-router-dom';
import './App.css';
import styles from './App.module.css';
import Footer from './Footer';
import Menu from './Menu';
import GeneratorErrorBoundary from './GeneratorErrorBoundary';

const DictionaryGenerator = lazy(() => import('./DictionaryGenerator'));
const StringGenerator = lazy(() => import('./StringGenerator'));

function GeneratorRoutes() {
  const isString = useMatch('/string');
  // A failed mode must not trap the other mode behind the same error boundary.
  return (
    <GeneratorErrorBoundary key={isString ? 'string' : 'dictionary'}>
      <Suspense fallback={<p role="status">Loading generator…</p>}>
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </GeneratorErrorBoundary>
  );
}

export default function App() {
  return (
    <div className={styles.app}>
      <HashRouter>
        <header className={styles.header}>
          <div className={styles.brand}>
            <span className={styles.mark} aria-hidden="true">
              #
            </span>
            <div className={styles.brandText}>
              <h1>Password Generator</h1>
              <p className={styles.subtitle}>
                Generate random passphrases in the browser.
              </p>
            </div>
          </div>
          <Menu />
        </header>
        <main>
          <GeneratorRoutes />
        </main>
        <Footer />
      </HashRouter>
    </div>
  );
}
