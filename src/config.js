export default {
  // default parameters
  defaults: {
    wordsPerPassphrase: 6,
    numberOfPassphrases: 20,
    wordList: 'eff-long',
    mode: 'normal',
    passwordBytes: 16,
    charsetKey: 'websafe',
  },

  // allowed limits for inputs
  limits: {
    wordsPerPassphrase: { min: 1, max: 12 },
    numberOfPassphrases: { min: 1, max: 100 },
    passwordBytes: { min: 1, max: 64 },
  },
};
