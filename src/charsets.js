// Charset definitions for password generation
export const CHARSETS = [
  {
    key: 'hex',
    label: 'Hexadecimal',
    charset: '0123456789abcdef',
    description: '0-9, a-f',
  },
  {
    key: 'base62',
    label: 'Base62',
    charset: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
    description: '0-9, A-Z, a-z',
  },
  {
    key: 'websafe',
    label: 'Web Safe',
    charset:
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*',
    description: 'A-Z, a-z, 0-9, !@#$%^&*',
  },
  {
    key: 'human',
    label: 'Human Friendly',
    charset: 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#%+=!?',
    description: 'No confusing chars, plus @#%+=!?',
  },
  {
    key: 'base64',
    label: 'Base64',
    charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
    description: 'A-Z, a-z, 0-9, +/',
  },
];
