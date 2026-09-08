// list of hashes and hash cracking rates
// NVIDIA GeForce RTX 5090, 31615/32120 MB, 170MCU
//
// https://hashcat.net/wiki/doku.php?id=example_hashes
// https://gist.github.com/amutu/8dad53cbb8fa5b710501c9b2280a6d62
//

export const BENCHMARK_SOURCE =
  'https://gist.github.com/amutu/8dad53cbb8fa5b710501c9b2280a6d62';

export const benchmarks = [
  {
    // Hash-Mode 1000 (NTLM)
    hashMode: 1000,
    settings: 'Benchmark settings',
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
    hashMode: 0,
    settings: 'Benchmark settings',
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
    hashMode: 100,
    settings: 'Benchmark settings',
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
    hashMode: 1400,
    settings: 'Benchmark settings',
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
    hashMode: 1700,
    settings: 'Benchmark settings',
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
    hashMode: 7500,
    settings: 'Benchmark settings',
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 4172.2 MH/s
    name: 'Kerberos 5 AS-REQ Pre-Auth etype 23',
    links: [
      {
        label: 'Kerberos 5 AS-REQ Pre-Auth etype 23',
        url: 'https://web.mit.edu/kerberos/krb5-latest/doc/',
        description:
          'Kerberos is a ticket-based network authentication system used heavily by Active Directory.',
      },
    ],
    rate: 4172.2e6,
  },

  {
    // Hash-Mode 22000 (WPA-PBKDF2-PMKID+EAPOL) [Iterations: 4095]
    hashMode: 22000,
    settings: '4,095 benchmark iterations',
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
    hashMode: 11600,
    settings: '16,384 benchmark iterations',
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 3031.8 kH/s
    name: '7-Zip',
    links: [
      {
        label: '7-Zip',
        url: 'https://www.7-zip.org/7z.html',
        description:
          '7-Zip archives can use AES-256 encryption and password-based key derivation.',
      },
    ],
    rate: 3031.8e3,
  },
  {
    // Hash-Mode 3200 (bcrypt $2*$, Blowfish (Unix)) [Iterations: 32]
    hashMode: 3200,
    settings: 'Cost 5 (32 iterations)',
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
    hashMode: 10900,
    settings: '600,000 iterations (linear extrapolation from 999)',
    // Source: Hashcat v6.2.6-851 RTX 5090 FE benchmark, Speed.#1 11157.2 kH/s at 999 iterations; scaled linearly to 600,000 iterations
    name: 'PBKDF2-HMAC-SHA256 (600k iterations)',
    links: [
      {
        label: 'PBKDF2-HMAC-SHA256 (600k iterations)',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html',
        description:
          'A standard password-based key derivation function; this row extrapolates the benchmark to 600,000 iterations.',
      },
    ],
    rate: 11157.2e3 * (999 / 600000),
  },
  {
    // Hash-Mode 13400 (KeePass 1 (AES/Twofish) and KeePass 2 (AES)) [Iterations: 24569]
    hashMode: 13400,
    settings: '24,569 benchmark iterations',
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
    hashMode: 6800,
    settings: '100,099 benchmark iterations',
    name: 'LastPass (legacy PBKDF2)',
    links: [
      {
        label: 'LastPass (legacy PBKDF2)',
        url: 'https://www.lastpass.com/security',
        description:
          'Benchmark for legacy vault settings; actual work factors vary.',
      },
    ],
    rate: 117.1e3,
  },
  {
    // Hash-Mode 23400 (Bitwarden) [Iterations: 99999]
    hashMode: 23400,
    settings: '99,999 benchmark iterations',
    name: 'Bitwarden (legacy PBKDF2)',
    links: [
      {
        label: 'Bitwarden (legacy PBKDF2)',
        url: 'https://bitwarden.com/help/kdf-algorithms/',
        description: 'Benchmark for legacy PBKDF2 settings, not Argon2 vaults.',
      },
    ],
    rate: 117.1e3,
  },
  {
    // Hash-Mode 31800 (1Password, mobilekeychain (1Password 8)) [Iterations: 99999]
    hashMode: 31800,
    settings: '99,999 benchmark iterations',
    name: '1Password mobilekeychain',
    links: [
      {
        label: '1Password mobilekeychain',
        url: 'https://support.1password.com/1password-security/',
        description:
          'Specific mobilekeychain benchmark; this does not model guessing an unknown Secret Key.',
      },
    ],
    rate: 111.5e3,
  },
  {
    // Hash-Mode 11300 (Bitcoin/Litecoin wallet.dat) [Iterations: 200459]
    hashMode: 11300,
    settings: '200,459 benchmark iterations',
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
    hashMode: 8900,
    settings: '16,384 benchmark iterations',
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
    hashMode: 29421,
    settings: '499,999 benchmark iterations',
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
