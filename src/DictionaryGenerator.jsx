import { Navigate, useNavigate, useParams } from 'react-router-dom';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import NumberPicker from './NumberPicker';
import WordListOutput from './WordListOutput';
import WordListRadio from './WordListRadio';
import { presetExtraEntropyBits } from './random';
import { getWordListOption } from './words';
import { formatEntropy } from './entropy';
import {
  generatePath,
  normaliseParams,
  needsCanonicalPath,
} from './routeParams';
import ui from './ui.module.css';

export default function DictionaryGenerator({ mode }) {
  const navigate = useNavigate();
  const params = useParams();
  const activeMode = mode ?? config.defaults.mode;
  const normalised = normaliseParams(params, activeMode);
  const { wordsPerPassphrase, numberOfPassphrases, wordList } = normalised;

  if (needsCanonicalPath(params, normalised)) {
    return <Navigate to={generatePath(normalised)} replace />;
  }

  // Prioritise supplied settings, preserving the rest of the current bookmark.
  const setParamsAndNavigate = (next) =>
    navigate(generatePath({ ...normalised, ...next }));
  const dictLen = getWordListOption(wordList).count;
  const entropyBits =
    wordsPerPassphrase * Math.log2(dictLen) +
    (activeMode === 'preset1' ? presetExtraEntropyBits() : 0);

  return (
    <div className={ui.layout}>
      <section className={ui.panel} aria-label="Dictionary settings">
        <div className={ui.panelHeader}>
          <h2>Configuration</h2>
          <span className={ui.badge}>Dictionary</span>
        </div>
        <div className={`${ui.body} ${ui.stack}`}>
          <NumberPicker
            label="Words per passphrase"
            value={wordsPerPassphrase}
            {...config.limits.wordsPerPassphrase}
            onChange={(wordsPerPassphrase) =>
              setParamsAndNavigate({ wordsPerPassphrase })
            }
          />
          <NumberPicker
            label="Number of passphrases"
            value={numberOfPassphrases}
            {...config.limits.numberOfPassphrases}
            onChange={(numberOfPassphrases) =>
              setParamsAndNavigate({ numberOfPassphrases })
            }
          />
          <WordListRadio
            value={wordList}
            onChange={(wordList) => setParamsAndNavigate({ wordList })}
          />
          <fieldset className={ui.field}>
            <legend>Format</legend>
            <label className={ui.option}>
              <input
                type="radio"
                name="preset"
                checked={activeMode === 'normal'}
                onChange={() => setParamsAndNavigate({ mode: 'normal' })}
              />
              Words with spaces
            </label>
            <label className={ui.option}>
              <input
                type="radio"
                name="preset"
                checked={activeMode === 'preset1'}
                onChange={() => setParamsAndNavigate({ mode: 'preset1' })}
              />
              Capitalised + number + symbol
            </label>
          </fieldset>
          <div className={ui.metrics}>
            <div className={ui.metric}>
              <span className={ui.muted}>Entropy / phrase</span>
              <strong>
                {formatEntropy(entropyBits)} <small>bits</small>
              </strong>
            </div>
            <div className={ui.metric}>
              <span className={ui.muted}>Dictionary size</span>
              <strong>{dictLen.toLocaleString('en-AU')}</strong>
            </div>
          </div>
          <button type="button" onClick={() => navigate('/')}>
            Reset to defaults
          </button>
          <p className={ui.muted}>Bookmark this page to save your settings.</p>
        </div>
      </section>
      <WordListOutput
        key={wordList}
        wordList={wordList}
        words={wordsPerPassphrase}
        lines={numberOfPassphrases}
        mode={activeMode}
      />
      <EstimateCrackingTime bits={entropyBits} />
    </div>
  );
}
