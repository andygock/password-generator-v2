// Keep full precision in estimates; rounding belongs only in the presentation.
export const formatEntropy = (bits) => Number(bits.toFixed(2)).toString();

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
