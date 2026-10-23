import { act, lazy, Suspense, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import NumberPicker from '../src/NumberPicker';
import OutputStrings from '../src/OutputStrings';
import CommandLine from '../src/CommandLine';
import WordListOutput from '../src/WordListOutput';
import GeneratorErrorBoundary from '../src/GeneratorErrorBoundary';
import useCopyFeedback from '../src/useCopyFeedback';
import * as words from '../src/words';
import App from '../src/App';
import Tooltip from '../src/Tooltip';
import EstimateCrackingTime from '../src/EstimateCrackingTime';

const copy = vi.fn();

let container;
let root;
beforeEach(() => {
  container = document.createElement('div');
  document.body.append(container);
  root = createRoot(container);
  copy.mockReset().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText: copy },
  });
});
afterEach(async () => {
  await act(() => root.unmount());
  container.remove();
  vi.useRealTimers();
});

async function render(element) {
  await act(async () => {
    root.render(element);
  });
}
async function click(element) {
  await act(async () => {
    element.click();
  });
}
async function type(input, value) {
  // Bypass React's value tracker as a native edit would.
  await act(() => {
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    ).set.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
}

it('allows empty numeric drafts and commits/clamps only on blur', async () => {
  const onChange = vi.fn();
  function Picker() {
    const [value, setValue] = useState(6);
    return (
      <NumberPicker
        label="Words per passphrase"
        value={value}
        min={1}
        max={12}
        onChange={(next) => {
          onChange(next);
          setValue(next);
        }}
      />
    );
  }
  await render(<Picker />);
  const input = container.querySelector('input');
  expect(container.querySelector('label').htmlFor).toBe(input.id);
  input.focus();
  await type(input, '');
  expect(input.value).toBe('');
  expect(onChange).not.toHaveBeenCalled();
  await type(input, '10');
  await act(() =>
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    )
  );
  expect(onChange).toHaveBeenLastCalledWith(10);
  input.focus();
  await type(input, '999');
  await act(() => input.blur());
  expect(input.value).toBe('12');
  expect(
    container.querySelector('[aria-label="Increase words per passphrase"]')
      .disabled
  ).toBe(true);
});

it('replaces unfinished edits when navigation changes the value', async () => {
  await render(<NumberPicker label="Count" value={6} min={1} max={100} />);
  await type(container.querySelector('input'), '88');
  await render(<NumberPicker label="Count" value={20} min={1} max={100} />);
  expect(container.querySelector('input').value).toBe('20');
});

it('clears copied selection and notifications when strings regenerate', async () => {
  vi.useFakeTimers();
  await render(<OutputStrings values={['old-password']} />);
  await click(container.querySelector('button'));
  expect(container.querySelector('[data-copied]')).not.toBeNull();
  expect(container.textContent).toContain('Password copied');
  await render(<OutputStrings values={['new-password']} />);
  expect(container.querySelector('[data-copied]')).toBeNull();
  expect(container.textContent).not.toContain('Password copied');
  expect(vi.getTimerCount()).toBe(0);
});

it('resets all feedback and never resurrects it when settings are toggled back', async () => {
  vi.useFakeTimers();
  function Feedback({ setting }) {
    const { copyText, copied, copyNotify, resetCopied } = useCopyFeedback({
      resetKey: setting,
    });
    return (
      <>
        <button onClick={() => copyText('example')}>Copy</button>
        <button onClick={resetCopied}>Reset</button>
        <p>
          {copied}:{copyNotify}
        </p>
      </>
    );
  }
  await render(<Feedback setting="a" />);
  await click(container.querySelector('button'));
  await click(container.querySelectorAll('button')[1]);
  expect(container.querySelector('p').textContent).toBe(':');
  expect(vi.getTimerCount()).toBe(0);
  await click(container.querySelector('button'));
  await render(<Feedback setting="b" />);
  await render(<Feedback setting="a" />);
  expect(container.querySelector('p').textContent).toBe(':');
});

it('reports command-copy failures visibly and clears old selection', async () => {
  await render(<CommandLine charsetKey="hex" bits={128} />);
  await act(() => {
    const details = container.querySelector('details');
    details.open = true;
    details.dispatchEvent(new Event('toggle'));
  });
  await click(container.querySelector('button'));
  copy.mockImplementation(() => {
    throw new Error('Clipboard unavailable');
  });
  await click(container.querySelector('button'));
  expect(container.querySelector('[role="status"]').textContent).toContain(
    'Automatic copy unavailable'
  );
  expect(container.querySelector('button').textContent).toBe('Copy');
});

