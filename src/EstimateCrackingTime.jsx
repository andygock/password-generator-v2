import prettyMilliseconds from 'pretty-ms';
import { useState } from 'react';

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
    links: [
      {
        label: 'NTLM',
        url: 'https://learn.microsoft.com/en-ca/windows-server/security/kerberos/ntlm-overview',
        description:
          'A legacy Microsoft authentication protocol still seen in Windows environments.',
      },
    ],
    rate: 340.1e9,
  },
  {
    // Hash-Mode 0 (MD5)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 220.6 GH/s
    name: 'MD5',
    links: [
      {
        label: 'MD5',
        url: 'https://datatracker.ietf.org/doc/html/rfc1321',
        description:
          'An obsolete 128-bit message digest; useful for checksums, not password storage.',
      },
    ],
    rate: 220.6e9,
  },
  {
    // Hash-Mode 100 (SHA1)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 70245.1 MH/s
    name: 'SHA1',
    links: [
      {
        label: 'SHA1',
        url: 'https://www.nist.gov/news-events/news/2022/12/nist-retires-sha-1-cryptographic-algorithm',
        description:
          'A retired 160-bit hash with practical collision attacks; avoid for new security uses.',
      },
    ],
    rate: 70245.1e6,
  },
  {
    // Hash-Mode 1400 (SHA2-256)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 28353.3 MH/s
    name: 'SHA-256',
    links: [
      {
        label: 'SHA-256',
        url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf',
        description:
          'A SHA-2 hash widely used for integrity and signatures, but too fast alone for passwords.',
      },
    ],
    rate: 28353.3e6,
  },
  {
    // Hash-Mode 1700 (SHA2-512)
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 10048.6 MH/s
    name: 'SHA-512',
    links: [
      {
        label: 'SHA-512',
        url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf',
        description:
          'A 512-bit SHA-2 hash; strong for integrity, but too fast alone for password storage.',
      },
    ],
    rate: 10048.6e6,
  },
  {
    // Hash-Mode 7500 (Kerberos 5, etype 23, AS-REQ Pre-Auth)
    // https://www.secura.com/blog-kerberoasting-exploiting-kerberos-to-compromise-microsoft-active-directory
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 4172.2 MH/s
    name: 'Kerberos 5 TGS-REP etype 23 (Windows)',
    links: [
      {
        label: 'Kerberos 5 TGS-REP etype 23 (Windows)',
        url: 'https://web.mit.edu/kerberos/krb5-latest/doc/',
        description:
          'Kerberos is a ticket-based network authentication system used heavily by Active Directory.',
      },
    ],
    rate: 4172.2e6,
  },

  {
    // Hash-Mode 22000 (WPA-PBKDF2-PMKID+EAPOL) [Iterations: 4095]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 3409.1 kH/s
    name: 'WPA-PBKDF2-PMKID+EAPOL (Wifi)',
    links: [
      {
        label: 'WPA-PBKDF2-PMKID+EAPOL (Wifi)',
        url: 'https://www.rfc-editor.org/rfc/rfc8018.html',
        description:
          'WPA/WPA2 personal networks derive keys from the Wi-Fi password with PBKDF2.',
      },
    ],
    rate: 3409.1e3,
  },
  {
    // Hash-Mode 11600 (7-Zip) [Iterations: 16384]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 3031.8 kH/s
    name: '7-Zip, LUKS, Office 2013',
    links: [
      {
        label: '7-Zip',
        url: 'https://www.7-zip.org/7z.html',
        description:
          '7-Zip archives can use AES-256 encryption and password-based key derivation.',
      },
      {
        label: 'LUKS',
        url: 'https://gitlab.com/cryptsetup/cryptsetup/-/wikis/FrequentlyAskedQuestions',
        description:
          'LUKS is a Linux disk-encryption format that stores metadata for passphrase-protected volumes.',
      },
      {
        label: 'Office 2013',
        url: 'https://learn.microsoft.com/en-us/openspecs/office_file_formats/ms-offcrypto/',
        description:
          'Microsoft Office encrypted files derive encryption keys from the document password.',
      },
    ],
    rate: 3031.8e3,
  },
  {
    // Hash-Mode 3200 (bcrypt $2*$, Blowfish (Unix)) [Iterations: 32]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 304.8 kH/s
    name: 'bcrypt $2*$, Blowfish (Unix)',
    links: [
      {
        label: 'bcrypt $2*$, Blowfish (Unix)',
        url: 'https://www.usenix.org/legacy/events/usenix99/provos/provos.pdf',
        description:
          'A password-hashing scheme with an adjustable work factor, common in legacy systems.',
      },
    ],
    rate: 304.8e3,
  },
  {
    // Hash-Mode 10900 (PBKDF2-HMAC-SHA256) [Iterations: 999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 11157.2 kH/s at 999 iterations; scaled linearly to 600,000 iterations
    name: 'PBKDF2-HMAC-SHA256 (600k iterations)',
    links: [
      {
        label: 'PBKDF2-HMAC-SHA256 (600k iterations)',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
        description:
          'A standard password-based key derivation function; 600k iterations is current OWASP guidance for FIPS use.',
      },
    ],
    rate: 11157.2e3 * (999 / 600000),
  },
  {
    // Hash-Mode 13400 (KeePass 1 (AES/Twofish) and KeePass 2 (AES)) [Iterations: 24569]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 451.1 kH/s
    name: 'KeePass 1 (AES/Twofish) and KeePass 2 (AES)',
    links: [
      {
        label: 'KeePass 1 (AES/Twofish)',
        url: 'https://keepass.info/help/base/security.html',
        description:
          'KeePass protects a local password database using a master key and configurable key derivation.',
      },
      {
        label: 'KeePass 2 (AES)',
        url: 'https://keepass.info/help/base/security.html',
        description:
          'KeePass 2 databases use a master key and configurable key derivation to protect stored secrets.',
      },
    ],
    rate: 451.1e3,
  },
  {
    // Hash-Mode 6800 (LastPass + LastPass sniffed) [Iterations: 100099]
    // Hash-Mode 23400 (Bitwarden) [Iterations: 99999]
    // Hash-Mode 31800 (1Password, mobilekeychain (1Password 8)) [Iterations: 99999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 117.1 kH/s for LastPass and Bitwarden; 111.5 kH/s for 1Password 8; using the slower merged estimate
    name: 'LastPass, Bitwarden, 1Password 8 (legacy PBKDF2 vaults)',
    links: [
      {
        label: 'LastPass',
        url: 'https://support.lastpass.com/s/document-item?language=en_US&bundleId=lastpass&topicId=LastPass/c_lp_security-what-happens-when-you-log-in.html',
        description:
          'LastPass vaults are encrypted locally and protected by a master password-derived key.',
      },
      {
        label: 'Bitwarden',
        url: 'https://bitwarden.com/help/kdf-algorithms/',
        description:
          'Bitwarden uses a configurable KDF to slow offline guessing of the master password.',
      },
      {
        label: '1Password 8',
        url: 'https://support.1password.com/1password-security/',
        description:
          '1Password protects vaults with a master password plus a Secret Key in its security model.',
      },
      {
        label: 'PBKDF2',
        url: 'https://www.rfc-editor.org/rfc/rfc8018.html',
        description:
          'PBKDF2-based legacy vault settings are grouped here because their cracking rates are similar.',
      },
    ],
    rate: 111.5e3,
  },
  {
    // Hash-Mode 11300 (Bitcoin/Litecoin wallet.dat) [Iterations: 200459]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 45817 H/s
    name: 'Bitcoin/Litecoin wallet.dat',
    links: [
      {
        label: 'Bitcoin/Litecoin wallet.dat',
        url: 'https://en.bitcoin.it/wiki/Wallet_encryption',
        description:
          'Legacy cryptocurrency wallet files encrypt private keys behind a user passphrase.',
      },
    ],
    rate: 45817,
  },
  {
    // Hash-Mode 8900 (scrypt) [Iterations: 16384]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 7760 H/s
    name: 'scrypt (memory-hard KDF)',
    links: [
      {
        label: 'scrypt (memory-hard KDF)',
        url: 'https://www.rfc-editor.org/rfc/rfc7914.html',
        description:
          'A memory-hard password KDF designed to make large parallel cracking rigs more expensive.',
      },
    ],
    rate: 7760,
  },
  {
    // Hash-Mode 29421 (VeraCrypt SHA512 + XTS 512 bit) [Iterations: 499999]
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 8402 H/s
    name: 'VeraCrypt SHA512 + XTS 512 bit',
    links: [
      {
        label: 'VeraCrypt SHA512 + XTS 512 bit',
        url: 'https://veracrypt.io/en/Encryption%20Scheme.html',
        description:
          'VeraCrypt encrypts volumes and system disks using a passphrase-derived key.',
      },
    ],
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

const computeProfiles = [
  {
    key: 'single-5090',
    label: 'Single RTX 5090',
    multiplier: 1,
    description: 'Uses the listed single-GPU RTX 5090 hashcat benchmark rates.',
  },
  {
    key: 'world-compute',
    label: 'All compute in the world',
    multiplier: 100_000_000,
    description:
      'Hypothetical estimate using 100,000,000 times the single RTX 5090 hash rate. Requires roughly 60 GW of electrical power (40 to 50 large nuclear reactors).',
  },
];

// cracking table
const EstimateCrackingTime = ({ bits, type = 'dictionary' }) => {
  const [tooltip, setTooltip] = useState(null);
  const [computeProfileKey, setComputeProfileKey] = useState('single-5090');
  const computeProfile =
    computeProfiles.find(({ key }) => key === computeProfileKey) ??
    computeProfiles[0];

  const showTooltip = (description) => {
    setTooltip(description);
  };

  const hideTooltip = () => {
    setTooltip(null);
  };

  return (
    <div className="crack-time">
      <h3>Estimated cracking time ({bits} bits of entropy)</h3>
      <p>
        With {type} attack using {computeProfile.label.toLowerCase()}.
      </p>
      <fieldset className="compute-switch">
        <legend>Compute</legend>
        {computeProfiles.map(({ key, label, description }) => (
          <label
            key={key}
            onMouseEnter={() => showTooltip(description)}
            onMouseLeave={hideTooltip}
            onFocus={() => showTooltip(description)}
            onBlur={hideTooltip}
          >
            <input
              type="radio"
              name="compute-profile"
              value={key}
              checked={computeProfileKey === key}
              onChange={() => setComputeProfileKey(key)}
            />
            {label}
          </label>
        ))}
      </fieldset>
      <table>
        <thead>
          <tr>
            <th>Hash</th>
            <th className="time">Time</th>
          </tr>
        </thead>
        <tbody>
          {hash.map(({ name, links, rate }) => {
            // calculate estimated crack time
            const adjustedRate = rate * computeProfile.multiplier;
            const ms =
              bits > 0 ? (1000 * 0.5 * Math.pow(2, bits)) / adjustedRate : 0;
            return (
              <tr key={name}>
                <td>
                  {links.map(({ label, url, description }, index) => (
                    <span key={label}>
                      {index > 0 && ', '}
                      <a
                        className="hash-link"
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={() => showTooltip(description)}
                        onMouseLeave={hideTooltip}
                        onFocus={() => showTooltip(description)}
                        onBlur={hideTooltip}
                      >
                        {label}
                      </a>
                    </span>
                  ))}
                </td>
                <td>{prettyTime(ms)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {tooltip && (
        <div className="hash-tooltip" role="tooltip">
          {tooltip}
        </div>
      )}
    </div>
  );
};

export default EstimateCrackingTime;
