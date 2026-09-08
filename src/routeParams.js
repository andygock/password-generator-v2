import config from './config.js';
import { CHARSETS } from './charsets.js';
import { getWordListOption } from './words/index.js';

// Reject partial numbers such as "6abc" rather than silently interpreting them.
export function normaliseInteger(value, fallback, { min, max }) {
  const parsed = /^-?\d+$/.test(String(value)) ? Number(value) : NaN;
  return Number.isSafeInteger(parsed)
    ? Math.max(min, Math.min(max, parsed))
    : fallback;
}

export function normaliseParams(params, mode = config.defaults.mode) {
  return {
    wordsPerPassphrase: normaliseInteger(
      params.wordsPerPassphrase,
      config.defaults.wordsPerPassphrase,
      config.limits.wordsPerPassphrase
    ),
    numberOfPassphrases: normaliseInteger(
      params.numberOfPassphrases,
      config.defaults.numberOfPassphrases,
      config.limits.numberOfPassphrases
    ),
    wordList: getWordListOption(params.wordList)
      ? params.wordList
      : config.defaults.wordList,
    mode,
  };
}

export function generatePath({
  wordsPerPassphrase,
  numberOfPassphrases,
  wordList,
  mode,
}) {
  return `${
    mode === 'preset1' ? '/preset1' : ''
  }/${wordsPerPassphrase}/${numberOfPassphrases}/${wordList}`;
}

export function needsCanonicalPath(params, normalised) {
  // Preserve valid short bookmarks, but replace malformed supplied parameters.
  return ['wordsPerPassphrase', 'numberOfPassphrases', 'wordList'].some(
    (key) =>
      params[key] !== undefined && params[key] !== String(normalised[key])
  );
}

// Query parameters inside the hash bookmark settings without storing secrets.
export function normaliseStringParams(params) {
  return {
    sizeBytes: normaliseInteger(
      params.get('bytes'),
      config.defaults.passwordBytes,
      config.limits.passwordBytes
    ),
    charsetKey: CHARSETS.some(({ key }) => key === params.get('charset'))
      ? params.get('charset')
      : config.defaults.charsetKey,
  };
}
