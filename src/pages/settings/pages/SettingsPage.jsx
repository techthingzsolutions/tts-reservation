import { Card, CardBody, CardHeader, PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { cn } from '@/lib/cn';
import { FONT_PAIRINGS, RADIUS_OPTIONS, THEME_PALETTES } from '@/constants/themePalettes';
import { useTheme } from '@/app/providers/ThemeProvider';

/**
 * Live demonstration of the runtime theming system (blueprint 5.5).
 *
 * Changes apply instantly with no rebuild because only CSS custom property
 * values change. Note there is no free colour picker - that guardrail is
 * deliberate, and Phase 5 must keep it.
 *
 * Currently client-side only. Phase 5 persists these to tenant_themes with
 * draft / publish states.
 */
export function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Branding applies immediately — no rebuild, no redeploy."
      />

      <Card>
        <CardHeader
          title="Colour palette"
          description="Choose one. Clients never get a free colour picker."
        />
        <CardBody>
          <ul className="grid gap-3 sm:grid-cols-3">
            {Object.entries(THEME_PALETTES).map(([id, palette]) => (
              <li key={id}>
                <button
                  type="button"
                  onClick={() => setTheme((t) => ({ ...t, paletteId: id }))}
                  aria-pressed={theme.paletteId === id}
                  className={cn(
                    'w-full rounded-token border p-3 text-left transition-colors',
                    theme.paletteId === id
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border hover:border-primary/40'
                  )}
                >
                  <span className="flex gap-1.5">
                    {['--color-primary', '--color-secondary'].map((token) => (
                      <span
                        key={token}
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: `rgb(${palette.tokens[token]})` }}
                      />
                    ))}
                  </span>
                  <span className="mt-2 block text-sm font-medium text-content">
                    {palette.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader title="Typography" />
          <CardBody>
            <ul className="space-y-2">
              {Object.entries(FONT_PAIRINGS).map(([id, pairing]) => (
                <li key={id}>
                  <OptionButton
                    selected={theme.fontPairing === id}
                    onClick={() => setTheme((t) => ({ ...t, fontPairing: id }))}
                  >
                    {pairing.label}
                  </OptionButton>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Corner style" />
          <CardBody>
            <ul className="space-y-2">
              {Object.entries(RADIUS_OPTIONS).map(([id, option]) => (
                <li key={id}>
                  <OptionButton
                    selected={theme.radius === id}
                    onClick={() => setTheme((t) => ({ ...t, radius: id }))}
                  >
                    {option.label}
                  </OptionButton>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <PhasePlaceholder
        phase="Phase 1 & 5"
        title="Settings still to build"
        items={[
          'Business hours, holidays and blackout dates (Phase 1)',
          'Buffers, minimum lead time, maximum advance booking (Phase 1)',
          'Cancellation policy window (Phase 1)',
          'Logo and hero image upload (Phase 5)',
          'Template selection and section builder (Phase 5)',
          'Draft / publish workflow, then subdomain and custom domain (Phase 5)',
        ]}
      />
    </div>
  );
}

function OptionButton({ selected, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'w-full rounded-token border px-3 py-2.5 text-left text-sm transition-colors',
        selected
          ? 'border-primary bg-primary-soft font-medium text-primary'
          : 'border-border text-content hover:border-primary/40'
      )}
    >
      {children}
    </button>
  );
}
