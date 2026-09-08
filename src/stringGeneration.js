import { encode } from 'base64-arraybuffer';
import { randomBytes, getRandomString } from './random';
import { stringMetrics } from './entropy';

export function generateStrings({ rows, sizeBytes, charset }) {
  const { length } = stringMetrics(sizeBytes, charset);
  if (charset.key === 'base64') {
    // One crypto request supplies every row, with independent byte slices.
    const bytes = randomBytes(rows * sizeBytes);
    return Array.from({ length: rows }, (_, index) =>
      encode(
        bytes.slice(index * sizeBytes, (index + 1) * sizeBytes).buffer
      ).replace(/=+$/, '')
    );
  }
  const characters = getRandomString(rows * length, charset.charset);
  return Array.from({ length: rows }, (_, index) =>
    characters.slice(index * length, (index + 1) * length)
  );
}