it('retries a failed dictionary download and ignores late results from an old list', async () => {
  let finishOld;
  const old = new Promise((resolve) => {
    finishOld = resolve;
  });
  vi.spyOn(words, 'loadWordList')
    .mockReturnValueOnce(old)
    .mockRejectedValueOnce(new Error('Offline'))
    .mockResolvedValueOnce(['fresh']);
  await render(<WordListOutput key="old" wordList="old" words={1} lines={1} />);
  await render(<WordListOutput key="new" wordList="new" words={1} lines={1} />);
  expect(container.querySelector('[role="alert"]')).not.toBeNull();
  await act(() => finishOld(['stale']));
  expect(container.textContent).not.toContain('stale');
  await click(container.querySelector('button'));
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.querySelector('input[readonly]').value).toBe('fresh');
});

it('shows loading instead of an old dictionary error when selection changes', async () => {
  vi.spyOn(words, 'loadWordList')
    .mockRejectedValueOnce(new Error('Offline'))
    .mockReturnValueOnce(new Promise(() => {}));
  await render(<WordListOutput key="old" wordList="old" words={1} lines={1} />);
  await render(<WordListOutput key="new" wordList="new" words={1} lines={1} />);
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.textContent).toContain('Loading word list');
});

it('recovers rejected lazy chunks with a visible reload control', async () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  const Broken = lazy(() => Promise.reject(new Error('Chunk unavailable')));
  await render(
    <GeneratorErrorBoundary>
      <Suspense fallback="Loading">
        <Broken />
      </Suspense>
    </GeneratorErrorBoundary>
  );
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Unable to open'
  );
  expect(container.querySelector('button').textContent).toBe('Reload page');
});

it('redirects unmatched routes and normalises malformed bookmarks', async () => {
  vi.spyOn(words, 'loadWordList').mockResolvedValue(['example']);
  window.location.hash = '#/unmatched/path/with/four/segments';
  await render(<App />);
  // Let lazy route modules and their navigation effects settle.
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(window.location.hash).toBe('#/');
  await act(() => {
    window.location.hash = '#/3abc/999/missing';
  });
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(window.location.hash).toBe('#/6/100/eff-long');
});

it('exposes the full password for manual selection when automatic copying is unavailable', async () => {
  vi.useFakeTimers();
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: undefined,
  });
  await render(<OutputStrings values={['manually-select-this']} />);
  const input = container.querySelector('input[readonly]');
  expect(input.getAttribute('aria-label')).toBe('Password 1');
  await act(() => input.focus());
  expect(input.selectionStart).toBe(0);
  expect(input.selectionEnd).toBe(input.value.length);
  await click(container.querySelector('button'));
  await act(() => vi.advanceTimersByTime(5000));
  expect(container.querySelector('[role="status"]').textContent).toContain(
    'copy it manually'
  );
});

it('ignores late clipboard results after regeneration', async () => {
  let finishCopy;
  copy.mockImplementation(
    () =>
      new Promise((resolve) => {
        finishCopy = resolve;
      })
  );
  await render(<OutputStrings values={['old-password']} />);
  await click(container.querySelector('button'));
  await render(<OutputStrings values={['new-password']} />);
  await act(() => finishCopy());
  expect(container.querySelector('[data-copied]')).toBeNull();
  expect(container.querySelector('[role="status"]').textContent).toBe('');
});

it('keeps feedback from the most recent copy when promises finish out of order', async () => {
  let finishFirst;
  copy.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishFirst = resolve;
      })
  );
  await render(<OutputStrings values={['first', 'second']} />);
  await click(container.querySelectorAll('button')[0]);
  await click(container.querySelectorAll('button')[1]);
  await act(() => finishFirst());
  expect(container.querySelector('[data-copied] input').value).toBe('second');
});

