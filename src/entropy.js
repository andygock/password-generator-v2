import { PRESET_NUMBER_BITS, presetExtraEntropyBits } from './random';

// Keep full precision in estimates; rounding belongs only in the presentation.
export const formatEntropy = (bits) => Number(bits.toFixed(2)).toString();

export function dictionaryMetrics(wordArray, words, mode) {
  // Validated dictionaries contain ASCII only. Use the longest possible output,
  // not this random batch, so estimates remain valid for the whole search space.
  const longestWord = wordArray.reduce(
    (max, word) => Math.max(max, word.length),
    0
  );
  const preset = mode === 'preset1';
  return {
    bits:
      words * Math.log2(wordArray.length) +
      (preset ? presetExtraEntropyBits() : 0),
    maxPasswordBytes:
      words * longestWord +
      (preset ? String(2 ** PRESET_NUMBER_BITS - 1).length + 1 : words - 1),
  };
}

export function stringMetrics(sizeBytes, charset) {
  const length =
    charset.key === 'base64'
      ? Math.ceil((sizeBytes * 8) / 6)
      : Math.ceil((sizeBytes * 8) / Math.log2(charset.charset.length));
  return {
    length,
    bits:
      charset.key === 'base64'
        ? sizeBytes * 8
        : length * Math.log2(charset.charset.length),
  };
}
