import React, { useState } from 'react';
import { CHARSETS } from './charsets';

function CopyButton({ onCopy, copied }) {
  return (
    <button
      className={`copy ${copied ? 'copied' : ''}`}
      aria-label="Copy command"
      onClick={onCopy}
      tabIndex={0}
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function CommandLine({ charsetKey, bits }) {
  // State to track which row was copied
  const [copiedRow, setCopiedRow] = useState(null);

  // Helper to get bytes from bits
  const bytes = Math.ceil(bits / 8);

  // Find selected charset (fallback to first, then to safe default)
  const selectedCharset = CHARSETS.find((c) => c.key === charsetKey) ||
    CHARSETS[0] || {
      key: 'fallback',
      label: 'Charset',
      charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
    };

  const copyTimeoutRef = React.useRef(null);

  const escapeSingleQuotes = (s) => (s || '').replace(/'/g, "'\"'\"'");

  // List of command templates
  const commandTemplates = [
    {
      language: 'Bash',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `openssl rand -hex ${bytes}`;
        }
        if (charsetKey === 'base62') {
          return `tr -dc 'A-Za-z0-9' < /dev/urandom | head -c ${Math.ceil(
            bitsToUse / Math.log2(62)
          )}`;
        }
        // use escaped charset for safety (handles any single quotes)
        const cs = selCharset?.charset || selectedCharset.charset;
        return `tr -dc '${escapeSingleQuotes(cs)}' < /dev/urandom | head -c ${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )}`;
      },
      explanation: `Generates a random password using OpenSSL or tr/urandom depending on charset.`,
    },
    {
      language: 'PowerShell*',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `$pwd=-join ((48..57)+(97..102)|Get-Random -Count ${
            bytes * 2
          }|%{[char]$_});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        if (charsetKey === 'base62') {
          return `$chars=(48..57)+(65..90)+(97..122);$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bitsToUse / Math.log2(62)
          )}|%{[char]$_});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        // fallback: use explicit charset characters (escaped where necessary)
        const cs = selCharset?.charset || selectedCharset.charset;
        return `$chars=@(${JSON.stringify(cs)
          .slice(1, -1)
          .split('')
          .map((ch) => `'${ch.replace(/'/g, "'\"'\"'")}'`)
          .join(',')});$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )});\n$pwd|Set-Clipboard;\n$pwd`;
      },
      explanation: `Generates a random password in PowerShell and copies it to the clipboard.`,
    },
    {
      language: 'Python',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `import secrets\npassphrase = secrets.token_hex(${bytes})`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return `import secrets\ncharset = ${JSON.stringify(cs)}\npassphrase = ''.join(secrets.choice(charset) for _ in range(${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )}))`;
      },
      explanation: `Generates a random password in Python.`,
    },
    {
      language: 'Node.js',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `const crypto = require('crypto');\nconst passphrase = crypto.randomBytes(${bytes}).toString('hex');`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return `const charset = ${JSON.stringify(cs)};\nconst crypto = require('crypto');\nconst passphrase = Array.from(crypto.randomBytes(${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )}), b => charset[b % charset.length]).join('');`;
      },
      explanation: `Generates a random password in Node.js.`,
    },
    {
      language: 'Browser JS',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `window.crypto.getRandomValues(new Uint8Array(${bytes})).reduce((memo, i) => memo + ('0' + i.toString(16)).slice(-2), '')`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return `const charset = ${JSON.stringify(cs)};\nwindow.crypto.getRandomValues(new Uint8Array(${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )})).reduce((a, i) => a + charset[i % charset.length], '')`;
      },
      explanation: `Generates a random password in browser JavaScript.`,
    },
    {
      language: 'Windows CMD*',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `powershell -Command "$pwd=-join ((48..57)+(97..102)|Get-Random -Count ${
            bytes * 2
          }|%{[char]$_});$pwd|Set-Clipboard;$pwd"`;
        }
        if (charsetKey === 'base62') {
          return `powershell -Command "$chars=(48..57)+(65..90)+(97..122);$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bitsToUse / Math.log2(62)
          )}|%{[char]$_});$pwd|Set-Clipboard;$pwd"`;
        }
        // fallback: build chars array safely
        const cs = selCharset?.charset || selectedCharset.charset;
        return `powershell -Command "$chars=@(${JSON.stringify(cs)
          .slice(1, -1)
          .split('')
          .map((ch) => `'${ch.replace(/'/g, "'\"'\"'")}'`)
          .join(',')});$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
          bitsToUse / Math.log2(cs.length)
        )});$pwd|Set-Clipboard;$pwd"`;
      },
      explanation: `Runs a PowerShell command from Windows CMD to generate a random password and copy it to the clipboard.`,
    },
  ];

  // Copy handler for commands
  const handleCopy = async (cmd, idx) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedRow(idx);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => {
        setCopiedRow(null);
        copyTimeoutRef.current = null;
      }, 1200);
    } catch (e) {
      // fallback or error handling
      console.error('Failed to copy command:', e);
    }
  };

  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = null;
      }
    };
  }, []);

  return (
    <div className="cli">
      <h3>Command Line Generation</h3>
      <table>
        <thead>
          <tr>
            <th>Language</th>
            <th>
              Command for {bits}-bit {selectedCharset.label} Password
            </th>
            <th>Copy</th>
          </tr>
        </thead>
        <tbody>
          {commandTemplates.map((row, idx) => {
            const command = row.getCommand(
              bytes,
              charsetKey,
              selectedCharset,
              bits
            );
            return (
              <tr key={row.language}>
                <td>{row.language}</td>
                <td style={{ position: 'relative' }}>
                  <pre>{command}</pre>
                </td>
                <td>
                  <CopyButton
                    text={command}
                    onCopy={() => handleCopy(command, idx)}
                    copied={copiedRow === idx}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>
        <sup>*</sup> Both copies to clipboard and echoes to console.
      </p>
    </div>
  );
}
