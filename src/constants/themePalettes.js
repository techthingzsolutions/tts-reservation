/**
 * Curated palettes (blueprint 5.5 guardrail).
 *
 * Clients pick ONE palette. They do not get a free colour picker - unrestricted
 * pickers produce unreadable sites and the client blames the platform. Every
 * palette here is contrast-checked against its own surface and contrast colours.
 *
 * Values are space-separated RGB channels so Tailwind's `<alpha-value>` works.
 */
export const THEME_PALETTES = {
  'ocean-blue': {
    label: 'Ocean Blue',
    tokens: {
      '--color-primary': '37 99 235',
      '--color-primary-hover': '29 78 216',
      '--color-primary-soft': '219 234 254',
      '--color-primary-contrast': '255 255 255',
      '--color-secondary': '96 165 250',
    },
  },
  'forest-green': {
    label: 'Forest Green',
    tokens: {
      '--color-primary': '21 128 61',
      '--color-primary-hover': '22 101 52',
      '--color-primary-soft': '220 252 231',
      '--color-primary-contrast': '255 255 255',
      '--color-secondary': '74 222 128',
    },
  },
  'warm-terracotta': {
    label: 'Warm Terracotta',
    tokens: {
      '--color-primary': '194 65 12',
      '--color-primary-hover': '154 52 18',
      '--color-primary-soft': '255 237 213',
      '--color-primary-contrast': '255 255 255',
      '--color-secondary': '251 146 60',
    },
  },
  'plum-luxe': {
    label: 'Plum Luxe',
    tokens: {
      '--color-primary': '126 34 206',
      '--color-primary-hover': '107 33 168',
      '--color-primary-soft': '243 232 255',
      '--color-primary-contrast': '255 255 255',
      '--color-secondary': '192 132 252',
    },
  },
  'charcoal-gold': {
    label: 'Charcoal & Gold',
    tokens: {
      '--color-primary': '161 98 7',
      '--color-primary-hover': '133 77 14',
      '--color-primary-soft': '254 249 195',
      '--color-primary-contrast': '255 255 255',
      '--color-secondary': '250 204 21',
    },
  },
};

export const DEFAULT_PALETTE_ID = 'ocean-blue';

/** Font pairings offered to clients - also curated, not free text. */
export const FONT_PAIRINGS = {
  inter: {
    label: 'Inter (clean, modern)',
    tokens: {
      '--font-heading': "'Inter', ui-sans-serif, system-ui, sans-serif",
      '--font-body': "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  },
  'playfair-inter': {
    label: 'Playfair Display + Inter (elegant)',
    tokens: {
      '--font-heading': "'Playfair Display', Georgia, serif",
      '--font-body': "'Inter', ui-sans-serif, system-ui, sans-serif",
    },
  },
  poppins: {
    label: 'Poppins (friendly, rounded)',
    tokens: {
      '--font-heading': "'Poppins', ui-sans-serif, system-ui, sans-serif",
      '--font-body': "'Poppins', ui-sans-serif, system-ui, sans-serif",
    },
  },
};

export const DEFAULT_FONT_PAIRING = 'inter';

export const RADIUS_OPTIONS = {
  sharp: { label: 'Sharp', tokens: { '--radius-base': '0.25rem' } },
  soft: { label: 'Soft', tokens: { '--radius-base': '0.625rem' } },
  round: { label: 'Rounded', tokens: { '--radius-base': '1rem' } },
};

export const DEFAULT_RADIUS = 'soft';

/**
 * Turn a tenant theme record into the flat CSS variable map that
 * ThemeProvider injects. Unknown ids fall back to the defaults rather than
 * rendering an unstyled page.
 */
export function resolveThemeTokens(theme = {}) {
  const palette = THEME_PALETTES[theme.paletteId] ?? THEME_PALETTES[DEFAULT_PALETTE_ID];
  const fonts = FONT_PAIRINGS[theme.fontPairing] ?? FONT_PAIRINGS[DEFAULT_FONT_PAIRING];
  const radius = RADIUS_OPTIONS[theme.radius] ?? RADIUS_OPTIONS[DEFAULT_RADIUS];

  return {
    ...palette.tokens,
    ...fonts.tokens,
    ...radius.tokens,
  };
}
