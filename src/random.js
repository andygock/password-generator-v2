// Randomness helpers (shared)
export function randomBytes(sizeBytes) {
  if (window.crypto && window.crypto.getRandomValues) {
    const buf = new Uint8Array(sizeBytes);
    return window.crypto.getRandomValues(buf);
  }
  throw new Error('Web Crypto API not supported');
}

export function getRandomString(length, charset) {
  if (!charset || charset.length === 0) return '';
  const out = [];
  const charLen = charset.length;
  // rejection sampling threshold for unbiased selection from bytes (0-255)
  const threshold = Math.floor(256 / charLen) * charLen;
  while (out.length < length) {
    const pool = new Uint8Array(Math.min(1024, (length - out.length) * 4));
    window.crypto.getRandomValues(pool);
    for (let i = 0; i < pool.length && out.length < length; i++) {
      const v = pool[i];
      if (v < threshold) {
        out.push(charset[v % charLen]);
      }
    }
  }
  return out.join('');
}

export function randomIndices(count, max) {
  if (max <= 0) return [];
  const out = [];
  // Use rejection sampling to avoid modulo bias for 32-bit values
  const RANGE = 4294967296; // 2^32
  const threshold = Math.floor(RANGE / max) * max;
  while (out.length < count) {
    const pool = new Uint32Array(Math.min(1024, count - out.length));
    window.crypto.getRandomValues(pool);
    for (let i = 0; i < pool.length && out.length < count; i++) {
      const v = pool[i] >>> 0;
      if (v < threshold) {
        out.push(v % max);
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
  const arr = new Uint32Array(1);
  window.crypto.getRandomValues(arr);
  return arr[0] % Math.pow(2, bits);
}

export function randomSpecialChar() {
  const specialChars = '!?$#$&-.';
  const arr = new Uint8Array(1);
  window.crypto.getRandomValues(arr);
  return specialChars.charAt(arr[0] % specialChars.length);
}
