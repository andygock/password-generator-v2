import styles from './App.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <span>
        Generated on your device with{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
          Web Crypto
        </a>
        . Passwords are never sent to a server.
      </span>
      <span>
        <a href="https://www.eff.org/dice">EFF</a> ·{' '}
        <a href="https://github.com/sts10/orchard-street-wordlists">
          Orchard Street
        </a>{' '}
        · <a href="https://github.com/andygock/password-generator-v2">Source</a>{' '}
        · © <a href="https://gock.net/">Andy Gock</a>
      </span>
    </footer>
  );
}