it('restores bookmarked String settings and replaces malformed values', async () => {
  window.location.hash = '#/string?bytes=1&charset=hex';
  await render(<App />);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(container.querySelector('input[type="range"]').value).toBe('1');
  expect(container.querySelector('input[readonly]').value).toHaveLength(2);
  await act(async () => {
    window.location.hash = '#/string?bytes=3abc&charset=missing';
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(window.location.hash).toBe('#/string?bytes=16&charset=websafe');
  expect(container.querySelector('input[type="range"]').value).toBe('16');
  expect(container.querySelector('input[value="websafe"]').checked).toBe(true);
});

it('recovers generation after a crypto failure without showing stale passwords', async () => {
  window.location.hash = '#/string?bytes=1&charset=hex';
  const rng = vi
    .spyOn(globalThis.crypto, 'getRandomValues')
    .mockImplementation(() => {
      throw new Error('Randomness unavailable');
    });
  await render(<App />);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  expect(container.querySelector('[role="alert"]').textContent).toContain(
    'Randomness unavailable'
  );
  expect(container.querySelector('input[readonly]')).toBeNull();
  rng.mockRestore();
  await click(
    Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Regenerate'
    )
  );
  expect(container.querySelector('[role="alert"]')).toBeNull();
  expect(container.querySelector('input[readonly]').value).toHaveLength(2);
});

it('shows benchmark settings, accessible help and world compute', async () => {
  window.location.hash = '#/6/20/eff-long';
  await render(<App />);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  const estimate = container.querySelector('[aria-label="Cracking estimates"]');
  expect(estimate.textContent).toContain('World compute');
  expect(estimate.textContent).not.toContain('Mode 1000');
  expect(estimate.textContent).not.toContain('Cost 5 (32 iterations)');
  expect(estimate.textContent).not.toContain('600,000 iterations');
  for (const [label, settings] of [
    ['bcrypt $2*$, Blowfish (Unix)', 'Cost 5 (32 iterations)'],
    ['PBKDF2-HMAC-SHA256 (600k iterations)', '600,000 iterations'],
  ]) {
    const link = Array.from(estimate.querySelectorAll('a')).find(
      (link) => link.textContent === label
    );
    await act(() => link.focus());
    expect(
      document.getElementById(link.getAttribute('aria-describedby')).textContent
    ).toContain(settings);
    await act(() => link.blur());
  }
  expect(
    estimate.querySelector('[aria-label="About benchmark rates"]')
  ).not.toBeNull();
  expect(
    estimate.querySelector('[aria-label="How world compute is estimated"]')
  ).not.toBeNull();
  const ntlm = Array.from(estimate.querySelectorAll('a')).find(
    (link) => link.textContent === 'NTLM'
  );
  await act(() => ntlm.focus());
  const algorithmTooltip = document.getElementById(
    ntlm.getAttribute('aria-describedby')
  );
  expect(algorithmTooltip.getAttribute('role')).toBe('tooltip');
  expect(algorithmTooltip.textContent).toContain('legacy Microsoft');
  await act(() => ntlm.blur());
  expect(document.getElementById(algorithmTooltip.id)).toBeNull();

  const universeLimit = Array.from(estimate.querySelectorAll('button')).find(
    (button) => button.textContent === '>13.8B yrs'
  );
  await act(() => universeLimit.focus());
  const universeTooltip = document.getElementById(
    universeLimit.getAttribute('aria-describedby')
  );
  expect(universeTooltip.getAttribute('role')).toBe('tooltip');
  expect(universeTooltip.textContent).toContain('age of the universe');
});

it('allows hovering help and dismissing it with Escape without moving focus', async () => {
  vi.useFakeTimers();
  await render(<Tooltip label="Help">Useful explanation</Tooltip>);
  const button = container.querySelector('button');
  const anchor = button.parentElement;
  await act(() =>
    anchor.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  );
  const tooltip = document.querySelector('[role="tooltip"]');
  expect(tooltip.textContent).toBe('Useful explanation');
  await act(() =>
    anchor.dispatchEvent(
      new MouseEvent('mouseout', {
        bubbles: true,
        relatedTarget: document.body,
      })
    )
  );
  await act(() =>
    tooltip.dispatchEvent(
      new MouseEvent('mouseover', {
        bubbles: true,
        relatedTarget: document.body,
      })
    )
  );
  await act(() => vi.advanceTimersByTime(500));
  expect(document.getElementById(tooltip.id)).not.toBeNull();
  await act(() =>
    tooltip.dispatchEvent(
      new MouseEvent('mouseout', {
        bubbles: true,
        relatedTarget: document.body,
      })
    )
  );
  await act(() => vi.advanceTimersByTime(500));
  expect(document.getElementById(tooltip.id)).toBeNull();
  await act(() => button.focus());
  expect(document.querySelector('[role="tooltip"]')).not.toBeNull();
  await act(() =>
    button.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    )
  );
  expect(document.activeElement).toBe(button);
  expect(document.querySelector('[role="tooltip"]')).toBeNull();
});

it('withholds bcrypt estimates beyond its input limit, including unknown lengths', async () => {
  for (const maxPasswordBytes of [72, 73, 128, undefined]) {
    await render(
      <EstimateCrackingTime bits={512} maxPasswordBytes={maxPasswordBytes} />
    );
    const row = Array.from(container.querySelectorAll('tbody tr')).find((row) =>
      row.textContent.includes('bcrypt')
    );
    expect(row.textContent.includes('Unavailable')).toBe(
      maxPasswordBytes !== 72
    );
    if (maxPasswordBytes !== 72) {
      const link = row.querySelector('a');
      await act(() => link.focus());
      expect(
        document.getElementById(link.getAttribute('aria-describedby'))
          .textContent
      ).toContain('truncate or reject');
      await act(() => link.blur());
    }
    const md5 = Array.from(container.querySelectorAll('tbody tr')).find((row) =>
      row.textContent.includes('MD5')
    );
    expect(md5.textContent).not.toContain('Unavailable');
  }
});

