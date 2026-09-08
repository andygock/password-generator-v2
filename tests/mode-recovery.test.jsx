import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import App from '../src/App';

vi.mock('../src/StringGenerator', () => ({
  default: () => {
    throw new Error('String generator unavailable');
  },
}));
vi.mock('../src/words', async (importOriginal) => ({
  ...(await importOriginal()),
  loadWordList: () => Promise.resolve(['example']),
}));

it('allows Dictionary navigation after the String generator fails', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  window.location.hash = '#/string';
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  try {
    await act(async () => {
      root.render(<App />);
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(container.querySelector('[role="alert"]').textContent).toContain(
      'Unable to open'
    );
    await act(async () => {
      container.querySelector('nav a').click();
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
    expect(container.querySelector('[role="alert"]')).toBeNull();
    expect(container.querySelector('input[readonly]').value).toContain(
      'example'
    );
  } finally {
    await act(() => root.unmount());
    container.remove();
  }
});
