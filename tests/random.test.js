import { describe, expect, it, vi } from 'vitest';
import {
  randomBytes,
  randomIndices,
  randomNumber,
  generateWordRows,
} from '../src/random';
import {
  loadWordList,
  validateWordList,
  WORD_LIST_OPTIONS,
} from '../src/words';
import {
  normaliseParams,
  needsCanonicalPath,
  generatePath,
} from '../src/routeParams';

describe('random sampling boundaries', () => {
  it('rejects the incomplete bucket and accepts boundary values without bias', () => {
    const values = [0xffffffff, 0, 0xfffffffe];
    const rng = vi
      .spyOn(globalThis.crypto, 'getRandomValues')
      .mockImplementation((buffer) => {
        for (let i = 0; i < buffer.length; i++) buffer[i] = values.shift();
        return buffer;
      });
    expect(randomIndices(2, 3)).toEqual([0, 2]);
    expect(rng).toHaveBeenCalledTimes(2);
  });

  it('supports the full unsigned 32-bit range', () => {
    vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation(
      (buffer) => buffer.fill(0xffffffff)
    );
    expect(randomNumber(32)).toBe(0xffffffff);
    expect(randomNumber(1)).toBe(1);
  });

  it.each([0, -1, 1.5, 33, NaN, Infinity, '14'])(
    'rejects invalid bit count %s',
    (bits) => {
      expect(() => randomNumber(bits)).toThrow(RangeError);
    }
  );

  it('rejects fractional dimensions even if their product is integral', () => {
    expect(() =>
      generateWordRows({ lines: 1.5, words: 2, wordArray: ['a'] })
    ).toThrow(RangeError);
    expect(() =>
      generateWordRows({ lines: 2, words: 1.5, wordArray: ['a'] })
    ).toThrow(RangeError);
    expect(() =>
      generateWordRows({ lines: 1, words: 1, wordArray: [] })
    ).toThrow(RangeError);
  });

  it('splits byte requests at the Web Crypto quota', () => {
    const rng = vi
      .spyOn(globalThis.crypto, 'getRandomValues')
      .mockImplementation((buffer) => {
        expect(buffer.byteLength).toBeLessThanOrEqual(65536);
        return buffer.fill(7);
      });
    const bytes = randomBytes(65537);
    expect(bytes[65536]).toBe(7);
    expect(rng).toHaveBeenCalledTimes(2);
    expect(() => randomBytes(1.5)).toThrow(RangeError);
  });
});

describe('dictionary integrity', () => {
  it.each(WORD_LIST_OPTIONS)(
    'validates every entry in $id',
    async ({ id, count }) => {
      const words = await loadWordList(id);
      expect(words).toHaveLength(count);
      expect(new Set(words).size).toBe(count);
    }
  );

  it('rejects duplicate, empty, malformed and truncated assets', () => {
    for (const raw of ['a|a', 'a|', 'a|B', 'a', null]) {
      expect(() => validateWordList(raw, 2)).toThrow();
    }
  });
});

describe('bookmark parameters', () => {
  it('replaces malformed and out-of-bounds settings without partial parsing', () => {
    const params = {
      wordsPerPassphrase: '3abc',
      numberOfPassphrases: '999',
      wordList: 'missing',
    };
    const normalised = normaliseParams(params, 'preset1');
    expect(generatePath(normalised)).toBe('/preset1/6/100/eff-long');
    expect(needsCanonicalPath(params, normalised)).toBe(true);
  });

  it('keeps valid shorthand bookmarks', () => {
    const params = { wordsPerPassphrase: '4' };
    expect(needsCanonicalPath(params, normaliseParams(params))).toBe(false);
    expect(needsCanonicalPath({}, normaliseParams({}))).toBe(false);
  });
});
