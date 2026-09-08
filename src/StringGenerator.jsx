import { Navigate, useSearchParams } from 'react-router-dom';
import config from './config';
import EstimateCrackingTime from './EstimateCrackingTime';
import OutputStrings from './OutputStrings';
import { CHARSETS } from './charsets';
import CharsetSelector from './CharsetSelector';
import PasswordSizeSlider from './PasswordSizeSlider';
import CommandLine from './CommandLine';
import { generateStrings } from './stringGeneration';
import useGeneratedValues from './useGeneratedValues';
import { normaliseStringParams } from './routeParams';
import { formatEntropy, stringMetrics } from './entropy';
import ui from './ui.module.css';

const rows = config.defaults.numberOfPassphrases;

function StringOutput({ sizeBytes, charset }) {
  const { values, error, regenerate } = useGeneratedValues(() =>
    generateStrings({ rows, sizeBytes, charset })
  );

  return (
    <section className={ui.panel} aria-label="Passwords">
      <div className={ui.panelHeader}>
        <h2>
          Passwords <span className={ui.badge}>{rows}</span>
        </h2>
        <button type="button" className={ui.primary} onClick={regenerate}>
          Regenerate
        </button>
      </div>
      {error && (
        <p className={ui.error} role="alert">
          {error}
        </p>
      )}
      <OutputStrings values={values} />
    </section>
  );
}

export default function StringGenerator() {
  const [params, setParams] = useSearchParams();
  const { sizeBytes, charsetKey } = normaliseStringParams(params);
  const charset = CHARSETS.find(({ key }) => key === charsetKey);
  const { length, bits } = stringMetrics(sizeBytes, charset);

  const nextParams = (values) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values))
      next.set(key, String(value));
    return next;
  };
  const malformed =
    (params.has('bytes') && params.get('bytes') !== String(sizeBytes)) ||
    (params.has('charset') && params.get('charset') !== charsetKey);
  if (malformed)
    return (
      <Navigate
        to={`/string?${nextParams({ bytes: sizeBytes, charset: charsetKey })}`}
        replace
      />
    );

  return (
    <div>
      <div className={ui.layout}>
        <section className={ui.panel} aria-label="String settings">
          <div className={ui.panelHeader}>
            <h2>Configuration</h2>
            <span className={ui.badge}>String</span>
          </div>
          <div className={`${ui.body} ${ui.stack}`}>
            <PasswordSizeSlider
              sizeBytes={sizeBytes}
              onChange={(bytes) =>
                setParams(nextParams({ bytes }), { replace: true })
              }
            />
            <CharsetSelector
              charsets={CHARSETS}
              selectedKey={charsetKey}
              onChange={(charset) => setParams(nextParams({ charset }))}
            />
            <div className={ui.metrics}>
              <div className={ui.metric}>
                <span className={ui.muted}>Actual entropy</span>
                <strong>
                  {formatEntropy(bits)} <small>bits</small>
                </strong>
              </div>
              <div className={ui.metric}>
                <span className={ui.muted}>Length</span>
                <strong>
                  {length} <small>chars</small>
                </strong>
              </div>
            </div>
            <p className={ui.muted}>
              Whole characters meet or exceed your entropy target. Base64
              encodes random bytes.
            </p>
            <button type="button" onClick={() => setParams({})}>
              Reset to defaults
            </button>
            <p className={ui.muted}>
              Bookmark this page to save your settings.
            </p>
          </div>
        </section>
        {/* A new configuration cannot display or copy the previous passwords. */}
        <StringOutput
          key={`${charsetKey}:${sizeBytes}`}
          sizeBytes={sizeBytes}
          charset={charset}
        />
        <EstimateCrackingTime bits={bits} type="brute force" />
      </div>
      <CommandLine charsetKey={charsetKey} bits={sizeBytes * 8} />
    </div>
  );
}
