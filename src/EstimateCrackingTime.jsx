import prettyMilliseconds from 'pretty-ms';
import { memo, useId, useState } from 'react';
import { benchmarks, BENCHMARK_SOURCE } from './benchmarks';
import {
  BENCHMARK_DESCRIPTION,
  computeProfiles,
  WORLD_COMPUTE_DESCRIPTION,
} from './computeProfiles';
import { formatEntropy } from './entropy';
import Tooltip from './Tooltip';
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

export default memo(function EstimateCrackingTime({
  bits,
  type = 'dictionary',
}) {
  const id = useId();
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
          {computeProfiles.map(({ key, label }) => (
            <span key={key} className={styles.profileOption}>
              <label className={ui.option}>
                <input
                  type="radio"
                  name={`${id}-compute`}
                  checked={profile.key === key}
                  onChange={() => setComputeProfileKey(key)}
                />
                {label}
              </label>
              {key === 'world-compute' && (
                <Tooltip label="How world compute is estimated" align="right">
                  {WORLD_COMPUTE_DESCRIPTION}
                </Tooltip>
              )}
            </span>
          ))}
        </fieldset>
        <p className={ui.muted}>
          Average half-search time. Rates vary by hardware and hash settings.{' '}
          <a href={BENCHMARK_SOURCE} target="_blank" rel="noopener noreferrer">
            Benchmark source ↗
          </a>
        </p>
      </div>
      <div className={ui.tableScroll}>
        <table className={`${ui.table} ${styles.table}`}>
          <thead>
            <tr>
              <th>
                <span className={styles.headingWithHelp}>
                  Hash
                  <Tooltip label="About benchmark rates">
                    {BENCHMARK_DESCRIPTION}
                  </Tooltip>
                </span>
              </th>
              <th className={styles.time}>Average time</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map(({ name, links, rate }) => (
              <tr key={name}>
                <td>
                  {links.map(({ label, url, description }, index) => (
                    <span key={label}>
                      {index > 0 && ', '}
                      <Tooltip
                        label={`About ${label}`}
                        align={index > 0 ? 'right' : 'left'}
                        placement="top"
                        trigger={
                          <a
                            className={styles.hash}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {label}
                          </a>
                        }
                      >
                        {description}
                      </Tooltip>
                    </span>
                  ))}
                </td>
                <td className={styles.time}>
                  {prettyTime((500 * 2 ** bits) / (rate * profile.multiplier))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
});
