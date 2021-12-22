/* eslint-disable react/jsx-no-comment-textnodes */
import React from 'react';
import { Link, Route, Switch } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <p>
        &copy; <a href="https://gock.net/">Andy Gock</a> //{' '}
        <a href="https://github.com/andygock/password-generator-v2">GitHub</a>{' '}
        // Runs entirely in the web browser using{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API">
          Web Crypto API
        </a>{' '}
        and{' '}
        <a href="https://www.eff.org/deeplinks/2016/07/new-wordlists-random-passphrases">
          EFF word lists
        </a>{' '}
        👍
      </p>
      <p>
        <Link to="/">Dictionary</Link> | <Link to="/base64">Base64</Link>
      </p>
    </footer>
  );
};

export default Footer;
