import { expect, it } from 'vitest';
import {
  formatCrackingTime,
  MILLISECONDS_PER_YEAR,
  UNIVERSE_AGE_LABEL,
} from '../src/timeFormat';

it('formats cracking durations compactly without false precision', () => {
  expect(formatCrackingTime(500)).toBe('< 1 sec');
  expect(formatCrackingTime(12 * 60 * 1000)).toBe('12 min');
  expect(formatCrackingTime(4.2 * 60 * 60 * 1000)).toBe('4.2 hrs');
  expect(formatCrackingTime(36 * 24 * 60 * 60 * 1000)).toBe('36 days');
  expect(formatCrackingTime(MILLISECONDS_PER_YEAR)).toBe('1 yr');
  expect(formatCrackingTime(10_306 * MILLISECONDS_PER_YEAR)).toBe('10.3k yrs');
  expect(formatCrackingTime(123_622 * MILLISECONDS_PER_YEAR)).toBe('124k yrs');
  expect(formatCrackingTime(5_678_901 * MILLISECONDS_PER_YEAR)).toBe(
    '5.68M yrs'
  );
  expect(formatCrackingTime(1_028_161_099 * MILLISECONDS_PER_YEAR)).toBe(
    '1.03B yrs'
  );
  expect(formatCrackingTime(11_499_685_051 * MILLISECONDS_PER_YEAR)).toBe(
    '11.5B yrs'
  );
  expect(formatCrackingTime(999_500 * MILLISECONDS_PER_YEAR)).toBe('1M yrs');
  expect(formatCrackingTime(13.9e9 * MILLISECONDS_PER_YEAR)).toBe(
    UNIVERSE_AGE_LABEL
  );
});
