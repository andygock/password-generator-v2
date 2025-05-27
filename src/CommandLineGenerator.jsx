import React, { useState } from 'react';
import { CHARSETS } from './charsets';
import EstimateCrackingTime from './EstimateCrackingTime';
import CharsetSelector from './CharsetSelector';

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

function getRandomString(length, charset) {
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  const chars = [];
  for (let i = 0; i < length; ++i) {
    chars.push(charset[arr[i] % charset.length]);
  }
  return chars.join('');
}

export default function CommandLineGenerator() {
  // State to track which row was copied
  const [copiedRow, setCopiedRow] = useState(null);

  // State for number of bits
  const [bits, setBits] = useState(128);

  // State for copying the example password
  const [copiedExample, setCopiedExample] = useState(false);

  // State for charset selection
  const [charsetKey, setCharsetKey] = useState('websafe');

  // Regenerate trigger
  const [regen, setRegen] = useState(0);

  // Helper to get bytes from bits
  const bytes = Math.ceil(bits / 8);

  // Find selected charset
  const selectedCharset = CHARSETS.find((c) => c.key === charsetKey);

  // Generate example password
  const examplePassword = React.useMemo(() => {
    if (charsetKey === 'hex') {
      // Hex: 2 chars per byte
      return getRandomString(bytes * 2, selectedCharset.charset);
    } else {
      // Others: 1 char per ~6 bits, so ceil(bits / log2(charset.length))
      const charsNeeded = Math.ceil(
        bits / Math.log2(selectedCharset.charset.length)
      );
      return getRandomString(charsNeeded, selectedCharset.charset);
    }
    // eslint-disable-next-line
  }, [bits, charsetKey, regen]);

  const exampleLength = examplePassword.length;

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
          }|%{[char]$_});\\n$pwd|Set-Clipboard;\\n$pwd"`;
        }
        if (charsetKey === 'base62') {
          return `powershell -Command "$chars=(48..57)+(65..90)+(97..122);$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(62)
          )}|%{[char]$_});\\n$pwd|Set-Clipboard;\\n$pwd"`;
        }
        if (charsetKey === 'human') {
          return `powershell -Command "$chars=@('A','B','C','D','E','F','G','H','J','K','L','M','N','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','m','n','o','p','q','r','s','t','u','v','w','x','y','z','2','3','4','5','6','7','8','9','@','#','%','+','=','!','?');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});\\n$pwd|Set-Clipboard;\\n$pwd"`;
        }
        if (charsetKey === 'websafe') {
          return `powershell -Command "$chars=@('A'..'Z','a'..'z','0'..'9','!','@','#','$','%','^','&','*');$pwd=-join ($chars|Get-Random -Count ${Math.ceil(
            bits / Math.log2(selectedCharset.charset.length)
          )});\\n$pwd|Set-Clipboard;\\n$pwd"`;
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

  // Copy handler for example password
  const handleCopyExample = async () => {
    try {
      await navigator.clipboard.writeText(examplePassword);
      setCopiedExample(true);
      setTimeout(() => setCopiedExample(false), 1200);
    } catch (e) {
      // fallback or error handling
    }
  };

  // Regenerate password
  const handleRegenerate = () => setRegen((r) => r + 1);

  return (
    <div className="ui container">
      <div className="col inputs">
        {/* Charset radio buttons */}
        <CharsetSelector
          charsets={CHARSETS}
          selectedKey={charsetKey}
          onChange={setCharsetKey}
        />
        {/* Slider for bits */}
        <div>
          <label htmlFor="bits-slider">
            Number of bits: <strong>{bits}</strong>
          </label>
          <input
            id="bits-slider"
            type="range"
            min={32}
            max={512}
            step={8}
            value={bits}
            onChange={(e) => setBits(Number(e.target.value))}
            style={{ marginLeft: '1em', verticalAlign: 'middle' }}
          />
        </div>
      </div>

      {/* Example password */}
      <div className="col col-output">
        <div>
          <strong>
            Example {bits}-bit password ({selectedCharset.label},{' '}
            {selectedCharset.charset.length} chars):
          </strong>
        </div>
        <div>
          <CopyButton
            text={examplePassword}
            onCopy={handleCopyExample}
            copied={copiedExample}
          />
          <button onClick={handleRegenerate} aria-label="Regenerate password">
            Regenerate
          </button>
          <pre
            style={{
              display: 'inline-block',
              margin: 0,
              padding: '0.3em 0.6em',
              background: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '1em',
              userSelect: 'all',
              maxWidth: '100%',
              overflowX: 'auto',
            }}
          >
            {examplePassword}
          </pre>
          <span>({exampleLength} characters)</span>

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
                      <pre dangerouslySetInnerHTML={{ __html: command }} />
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
        <div>
          <strong>Charset:</strong> {selectedCharset.label} (
          {selectedCharset.charset.length} chars)
          <span style={{ color: '#888', marginLeft: 8 }}>
            {selectedCharset.description}
          </span>
        </div>
      </div>

      <div className="col col-crack-time">
        <EstimateCrackingTime bits={bits} />
      </div>
    </div>
  );
}
