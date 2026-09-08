export const WORD_LIST_OPTIONS = [
  {
    id: 'orchard-street-long',
    text: 'Orchard Street Long',
    count: 17576,
    load: () => import('./orchard-street-long.js'),
  },
  {
    id: 'eff-long',
    text: 'EFF long word list',
    count: 7776,
    load: () => import('./eff-long.js'),
  },
  {
    id: 'eff-short1',
    text: 'EFF short word list v1',
    count: 1296,
    load: () => import('./eff-short1.js'),
  },
  {
    id: 'eff-short2',
    text: 'EFF short word list v2',
    count: 1296,
    load: () => import('./eff-short2.js'),
  },
];

export const getWordListOption = (id) =>
  WORD_LIST_OPTIONS.find((option) => option.id === id);

// Cache validated arrays as well as imports. Evict failures to allow retries.
const wordListCache = new Map();

export function loadWordList(id) {
  const option = getWordListOption(id);
  if (!option) return Promise.reject(new Error(`Unknown word list: ${id}`));
  if (!wordListCache.has(id)) {
    const pending = Promise.resolve()
      .then(() => option.load())
      .then((module) =>
        Object.freeze(validateWordList(module.default, option.count))
      )
      .catch((error) => {
        wordListCache.delete(id);
        throw error;
      });
    wordListCache.set(id, pending);
  }
  return wordListCache.get(id);
}

export function validateWordList(raw, expectedCount) {
  if (typeof raw !== 'string') throw new Error('Invalid word list format');
  const words = raw.split('|');
  // Counts and uniqueness underpin the entropy calculation, including the
  // capitalised preset. Reject changed or damaged assets before generation.
  const capitalised = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1)
  );
  if (
    words.length !== expectedCount ||
    words.some((word) => !/^[a-z]+(?:-[a-z]+)*$/.test(word)) ||
    new Set(words).size !== expectedCount ||
    new Set(capitalised).size !== expectedCount
  ) {
    throw new Error('Word list failed integrity validation');
  }
  return words;
}
