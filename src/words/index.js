export const WORD_LIST_OPTIONS = [
  {
    id: 'orchard-street-long',
    text: 'Orchard Street Long',
    count: 17576,
    load: () => import('./orchard-street-long'),
  },
  {
    id: 'eff-long',
    text: 'EFF long word list',
    count: 7776,
    load: () => import('./eff-long'),
  },
  {
    id: 'eff-short1',
    text: 'EFF short word list v1',
    count: 1296,
    load: () => import('./eff-short1'),
  },
  {
    id: 'eff-short2',
    text: 'EFF short word list v2',
    count: 1296,
    load: () => import('./eff-short2'),
  },
];

export const getWordListOption = (id) =>
  WORD_LIST_OPTIONS.find((option) => option.id === id);

export async function loadWordList(id) {
  const option = getWordListOption(id);
  if (!option) throw new Error(`Unknown word list: ${id}`);

  const module = await option.load();
  return module.default.split('|');
}
