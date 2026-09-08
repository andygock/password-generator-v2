export const MILLISECONDS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;
export const UNIVERSE_AGE_LABEL = '>13.8B yrs';

const MILLISECONDS_IN_UNIVERSE_AGE = 13.8e9 * MILLISECONDS_PER_YEAR;
const YEAR_SCALES = [
  { threshold: 1e9, divisor: 1e9, suffix: 'B' },
  { threshold: 1e6, divisor: 1e6, suffix: 'M' },
  { threshold: 1e3, divisor: 1e3, suffix: 'k' },
  { threshold: 1, divisor: 1, suffix: '' },
];
const SHORT_TIME_SCALES = [
  { milliseconds: 24 * 60 * 60 * 1000, suffix: 'days' },
  { milliseconds: 60 * 60 * 1000, suffix: 'hrs' },
  { milliseconds: 60 * 1000, suffix: 'min' },
  { milliseconds: 1000, suffix: 'sec' },
];

// These are broad estimates, so three significant figures avoid false precision.
const formatEstimate = (value) => Number(value.toPrecision(3)).toString();

export function formatCrackingTime(milliseconds) {
  if (milliseconds > MILLISECONDS_IN_UNIVERSE_AGE) {
    return UNIVERSE_AGE_LABEL;
  }
  if (milliseconds < 1000) return '< 1 sec';

  const years = milliseconds / MILLISECONDS_PER_YEAR;
  const scaleIndex = YEAR_SCALES.findIndex(
    ({ threshold }) => years >= threshold
  );
  let scale = YEAR_SCALES[scaleIndex];
  if (scale) {
    let value = formatEstimate(years / scale.divisor);
    // Promote a rounded boundary value: 999.5k years reads better as 1M year.
    if (Number(value) >= 1000 && scaleIndex > 0) {
      scale = YEAR_SCALES[scaleIndex - 1];
      value = formatEstimate(years / scale.divisor);
    }
    const unit = value === '1' && !scale.suffix ? 'yr' : 'yrs';
    return `${value}${scale.suffix} ${unit}`;
  }

  const shortScale = SHORT_TIME_SCALES.find(
    ({ milliseconds: unit }) => milliseconds >= unit
  );
  return `${formatEstimate(milliseconds / shortScale.milliseconds)} ${
    shortScale.suffix
  }`;
}
