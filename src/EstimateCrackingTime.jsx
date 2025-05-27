import prettyMilliseconds from 'pretty-ms';
import PropTypes from 'prop-types';

// list of hashes and hash cracking rates
// NVIDIA GeForce RTX 4090, 23808/24208 MB (6052 MB allocatable), 128MCU
//
// https://hashcat.net/wiki/doku.php?id=example_hashes
// https://forum.hashpwn.net/topic/96/hashcat-gpu-benchmarks/2
//

const hash = [
  {
    // Hash-Mode 1000 (NTLM)
    name: 'NTLM',
    rate: 290.1e9,
  },
  {
    // Hash-Mode 0 (MD5)
    name: 'MD5',
    rate: 162.7e9,
  },
  {
    // Hash-Mode 100 (SHA1)
    name: 'SHA1',
    rate: 50643.5e6,
  },
  {
    // Hash-Mode 7500 (Kerberos 5, etype 23, AS-REQ Pre-Auth)
    // https://www.secura.com/blog-kerberoasting-exploiting-kerberos-to-compromise-microsoft-active-directory
    name: 'Kerberos 5 TGS-REP etype 23 (Windows)',
    rate: 3370.6e6,
  },

  {
    // Hash-Mode 22000 (WPA-PBKDF2-PMKID+EAPOL) [Iterations: 4095]
    name: 'WPA-PBKDF2-PMKID+EAPOL (Wifi)',
    rate: 2562.9e3,
  },
  {
    // Hash-Mode 11600 (7-Zip) [Iterations: 16384]
    name: '7-Zip, LUKS, Office 2013',
    rate: 1807.6e3,
  },
  {
    // Hash-Mode 3200 (bcrypt $2*$, Blowfish (Unix)) [Iterations: 32]
    name: 'bcrypt $2*$, Blowfish (Unix)',
    rate: 224.2e3,
  },
  {
    // Hash-Mode 13400 (KeePass 1 (AES/Twofish) and KeePass 2 (AES)) [Iterations: 24569]
    name: 'KeePass 1 (AES/Twofish) and KeePass 2 (AES)',
    rate: 326.7e3,
  },
  {
    // Hash-Mode 6800 (LastPass + LastPass sniffed) [Iterations: 100099]
    name: 'LastPass + LastPass sniffed',
    rate: 89829,
  },
  {
    // Hash-Mode 11300 (Bitcoin/Litecoin wallet.dat) [Iterations: 200459]
    name: 'Bitcoin/Litecoin wallet.dat',
    rate: 33624,
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
      <p>
        With {type} attack using a single RTX 4090 GPU when exact keyspace is
        known.
      </p>
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

EstimateCrackingTime.propTypes = {
  // bits of entropy
  bits: PropTypes.number,
};

export default EstimateCrackingTime;
