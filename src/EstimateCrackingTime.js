import React from 'react';
import PropTypes from 'prop-types';
import prettyMilliseconds from 'pretty-ms';

// list of hashes and hash cracking rates
// benchmarked on Nvidia RTX 2080 FE
// https://gist.github.com/epixoip/23068f4bc81db505115c43e7751522f2
// https://hashcat.net/wiki/doku.php?id=example_hashes

const hash = [
  {
    name: 'NTLM',
    rate: '52954900000',
  },
  {
    name: 'MD5',
    rate: '37085500000',
  },
  {
    name: 'SHA1',
    rate: '12004400000',
  },
  {
    name: 'macOS v10.7',
    rate: '1545900000',
  },
  {
    name: '3DES',
    rate: '1482100000',
  },

  {
    name: 'PDF 1.1 - 1.3 (Acrobat 2 - 4)',
    rate: '511500000',
  },

  // https://www.secura.com/blog-kerberoasting-exploiting-kerberos-to-compromise-microsoft-active-directory
  {
    name: 'Kerberos 5 TGS-REP etype 23 (Windows)',
    rate: '455500000',
  },

  {
    name: 'WPA-EAPOL-PBKDF2 (Wifi)',
    rate: '571400',
  },
  {
    name: 'iTunes backup < 10.0 (9999x)',
    rate: '236500',
  },
  {
    name: 'LUKS (163044x)',
    rate: '13272',
  },
  {
    name: 'bcrypt $2*$, Blowfish (Unix) (32x)',
    rate: '18485',
  },

  {
    name: 'VeraCrypt PBKDF2-HMAC-SHA512 + XTS 512 bit (500000x)',
    rate: '1531',
  },

  {
    name: 'iTunes backup >= 10.0 (9999999x)',
    rate: '209',
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
      <h3 className="strong">Estimated cracking time ({bits} entropy bits)</h3>
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
