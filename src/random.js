// Randomness helpers (shared)
export const PRESET_NUMBER_BITS = 14;
export const PRESET_SPECIAL_CHARS = '!?$#&-.';
const UINT32_RANGE = 2 ** 32;

function getCrypto() {
  if (window.crypto && window.crypto.getRandomValues) {
    return window.crypto;
  }
  throw new Error('Web Crypto API not supported');
}

export function randomBytes(sizeBytes) {
  const buf = new Uint8Array(sizeBytes);
  return getCrypto().getRandomValues(buf);
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
  // Cap bits between 1 and 32 for safe 32-bit generation.
  const safeBits = Math.min(Math.max(1, Number(bits) || 0), 32);
  const max = Math.pow(2, safeBits);
  const threshold = Math.floor(UINT32_RANGE / max) * max;
  const outArr = new Uint32Array(1);
  while (true) {
    getCrypto().getRandomValues(outArr);
    const v = outArr[0] >>> 0;
    if (v < threshold) return v % max;
    // otherwise retry
  }
}

export function randomSpecialChar() {
  // de-duplicated special characters; can be made configurable later
  return PRESET_SPECIAL_CHARS.charAt(
    randomIndices(1, PRESET_SPECIAL_CHARS.length)[0]
  );
}

export function presetExtraEntropyBits() {
  return Math.floor(
    PRESET_NUMBER_BITS + Math.log2(PRESET_SPECIAL_CHARS.length)
  );
}
