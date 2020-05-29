import React from 'react';
import PropTypes from 'prop-types';
import prettyMilliseconds from 'pretty-ms';

// list of hashes and hash cracking rates
// benchmarked on Nvidia RTX 2080 FE
// https://gist.github.com/epixoip/23068f4bc81db505115c43e7751522f2
// https://hashcat.net/wiki/doku.php?id=example_hashes

const hash = [
  {
    name: 'MySQL323',
    rate: 123.4e9,
  },
  {
    name: 'NTLM',
    rate: 64989.1e6,
  },
  {
    name: 'MD5',
    rate: 39630e6,
  },
  {
    name: 'SHA1',
    rate: 12484e6,
  },
  {
    name: 'PDF 1.7 Level 3, MySQL4.1/MySQL5',
    rate: 5638e6,
  },
  {
    name: '3DES',
    rate: 1096.7e6,
  },

  {
    name: 'PDF 1.1-1.3, Office <= 2003',
    rate: 523.6e6,
  },

  // https://www.secura.com/blog-kerberoasting-exploiting-kerberos-to-compromise-microsoft-active-directory
  {
    name: 'Kerberos 5 TGS-REP etype 23 (Windows)',
    rate: 455.4e6,
  },
  {
    name: 'PDF 1.4-1.6',
    rate: 22205.5e3,
  },

  {
    name: 'LastPass + LastPass sniffed, 1Password, agilekeychain',
    rate: 4182800,
  },
  {
    name: 'WPA-EAPOL-PBKDF2 (Wifi)',
    rate: 571400,
  },
  {
    name: 'FileVault 2, KeePass 1 and 2, Office 2010',
    rate: 152800,
  },
  {
    name: 'PDF 1.7 Level 8 (Acrobat 10-11)',
    rate: 56942,
  },
  {
    name: '7-Zip, LUKS, Office 2013',
    rate: 16264,
  },
  {
    name: 'bcrypt $2*$, Blowfish (Unix)',
    rate: 18485,
  },

  {
    name: 'VeraCrypt PBKDF2-HMAC-SHA512 + XTS 512 bit',
    rate: 1531,
  },
];

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
const EstimateCrackingTime = ({ bits }) => {
  return (
    <div className="crack-time">
      <h3 className="strong">
        Estimated cracking time ({bits} bits of entropy)
      </h3>
      <p>With dictionary attack using a single RTX 2080 GPU.</p>
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
