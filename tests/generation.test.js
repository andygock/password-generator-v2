import { describe, expect, it, vi } from 'vitest';
import { CHARSETS } from '../src/charsets';
import { generatePassphrases, presetExtraEntropyBits } from '../src/random';
import { generateStrings } from '../src/stringGeneration';
import { formatEntropy, stringMetrics } from '../src/entropy';
import { normaliseStringParams } from '../src/routeParams';
import { WORLD_COMPUTE_MULTIPLIER } from '../src/computeProfiles';

it('only draws word randomness in normal mode and batches preset suffixes', () => {
  const rng = vi
    .spyOn(globalThis.crypto, 'getRandomValues')
    .mockImplementation((buffer) => buffer.fill(0));
  const options = { words: 6, lines: 100, wordArray: ['alpha', 'beta'] };
  const normal = generatePassphrases({ ...options, mode: 'normal' });
  expect(normal).toHaveLength(100);
  expect(normal[0]).toBe('alpha alpha alpha alpha alpha alpha');
  expect(rng).toHaveBeenCalledTimes(1);
  rng.mockClear();
  const preset = generatePassphrases({ ...options, mode: 'preset1' });
  expect(preset[0]).toBe('AlphaAlphaAlphaAlphaAlphaAlpha0!');
  expect(rng).toHaveBeenCalledTimes(3);
});

describe('generation and actual entropy', () => {
  it.each(CHARSETS)(
    'produces bounded $key batches with accurate entropy',
    (charset) => {
      for (const sizeBytes of [1, 16, 64]) {
        const values = generateStrings({ rows: 20, sizeBytes, charset });
        const metrics = stringMetrics(sizeBytes, charset);
        expect(values).toHaveLength(20);
        expect(values.every((value) => value.length === metrics.length)).toBe(
          true
        );
        expect(
          values.every((value) =>
            Array.from(value).every((char) => charset.charset.includes(char))
          )
        ).toBe(true);
        expect(metrics.bits).toBeGreaterThanOrEqual(sizeBytes * 8);
        if (charset.key === 'base64') expect(metrics.bits).toBe(sizeBytes * 8);
        else
          expect(metrics.bits).toBe(
            metrics.length * Math.log2(charset.charset.length)
          );
      }
    }
  );

  it('does not reuse the same bytes between Base64 rows', () => {
    vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(
      (buffer) => {
        for (let index = 0; index < buffer.length; index++)
          buffer[index] = index;
        return buffer;
      }
    );
    expect(
      generateStrings({
        rows: 3,
        sizeBytes: 1,
        charset: CHARSETS.find(({ key }) => key === 'base64'),
      })
    ).toEqual(['AA', 'AQ', 'Ag']);
  });

  it('preserves fractional entropy until display formatting', () => {
    expect(presetExtraEntropyBits()).toBe(14 + Math.log2(7));
    expect(formatEntropy(128)).toBe('128');
    expect(formatEntropy(128.12345)).toBe('128.12');
  });
});

it('normalises String bookmarks without partial number parsing', () => {
  expect(
    normaliseStringParams(new URLSearchParams('bytes=3abc&charset=unknown'))
  ).toEqual({ sizeBytes: 16, charsetKey: 'websafe' });
  expect(
    normaliseStringParams(new URLSearchParams('bytes=999&charset=hex'))
  ).toEqual({ sizeBytes: 64, charsetKey: 'hex' });
  expect(
    normaliseStringParams(new URLSearchParams('bytes=-1&charset=base64'))
  ).toEqual({ sizeBytes: 1, charsetKey: 'base64' });
});

it('keeps the world-compute profile within the data-centre power upper bound', () => {
  const averageDataCentreWatts = 415e12 / (365 * 24);
  const maximumRtx5090Equivalents = averageDataCentreWatts / 575;
  expect(WORLD_COMPUTE_MULTIPLIER).toBe(80_000_000);
  expect(WORLD_COMPUTE_MULTIPLIER).toBeLessThan(maximumRtx5090Equivalents);
});

it('shares validated dictionaries across concurrent loads and retries failures', async () => {
  // Use a fresh module cache so the test never depends on another test's loads.
  vi.resetModules();
  const { loadWordList, WORD_LIST_OPTIONS } = await import('../src/words');
  const option = WORD_LIST_OPTIONS.find(({ id }) => id === 'eff-short1');
  const load = vi
    .spyOn(option, 'load')
    .mockRejectedValueOnce(new Error('Offline'));
  await expect(loadWordList(option.id)).rejects.toThrow('Offline');
  const first = loadWordList(option.id);
  const second = loadWordList(option.id);
  expect(first).toBe(second);
  const result = await first;
  expect(await loadWordList(option.id)).toBe(result);
  expect(result).toHaveLength(1296);
  expect(Object.isFrozen(result)).toBe(true);
  expect(load).toHaveBeenCalledTimes(2);
});
