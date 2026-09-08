import { CHARSETS } from './charsets.js';

// Keep command generation pure so each shell can be checked independently.
export function getCommands(charsetKey, bits) {
  const bytes = Math.ceil(bits / 8);
  const selectedCharset =
    CHARSETS.find((c) => c.key === charsetKey) || CHARSETS[0];
  const escapeSingleQuotes = (s) => (s || '').replace(/'/g, "'\"'\"'");
  const escapePowerShellSingleQuotes = (s) => (s || '').replace(/'/g, "''");
  const powerShellCharArray = (s) =>
    Array.from(s || '')
      .map((ch) => `'${escapePowerShellSingleQuotes(ch)}'`)
      .join(',');
  const getNodeCharsetCommand = (cs, length) =>
    `const crypto = require('crypto');\nconst charset = ${JSON.stringify(
      cs
    )};\nconst length = ${length};\nconst threshold = Math.floor(256 / charset.length) * charset.length;\nlet passphrase = '';\nwhile (passphrase.length < length) {\n  const bytes = crypto.randomBytes(length - passphrase.length);\n  for (const b of bytes) {\n    if (b < threshold) passphrase += charset[b % charset.length];\n    if (passphrase.length === length) break;\n  }\n}`;
  const getBrowserCharsetCommand = (cs, length) =>
    `const charset = ${JSON.stringify(
      cs
    )};\nconst length = ${length};\nconst threshold = Math.floor(256 / charset.length) * charset.length;\nlet passphrase = '';\nwhile (passphrase.length < length) {\n  const bytes = new Uint8Array(length - passphrase.length);\n  window.crypto.getRandomValues(bytes);\n  for (const b of bytes) {\n    if (b < threshold) passphrase += charset[b % charset.length];\n    if (passphrase.length === length) break;\n  }\n}`;
  const getPowerShellHexCommand = (bytes) =>
    `$rng=[System.Security.Cryptography.RandomNumberGenerator]::Create();$bytes=New-Object byte[] ${bytes};$rng.GetBytes($bytes);$rng.Dispose();\n$password=($bytes|ForEach-Object{$_.ToString('x2')}) -join '';\n$password|Set-Clipboard;\n$password`;
  const getPowerShellBase64Command = (bytes) =>
    `$rng=[System.Security.Cryptography.RandomNumberGenerator]::Create();$bytes=New-Object byte[] ${bytes};$rng.GetBytes($bytes);$rng.Dispose();\n$password=[Convert]::ToBase64String($bytes).TrimEnd('=');\n$password|Set-Clipboard;\n$password`;
  // GetBytes is available in Windows PowerShell 5.1 as well as PowerShell 7.
  // Reject the partial bucket to preserve equal probability for every character.
  const getPowerShellCharsetCommand = (charsExpression, length) =>
    `$chars=${charsExpression};$length=${length};$password='';$buffer=New-Object byte[] 128;$limit=[Math]::Floor(256/$chars.Count)*$chars.Count;$rng=[System.Security.Cryptography.RandomNumberGenerator]::Create();\ntry { while ($password.Length -lt $length) { $rng.GetBytes($buffer);foreach ($b in $buffer) { if ($b -lt $limit) { $password+=$chars[$b % $chars.Count] };if ($password.Length -eq $length) { break } } } } finally { $rng.Dispose() };\n$password|Set-Clipboard;\n$password`;

  // List of command templates
  const commandTemplates = [
    {
      language: 'Bash',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `openssl rand -hex ${bytes}`;
        }
        if (charsetKey === 'base64') {
          return `openssl rand -base64 ${bytes} | tr -d '\\n='`;
        }
        if (charsetKey === 'base62') {
          return `LC_ALL=C tr -dc 'A-Za-z0-9' < /dev/urandom | head -c ${Math.ceil(
            bitsToUse / Math.log2(62)
          )}`;
        }
        // use escaped charset for safety (handles any single quotes)
        const cs = selCharset?.charset || selectedCharset.charset;
        return `LC_ALL=C tr -dc '${escapeSingleQuotes(
          cs
        )}' < /dev/urandom | head -c ${Math.ceil(
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
          return getPowerShellHexCommand(bytes);
        }
        if (charsetKey === 'base64') {
          return getPowerShellBase64Command(bytes);
        }
        if (charsetKey === 'base62') {
          return getPowerShellCharsetCommand(
            '((48..57)+(65..90)+(97..122)|ForEach-Object{[char]$_})',
            Math.ceil(bitsToUse / Math.log2(62))
          );
        }
        // fallback: use explicit charset characters (escaped where necessary)
        const cs = selCharset?.charset || selectedCharset.charset;
        return getPowerShellCharsetCommand(
          `@(${powerShellCharArray(cs)})`,
          Math.ceil(bitsToUse / Math.log2(cs.length))
        );
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
        if (charsetKey === 'base64') {
          return `import base64, secrets\npassphrase = base64.b64encode(secrets.token_bytes(${bytes})).decode().rstrip('=')`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return `import secrets\ncharset = ${JSON.stringify(
          cs
        )}\npassphrase = ''.join(secrets.choice(charset) for _ in range(${Math.ceil(
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
        if (charsetKey === 'base64') {
          return `const crypto = require('crypto');\nconst passphrase = crypto.randomBytes(${bytes}).toString('base64').replace(/=+$/, '');`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return getNodeCharsetCommand(
          cs,
          Math.ceil(bitsToUse / Math.log2(cs.length))
        );
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
        if (charsetKey === 'base64') {
          return `btoa(String.fromCharCode(...window.crypto.getRandomValues(new Uint8Array(${bytes})))).replace(/=+$/, '')`;
        }
        const cs = selCharset?.charset || selectedCharset.charset;
        return getBrowserCharsetCommand(
          cs,
          Math.ceil(bitsToUse / Math.log2(cs.length))
        );
      },
      explanation: `Generates a random password in browser JavaScript.`,
    },
    {
      language: 'Windows CMD*',
      getCommand: (bytes, charsetKey, selCharset, bitsArg) => {
        const bitsToUse = Number(bitsArg) || bits;
        if (charsetKey === 'hex') {
          return `powershell -Command "${getPowerShellHexCommand(bytes).replace(
            /\n/g,
            ''
          )}"`;
        }
        if (charsetKey === 'base64') {
          return `powershell -Command "${getPowerShellBase64Command(
            bytes
          ).replace(/\n/g, '')}"`;
        }
        if (charsetKey === 'base62') {
          return `powershell -Command "${getPowerShellCharsetCommand(
            '((48..57)+(65..90)+(97..122)|ForEach-Object{[char]$_})',
            Math.ceil(bitsToUse / Math.log2(62))
          ).replace(/\n/g, '')}"`;
        }
        // Use character codes so CMD cannot expand percent or exclamation
        // marks from the charset, including with delayed expansion enabled.
        const cs = selCharset?.charset || selectedCharset.charset;
        return `powershell -Command "${getPowerShellCharsetCommand(
          `@(${Array.from(cs)
            .map((ch) => ch.charCodeAt(0))
            .join(',')}|ForEach-Object{[char]$_})`,
          Math.ceil(bitsToUse / Math.log2(cs.length))
        ).replace(/\n/g, '')}"`;
      },
      explanation: `Runs a PowerShell command from Windows CMD to generate a random password and copy it to the clipboard.`,
    },
  ];

  return commandTemplates.map((row) => ({
    language: row.language,
    command: row.getCommand(bytes, selectedCharset.key, selectedCharset, bits),
  }));
}
