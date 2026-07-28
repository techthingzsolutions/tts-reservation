const DEFAULT_CURRENCY = 'PHP';
const DEFAULT_LOCALE = 'en-PH';

/**
 * Single entry point for rendering money. Never format prices inline.
 *
 * Amounts cross the API as decimal strings or numbers in major units
 * (e.g. "1500.00" = PHP 1,500.00).
 */
export function formatAmount(amount, options = {}) {
  const {
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
    fallback = '—',
    withSymbol = true,
  } = options;

  const value = typeof amount === 'string' ? Number(amount) : amount;

  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }

  return new Intl.NumberFormat(locale, {
    style: withSymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** "PHP 1,500.00 · 45 min" style summary used on service cards. */
export function formatPriceAndDuration(amount, durationMinutes, options = {}) {
  return `${formatAmount(amount, options)} · ${formatDuration(durationMinutes)}`;
}

export function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours && mins) return `${hours} hr ${mins} min`;
  if (hours) return `${hours} hr`;
  return `${mins} min`;
}
