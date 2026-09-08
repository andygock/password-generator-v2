import { expect, it } from 'vitest';
import { formatCrackingTime, MILLISECONDS_PER_YEAR } from '../src/timeFormat';

it('formats cracking durations compactly with four significant figures', () => {
  expect(formatCrackingTime(500)).toBe('< 1 sec');
  expect(formatCrackingTime(60 * 60 * 1000)).toBe('1h');
  expect(formatCrackingTime(MILLISECONDS_PER_YEAR)).toBe('1.000 yrs');
  expect(formatCrackingTime(10_306 * MILLISECONDS_PER_YEAR)).toBe('10.31k yrs');
  expect(formatCrackingTime(123_622 * MILLISECONDS_PER_YEAR)).toBe(
    '123.6k yrs'
  );
  expect(formatCrackingTime(5_678_901 * MILLISECONDS_PER_YEAR)).toBe(
    '5.679M yrs'
  );
  expect(formatCrackingTime(1_028_161_099 * MILLISECONDS_PER_YEAR)).toBe(
    '1.028B yrs'
  );
  expect(formatCrackingTime(11_499_685_051 * MILLISECONDS_PER_YEAR)).toBe(
    '11.50B yrs'
  );
  expect(formatCrackingTime(13.9e9 * MILLISECONDS_PER_YEAR)).toBe(
    '> age of universe'
  );
});
