import { memo, useMemo, useState } from 'react';
import { CHARSETS } from './charsets';
import { getCommands } from './commands';
import useCopyFeedback from './useCopyFeedback';
import ui from './ui.module.css';
import styles from './CommandLine.module.css';

function CommandTable({ charsetKey, bits }) {
  const commands = useMemo(
    () => getCommands(charsetKey, bits),
    [charsetKey, bits]
  );
  const { copied, copyNotify, copyText } = useCopyFeedback({
    resetKey: charsetKey + ':' + bits,
  });
  return (
    <>
      <div className={ui.tableScroll}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th>Environment</th>
              <th>Command · at least {bits} bits</th>
              <th>Copy</th>
            </tr>
          </thead>
          <tbody>
            {commands.map(({ language, command }) => (
              <tr key={language}>
                <td className={styles.language}>{language}</td>
                <td>
                  <pre
                    className={styles.code}
                    tabIndex={0}
                    aria-label={`${language} command`}
                  >
                    {command}
                  </pre>
                </td>
                <td className={styles.copy}>
                  <button
                    type="button"
                    aria-label={`Copy ${language} command`}
                    onClick={() => copyText(command, 'Command copied')}
                  >
                    {copied === command ? 'Copied' : 'Copy'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={ui.feedback} role="status">
        {copyNotify}
      </div>
      <p className={`${ui.body} ${ui.muted}`}>
        * Copies to clipboard and echoes to console. Supports Windows PowerShell
        5.1 and PowerShell 7.
      </p>
    </>
  );
}

// The table is opt-in: slider movement does not build or reconcile hidden code.
export default memo(function CommandLine({ charsetKey, bits }) {
  const [open, setOpen] = useState(false);
  const charset = CHARSETS.find(({ key }) => key === charsetKey) || CHARSETS[0];
  return (
    <details
      className={`${ui.panel} ${styles.commands}`}
      onToggle={(event) => setOpen(event.currentTarget.open)}
    >
      <summary>
        Generate elsewhere <span>{charset.label} · 6 environments</span>
      </summary>
      {open && <CommandTable charsetKey={charsetKey} bits={bits} />}
    </details>
  );
});
