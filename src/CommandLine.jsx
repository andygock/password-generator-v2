import { useState } from 'react';
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

  // Find selected charset
  const selectedCharset = CHARSETS.find((c) => c.key === charsetKey);

  // List of command templates
  const commandTemplates = [
    {
      language: 'Bash',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `openssl rand -hex ${bytes}`;
        }
        if (charsetKey === 'base62') {
          return `tr -dc 'A-Za-z0-9' < /dev/urandom | head -c ${Math.ceil(
            bits / Math.log2(62)
          )}`;
        }
        if (charsetKey === 'human') {
          return `tr -dc 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%+=!?' < /dev/urandom | head -c ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )}`;
        }
        if (charsetKey === 'websafe') {
          return `tr -dc 'A-Za-z0-9!@#$%^&*' < /dev/urandom | head -c ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )}`;
        }
        return '';
      },
      explanation: `Generates a random password using OpenSSL or tr/urandom depending on charset.`,
    },
    {
      language: 'PowerShell*',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `$pwd=-join ((48..57)+(97..102)|Get-Random -Count ${
            bytes * 2
          }|%{[char]$_});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        if (charsetKey === 'base62') {
          return `$chars=(48..57)+(65..90)+(97..122);$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(62)
          )}|%{[char]$_});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        if (charsetKey === 'human') {
          return `$chars=@('A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z','2','3','4','5','6','7','8','9','@','#','%','+','=','!','?');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        if (charsetKey === 'websafe') {
          return `$chars=@('A'..'Z','a'..'z','0'..'9','!','@','#','$','%','^','&','*');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});\n$pwd|Set-Clipboard;\n$pwd`;
        }
        return '';
      },
      explanation: `Generates a random password in PowerShell and copies it to the clipboard.`,
    },
    {
      language: 'Python',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `import secrets\npassphrase = secrets.token_hex(${bytes})`;
        }
        return `import secrets\ncharset = '${
          selectedCharset.charset
        }'\npassphrase = ''.join(secrets.choice(charset) for _ in range(${Math.ceil(
          bits / Math.log2(selectedCharset.charset.length)
        )}))`;
      },
      explanation: `Generates a random password in Python.`,
    },
    {
      language: 'Node.js',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `const crypto = require('crypto');\nconst passphrase = crypto.randomBytes(${bytes}).toString('hex');`;
        }
        return `const charset = '${
          selectedCharset.charset
        }';\nconst crypto = require('crypto');\nconst passphrase = Array.from(crypto.randomBytes(${Math.ceil(
          bits / Math.log2(selectedCharset.charset.length)
        )}), b => charset[b % charset.length]).join('');`;
      },
      explanation: `Generates a random password in Node.js.`,
    },
    {
      language: 'Browser JS',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `window.crypto.getRandomValues(new Uint8Array(${bytes})).reduce((memo, i) => memo + ('0' + i.toString(16)).slice(-2), '')`;
        }
        return `const charset = '${
          selectedCharset.charset
        }';\nwindow.crypto.getRandomValues(new Uint8Array(${Math.ceil(
          bits / Math.log2(selectedCharset.charset.length)
        )})).reduce((a, i) => a + charset[i % charset.length], '')`;
      },
      explanation: `Generates a random password in browser JavaScript.`,
    },
    {
      language: 'Windows CMD*',
      getCommand: (bytes, charsetKey) => {
        if (charsetKey === 'hex') {
          return `powershell -Command "$pwd=-join ((48..57)+(97..102)|Get-Random -Count ${
            bytes * 2
          }|%{[char]$_});$pwd|Set-Clipboard;$pwd"`;
        }
        if (charsetKey === 'base62') {
          return `powershell -Command "$chars=(48..57)+(65..90)+(97..122);$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(62)
          )}|%{[char]$_});$pwd|Set-Clipboard;$pwd"`;
        }
        if (charsetKey === 'human') {
          return `powershell -Command "$chars=@('A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z','2','3','4','5','6','7','8','9','@','#','%','+','=','!','?');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});$pwd|Set-Clipboard;$pwd"`;
        }
        if (charsetKey === 'websafe') {
          return `powershell -Command "$chars=@('A'..'Z','a'..'z','0'..'9','!','@','#','$','%','^','&','*');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});$pwd|Set-Clipboard;$pwd"`;
        }
        return '';
      },
      explanation: `Runs a PowerShell command from Windows CMD to generate a random password and copy it to the clipboard.`,
    },
  ];

  // Copy handler for commands
  const handleCopy = async (cmd, idx) => {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopiedRow(idx);
      setTimeout(() => setCopiedRow(null), 1200);
    } catch (e) {
      // fallback or error handling
    }
  };

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
            const command = row.getCommand(bytes, charsetKey);
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
