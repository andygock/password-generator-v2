import prettyMilliseconds from 'pretty-ms';

// list of hashes and hash cracking rates
// NVIDIA GeForce RTX 5090, 31615/32120 MB, 170MCU
//
// https://hashcat.net/wiki/doku.php?id=example_hashes
// https://gist.github.com/amutu/8dad53cbb8fa5b710501c9b2280a6d62
//

const hash = [
  {
    // Hash-Mode 1000 (NTLM)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 340.1 GH/s
    name: 'NTLM',
    rate: 340.1e9,
  },
  {
    // Hash-Mode 0 (MD5)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 220.6 GH/s
    name: 'MD5',
    rate: 220.6e9,
  },
  {
    // Hash-Mode 100 (SHA1)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 70245.1 MH/s
    name: 'SHA1',
    rate: 70245.1e6,
  },
  {
    // Hash-Mode 1400 (SHA2-256)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 28353.3 MH/s
    name: 'SHA-256',
    rate: 28353.3e6,
  },
  {
    // Hash-Mode 1700 (SHA2-512)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 10048.6 MH/s
    name: 'SHA-512',
    rate: 10048.6e6,
  },
  {
    // Hash-Mode 7500 (Kerberos 5, etype 23, AS-REQ Pre-Auth)
    // https://www.secura.com/blog-kerberoasting-exploiting-kerberos-to-compromise-microsoft-active-directory
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 4172.2 MH/s
    name: 'Kerberos 5 TGS-REP etype 23 (Windows)',
    rate: 4172.2e6,
  },

  {
    // Hash-Mode 22000 (WPA-PBKDF2-PMKID+EAPOL) [Iterations: 4095]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 3409.1 kH/s
    name: 'WPA-PBKDF2-PMKID+EAPOL (Wifi)',
    rate: 3409.1e3,
  },
  {
    // Hash-Mode 11600 (7-Zip) [Iterations: 16384]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 3031.8 kH/s
    name: '7-Zip, LUKS, Office 2013',
    rate: 3031.8e3,
  },
  {
    // Hash-Mode 3200 (bcrypt $2*$, Blowfish (Unix)) [Iterations: 32]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 304.8 kH/s
    name: 'bcrypt $2*$, Blowfish (Unix)',
    rate: 304.8e3,
  },
  {
    // Hash-Mode 10900 (PBKDF2-HMAC-SHA256) [Iterations: 999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 11157.2 kH/s at 999 iterations; scaled linearly to 600,000 iterations
    name: 'PBKDF2-HMAC-SHA256 (600k iterations)',
    rate: 11157.2e3 * (999 / 600000),
  },
  {
    // Hash-Mode 13400 (KeePass 1 (AES/Twofish) and KeePass 2 (AES)) [Iterations: 24569]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 451.1 kH/s
    name: 'KeePass 1 (AES/Twofish) and KeePass 2 (AES)',
    rate: 451.1e3,
  },
  {
    // Hash-Mode 6800 (LastPass + LastPass sniffed) [Iterations: 100099]
    // Hash-Mode 23400 (Bitwarden) [Iterations: 99999]
    // Hash-Mode 31800 (1Password, mobilekeychain (1Password 8)) [Iterations: 99999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 117.1 kH/s for LastPass and Bitwarden; 111.5 kH/s for 1Password 8; using the slower merged estimate
    name: 'LastPass, Bitwarden, 1Password 8 (legacy PBKDF2 vaults)',
    rate: 111.5e3,
  },
  {
    // Hash-Mode 11300 (Bitcoin/Litecoin wallet.dat) [Iterations: 200459]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 45817 H/s
    name: 'Bitcoin/Litecoin wallet.dat',
    rate: 45817,
  },
  {
    // Hash-Mode 8900 (scrypt) [Iterations: 16384]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 7760 H/s
    name: 'scrypt (memory-hard KDF)',
    rate: 7760,
  },
  {
    // Hash-Mode 29421 (VeraCrypt SHA512 + XTS 512 bit) [Iterations: 499999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 8402 H/s
    name: 'VeraCrypt SHA512 + XTS 512 bit',
    rate: 8402,
  },
];
// age of universe in milliseconds
const msAgeOfUniverse = 13.8e9 * 86400 * 1000;

const prettyTime = (ms) => {
  if (ms > msAgeOfUniverse) return '> age of universe';
  if (ms < 1000) return '< 1 second';

  return prettyMilliseconds(ms, {
    compact: true,
    verbose: true,
  });
};

// cracking table
const EstimateCrackingTime = ({ bits, type = 'dictionary' }) => {
  return (
    <div className="crack-time">
      <h3>Estimated cracking time ({bits} bits of entropy)</h3>
      <p>With {type} attack using a single RTX 5090 GPU.</p>
      <table>
        <thead>
          <tr>
            <th>Hash</th>
            <th className="time">Time</th>
          </tr>
        </thead>
        <tbody>
          {hash.map(({ name, rate }) => {
            // calculate estimated crack time
            const ms = bits > 0 ? (1000 * 0.5 * Math.pow(2, bits)) / rate : 0;
            return (
              <tr key={name}>
                <td>{name}</td>
                <td>{prettyTime(ms)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EstimateCrackingTime;
