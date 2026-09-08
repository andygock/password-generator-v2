import { generatePassphrases } from './random';
import PasswordOutput from './PasswordOutput';
import useGeneratedValues from './useGeneratedValues';
import ui from './ui.module.css';

export default function OutputWords({ wordArray, words, lines, mode }) {
  const { values, error, regenerate } = useGeneratedValues(() =>
    generatePassphrases({ wordArray, words, lines, mode })
  );

  return (
    <section className={ui.panel} aria-label="Passphrases">
      <div className={ui.panelHeader}>
        <h2>
          Passphrases <span className={ui.badge}>{lines}</span>
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
      <PasswordOutput values={values} noun="Passphrase" />
    </section>
  );
}
