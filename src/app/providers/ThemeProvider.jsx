import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  DEFAULT_FONT_PAIRING,
  DEFAULT_PALETTE_ID,
  DEFAULT_RADIUS,
  resolveThemeTokens,
} from '@/constants/themePalettes';

/**
 * Runtime theming (blueprint 5.5).
 *
 * Tailwind utility classes are compiled once and never change. Rebranding a
 * tenant only rewrites CSS custom property VALUES on :root, so there is no
 * rebuild and no per-client bundle.
 *
 * In production the tenant theme arrives from the API (tenant_themes.tokens).
 * Pass it in via the `theme` prop once that endpoint exists; until then the
 * defaults render.
 */

const ThemeContext = createContext(null);

const DEFAULT_THEME = {
  paletteId: DEFAULT_PALETTE_ID,
  fontPairing: DEFAULT_FONT_PAIRING,
  radius: DEFAULT_RADIUS,
  logoUrl: null,
  businessName: 'Tech Thingz Booking',
};

export function ThemeProvider({ theme: initialTheme, children }) {
  const [theme, setTheme] = useState({ ...DEFAULT_THEME, ...initialTheme });

  // Keep in sync when the tenant theme finishes loading from the API.
  useEffect(() => {
    if (initialTheme) setTheme((current) => ({ ...current, ...initialTheme }));
  }, [initialTheme]);

  const tokens = useMemo(() => resolveThemeTokens(theme), [theme]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(tokens).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });
    return () => {
      Object.keys(tokens).forEach((name) => root.style.removeProperty(name));
    };
  }, [tokens]);

  const value = useMemo(
    () => ({
      theme,
      tokens,
      setTheme,
      previewPalette: (paletteId) => setTheme((t) => ({ ...t, paletteId })),
    }),
    [theme, tokens]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
