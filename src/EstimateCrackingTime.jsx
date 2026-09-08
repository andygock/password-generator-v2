import { memo, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { benchmarks, BENCHMARK_SOURCE } from './benchmarks';
import {
  BENCHMARK_DESCRIPTION,
  computeProfiles,
  WORLD_COMPUTE_DESCRIPTION,
} from './computeProfiles';
import { formatEntropy } from './entropy';
import { formatCrackingTime } from './timeFormat';
import Tooltip from './Tooltip';
import ui from './ui.module.css';
import styles from './EstimateCrackingTime.module.css';

export default memo(function EstimateCrackingTime({
  bits,
  type = 'dictionary',
}) {
  const id = useId();
  const hashTooltipId = `${id}-hash-description`;
  const [computeProfileKey, setComputeProfileKey] = useState('single-5090');
  const [hashTooltip, setHashTooltip] = useState('');
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
                      <a
                        className={styles.hash}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-describedby={
                          hashTooltip === description
                            ? hashTooltipId
                            : undefined
                        }
                        onMouseEnter={() => setHashTooltip(description)}
                        onMouseLeave={() => setHashTooltip('')}
                        onFocus={() => setHashTooltip(description)}
                        onBlur={() => setHashTooltip('')}
                        onKeyDown={(event) => {
                          if (event.key === 'Escape') setHashTooltip('');
                        }}
                      >
                        {label}
                      </a>
                    </span>
                  ))}
                </td>
                <td className={styles.time}>
                  {formatCrackingTime(
                    (500 * 2 ** bits) / (rate * profile.multiplier)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hashTooltip &&
        createPortal(
          <div id={hashTooltipId} className={styles.hashTooltip} role="tooltip">
            {hashTooltip}
          </div>,
          document.body
        )}
    </section>
  );
});
