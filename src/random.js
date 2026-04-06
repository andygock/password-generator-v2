// Randomness helpers (shared)
export function randomBytes(sizeBytes) {
  if (window.crypto && window.crypto.getRandomValues) {
    const buf = new Uint8Array(sizeBytes);
    return window.crypto.getRandomValues(buf);
  }
  throw new Error('Web Crypto API not supported');
}

export function getRandomString(length, charset) {
  const arr = new Uint8Array(length);
  window.crypto.getRandomValues(arr);
  const chars = new Array(length);
  for (let i = 0; i < length; ++i) {
    chars[i] = charset[arr[i] % charset.length];
  }
  return chars.join('');
}

export function randomIndices(count, max) {
  const arr = new Uint32Array(count);
  window.crypto.getRandomValues(arr);
  return Array.from(arr).map((v) => v % max);
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
