import prettyMilliseconds from 'pretty-ms';

export const MILLISECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

const MILLISECONDS_IN_UNIVERSE_AGE = 13.8e9 * MILLISECONDS_PER_YEAR;
const YEAR_SCALES = [
  { threshold: 1e9, divisor: 1e9, suffix: 'B' },
  { threshold: 1e6, divisor: 1e6, suffix: 'M' },
  { threshold: 1e3, divisor: 1e3, suffix: 'k' },
  { threshold: 1, divisor: 1, suffix: '' },
];

// Keep large estimates short and comparable while retaining useful precision.
const formatFourSignificantFigures = (value) => {
  const wholeDigits = Math.floor(Math.log10(value)) + 1;
  return value.toFixed(Math.max(0, 4 - wholeDigits));
};

export function formatCrackingTime(milliseconds) {
  if (milliseconds > MILLISECONDS_IN_UNIVERSE_AGE) {
    return '> age of universe';
  }
  if (milliseconds < 1000) return '< 1 sec';

  const years = milliseconds / MILLISECONDS_PER_YEAR;
  const scale = YEAR_SCALES.find(({ threshold }) => years >= threshold);
  if (scale) {
    return `${formatFourSignificantFigures(years / scale.divisor)}${
      scale.suffix
    } yrs`;
  }

  return prettyMilliseconds(milliseconds, { compact: true });
}
