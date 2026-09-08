import prettyMilliseconds from 'pretty-ms';
import { memo, useId, useState } from 'react';
import { benchmarks, BENCHMARK_SOURCE } from './benchmarks';
import { formatEntropy } from './entropy';
import ui from './ui.module.css';
import styles from './EstimateCrackingTime.module.css';

// Age of the universe in milliseconds. Cap the display, not the entropy input.
const MILLISECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
const msAgeOfUniverse = 13.8e9 * MILLISECONDS_PER_YEAR;
const prettyTime = (ms) => {
  if (ms > msAgeOfUniverse) return '> age of universe';
  if (ms < 1000) return '< 1 second';
  return prettyMilliseconds(ms, { compact: true, verbose: true });
};

const computeProfiles = [
  {
    key: 'single-5090',
    label: '1 × RTX 5090',
    multiplier: 1,
    description: 'Uses the listed single-GPU RTX 5090 hashcat benchmark rates.',
  },
  {
    key: 'world-compute',
    label: '100 million ×',
    multiplier: 100_000_000,
    description:
      'Hypothetical compute profile: 100,000,000 times the single-GPU rate. This is not a measurement of global computing capacity.',
  },
];

export default memo(function EstimateCrackingTime({
  bits,
  type = 'dictionary',
}) {
  const id = useId();
  const [tooltip, setTooltip] = useState(null);
  const [computeProfileKey, setComputeProfileKey] = useState('single-5090');
  const profile = computeProfiles.find(({ key }) => key === computeProfileKey);
  return (
    <section className={ui.panel} aria-label="Cracking estimates">
      <div className={ui.panelHeader}>
        <h2>Offline cracking estimate</h2>
        <span className={ui.badge}>{formatEntropy(bits)} bits</span>
      </div>
      <div className={ui.body}>
        <fieldset className={styles.profiles}>
          <legend>
            {type === 'dictionary' ? 'Dictionary' : 'Brute-force'} attack ·
            compute
          </legend>
          {computeProfiles.map(({ key, label, description }) => (
            <label key={key} className={ui.option}>
              <input
                type="radio"
                name={`${id}-compute`}
                checked={profile.key === key}
                aria-describedby={`${id}-${key}`}
                onChange={() => setComputeProfileKey(key)}
              />
              {label}
              <span id={`${id}-${key}`} className={ui.srOnly}>
                {description}
              </span>
            </label>
          ))}
        </fieldset>
        <p className={ui.muted}>
          Average time to try half the search space. Rates vary with password
          length and hash settings.{' '}
          <a href={BENCHMARK_SOURCE} target="_blank" rel="noopener noreferrer">
            Benchmark source ↗
          </a>
        </p>
      </div>
      <div className={ui.tableScroll}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th>Hash / measured settings</th>
              <th className={styles.time}>Average time</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map(({ name, links, rate, hashMode, settings }) => (
              <tr key={name}>
                <td>
                  {links.map(({ label, url, description }, index) => {
                    const descriptionId = `${id}-hash-${hashMode}-${index}`;
                    return (
                      <span key={label}>
                        {index > 0 && ', '}
                        <a
                          className={styles.hash}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-describedby={descriptionId}
                          onMouseEnter={() => setTooltip(description)}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={() => setTooltip(description)}
                          onBlur={() => setTooltip(null)}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') setTooltip(null);
                          }}
                        >
                          {label}
                        </a>
                        <span id={descriptionId} className={ui.srOnly}>
                          {description}
                        </span>
                      </span>
                    );
                  })}
                  <span className={styles.settings}>
                    Mode {hashMode} · {settings}
                  </span>
                </td>
                <td className={styles.time}>
                  {prettyTime((500 * 2 ** bits) / (rate * profile.multiplier))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className={styles.description}>{tooltip || profile.description}</p>
    </section>
  );
});