it('passes String output length to the cracking estimator', async () => {
  window.location.hash = '#/string?bytes=64&charset=hex';
  await render(<App />);
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
  });
  const row = Array.from(container.querySelectorAll('tbody tr')).find((row) =>
    row.textContent.includes('bcrypt')
  );
  expect(row.textContent).toContain('Unavailable');
});

it('keeps dictionary compatibility tied to possible phrases, not sampled output', async () => {
  vi.spyOn(words, 'loadWordList').mockResolvedValue(['a', 'abcdefgh']);
  vi.spyOn(globalThis.crypto, 'getRandomValues').mockImplementation((buffer) =>
    buffer.fill(0)
  );
  await render(
    <WordListOutput wordList="test" words={9} lines={1} mode="normal" />
  );
  expect(container.querySelector('input[readonly]').value.length).toBeLessThan(
    72
  );
  const bcryptRow = () =>
    Array.from(container.querySelectorAll('tbody tr')).find((row) =>
      row.textContent.includes('bcrypt')
    );
  expect(bcryptRow().textContent).toContain('Unavailable');
  await render(
    <WordListOutput wordList="test" words={8} lines={1} mode="normal" />
  );
  expect(bcryptRow().textContent).not.toContain('Unavailable');
});

it.each([
  { x: 700, expectedLeft: 438 },
  { x: 100, expectedLeft: 112 },
])(
  'positions hover help beside the pointer at x=$x',
  async ({ x, expectedLeft }) => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function () {
        return this.getAttribute('role') === 'tooltip'
          ? { width: 250, height: 80 }
          : { left: x, right: x + 20, top: 190, bottom: 210 };
      }
    );
    await render(<Tooltip label="Help">Positioned help</Tooltip>);
    await act(() =>
      container.querySelector('button').dispatchEvent(
        new MouseEvent('mouseover', {
          bubbles: true,
          clientX: x,
          clientY: 200,
        })
      )
    );
    const tooltip = document.querySelector('[role="tooltip"]');
    expect(tooltip.style.left).toBe(`${expectedLeft}px`);
    expect(tooltip.style.top).toBe('160px');
  }
);

it('places help above the trigger when neither side fits', async () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
    function () {
      return this.getAttribute('role') === 'tooltip'
        ? { width: window.innerWidth - 16, height: 80 }
        : { left: 400, right: 420, top: 190, bottom: 210 };
    }
  );
  await render(<Tooltip label="Help">Wide help</Tooltip>);
  await act(() =>
    container.querySelector('button').dispatchEvent(
      new MouseEvent('mouseover', {
        bubbles: true,
        clientX: 400,
        clientY: 200,
      })
    )
  );
  const tooltip = document.querySelector('[role="tooltip"]');
  expect(tooltip.style.left).toBe('8px');
  expect(tooltip.style.top).toBe('98px');
});

it('immediately replaces old hover help and cancels its pending dismissal', async () => {
  vi.useFakeTimers();
  await render(
    <>
      <Tooltip label="First">First help</Tooltip>
      <Tooltip label="Second">Second help</Tooltip>
    </>
  );
  const [first, second] = container.querySelectorAll('button');
  await act(() =>
    first.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }))
  );
  expect(document.querySelector('[role="tooltip"]').textContent).toBe(
    'First help'
  );
  await act(() =>
    first.dispatchEvent(
      new MouseEvent('mouseout', {
        bubbles: true,
        relatedTarget: document.body,
      })
    )
  );
  expect(vi.getTimerCount()).toBe(1);
  await act(() =>
    second.dispatchEvent(
      new MouseEvent('mouseover', {
        bubbles: true,
        relatedTarget: document.body,
      })
    )
  );
  expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(1);
  expect(document.querySelector('[role="tooltip"]').textContent).toBe(
    'Second help'
  );
  expect(vi.getTimerCount()).toBe(0);
  await act(() => vi.advanceTimersByTime(500));
  expect(document.querySelector('[role="tooltip"]').textContent).toBe(
    'Second help'
  );
  await act(() => first.focus());
  expect(document.querySelectorAll('[role="tooltip"]')).toHaveLength(1);
  expect(document.querySelector('[role="tooltip"]').textContent).toBe(
    'First help'
  );
});
