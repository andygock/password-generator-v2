import { useEffect, useState } from 'react';
import { loadWordList } from './words';
import OutputWords from './OutputWords';
import ui from './ui.module.css';

// The parent keys this component by dictionary so old errors and results cannot
// leak into a new selection. Cancellation also ignores late download responses.
export default function WordListOutput({ wordList, words, lines, mode }) {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    loadWordList(wordList).then(
      (wordArray) => {
        if (!cancelled) setResult({ status: 'ready', wordArray });
      },
      () => {
        if (!cancelled) setResult({ status: 'error' });
      }
    );
    return () => {
      cancelled = true;
    };
  }, [wordList, attempt]);

  if (result.status === 'loading')
    return (
      <p className={`${ui.panel} ${ui.body}`} role="status">
        Loading word list…
      </p>
    );
  if (result.status === 'error') {
    return (
      <div className={`${ui.panel} ${ui.body}`} role="alert">
        <p>
          Unable to load the word list. Check your connection and try again.
        </p>
        <button
          type="button"
          onClick={() => {
            setResult({ status: 'loading' });
            setAttempt((value) => value + 1);
          }}
        >
          Retry
        </button>
        <button type="button" onClick={() => window.location.reload()}>
          Reload page
        </button>
      </div>
    );
  }
  return (
    <OutputWords
      key={`${words}:${lines}:${mode}`}
      wordArray={result.wordArray}
      words={words}
      lines={lines}
      mode={mode}
    />
  );
}
