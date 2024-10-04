export default function CommandLine() {
  return (
    <div id="cli">
      <table>
        <thead>
          <tr>
            <th>Language</th>
            <th>Command for 128-bit Hexadecimal Password</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bash</td>
            <td>
              <pre>openssl rand -hex 16</pre>
            </td>
          </tr>
          <tr>
            <td>PowerShell*</td>
            <td>
              <pre
                dangerouslySetInnerHTML={{
                  __html: `$pwd=-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | % {[char]$_});$pwd|Set-Clipboard;$pwd`,
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Python</td>
            <td>
              <pre
                dangerouslySetInnerHTML={{
                  __html: `import secrets
passphrase = secrets.token_hex(16)`,
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Node.js</td>
            <td>
              <pre
                dangerouslySetInnerHTML={{
                  __html: `const crypto = require('crypto');
const passphrase = crypto.randomBytes(16).toString('hex');`,
                }}
              />
            </td>
          </tr>
          <tr>
            <td>Browser JS</td>
            <td>
              <pre
                dangerouslySetInnerHTML={{
                  __html: `window.crypto.getRandomValues(new Uint8Array(16)).reduce((memo, i) => memo + ('0' + i.toString(16)).slice(-2), '')`,
                }}
              />
            </td>
          </tr>

          {/* cmd */}
          <tr>
            <td>Windows CMD*</td>
            <td>
              <pre
                dangerouslySetInnerHTML={{
                  __html: `powershell -Command "$pwd=-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 16 | % {[char]$_});$pwd|Set-Clipboard;$pwd"`,
                }}
              />
            </td>
          </tr>
        </tbody>
      </table>
      * PowerShell and Windows CMD commands copy the password to the clipboard
      and also echo to console.
    </div>
  );
}
