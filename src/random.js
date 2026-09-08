// Randomness helpers (shared)
export const PRESET_NUMBER_BITS = 14;
export const PRESET_SPECIAL_CHARS = '!?$#&-.';
const UINT32_RANGE = 2 ** 32;

function getCrypto() {
  if (globalThis.crypto?.getRandomValues) {
    return globalThis.crypto;
  }
  throw new Error('Web Crypto API not supported');
}

export function randomBytes(sizeBytes) {
  if (!Number.isSafeInteger(sizeBytes) || sizeBytes < 0) {
    throw new RangeError('sizeBytes must be a non-negative safe integer');
  }
  const buf = new Uint8Array(sizeBytes);
  // Web Crypto limits each request to 65,536 bytes.
  const crypto = getCrypto();
  for (let offset = 0; offset < buf.length; offset += 65536) {
    crypto.getRandomValues(buf.subarray(offset, offset + 65536));
  }
  return buf;
}

export function getRandomString(length, charset) {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw new RangeError('length must be a non-negative safe integer');
  }

  const characters = Array.from(charset || '');
  if (characters.length === 0) {
    throw new RangeError('charset must not be empty');
  }

  return randomIndices(length, characters.length)
    .map((index) => characters[index])
    .join('');
}

export function randomIndices(count, max) {
  if (!Number.isSafeInteger(count) || count < 0) {
    throw new RangeError('count must be a non-negative safe integer');
  }
  if (!Number.isSafeInteger(max) || max < 1 || max > UINT32_RANGE) {
    throw new RangeError('max must be an integer from 1 through 2^32');
  }

  const out = [];
  // Use rejection sampling to avoid modulo bias for 32-bit values.
  const threshold = Math.floor(UINT32_RANGE / max) * max;
  while (out.length < count) {
    const pool = new Uint32Array(Math.min(1024, count - out.length));
    getCrypto().getRandomValues(pool);
    for (let i = 0; i < pool.length && out.length < count; i++) {
      const value = pool[i];
      if (value < threshold) {
        out.push(value % max);
      }
    }
  }
  return out;
}

export function generateWordRows({ lines, words, wordArray }) {
  // Validate each dimension: an integer product can hide fractional inputs.
  if (
    !Number.isSafeInteger(lines) ||
    lines < 1 ||
    !Number.isSafeInteger(words) ||
    words < 1
  ) {
    throw new RangeError('lines and words must be positive safe integers');
  }
  if (!Array.isArray(wordArray) || wordArray.length === 0) {
    throw new RangeError('wordArray must be a non-empty array');
  }
  const indices = randomIndices(lines * words, wordArray.length);
  const rows = [];
  let index = 0;
  for (let row = 0; row < lines; row++) {
    const line = [];
    for (let n = 0; n < words; n++) {
      line.push(wordArray[indices[index]]);
      index += 1;
    }
    rows.push(line);
  }
  return rows;
}

export function randomNumber(bits) {
  // Return an integer in [0, 2^bits - 1].
  if (!Number.isInteger(bits) || bits < 1 || bits > 32) {
    throw new RangeError('bits must be an integer from 1 through 32');
  }
  return randomIndices(1, 2 ** bits)[0];
}

export function randomSpecialChar() {
  // de-duplicated special characters; can be made configurable later
  return PRESET_SPECIAL_CHARS.charAt(
    randomIndices(1, PRESET_SPECIAL_CHARS.length)[0]
  );
}

export function presetExtraEntropyBits() {
  return PRESET_NUMBER_BITS + Math.log2(PRESET_SPECIAL_CHARS.length);
}

// Sample suffixes in batches, and only for the preset that actually uses them.
export function generatePassphrases({ mode, ...options }) {
  const rows = generateWordRows(options);
  if (mode !== 'preset1') return rows.map((row) => row.join(' '));
  const numbers = randomIndices(rows.length, 2 ** PRESET_NUMBER_BITS);
  const symbols = randomIndices(rows.length, PRESET_SPECIAL_CHARS.length);
  return rows.map(
    (row, index) =>
      row.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('') +
      numbers[index] +
      PRESET_SPECIAL_CHARS[symbols[index]]
  );
}
