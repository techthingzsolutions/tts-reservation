# Architecture

## Shape

A single-page React app talking to a Laravel API over JSON. Nothing else — no
BFF, no server rendering, no direct database access.

The API stays separate (rather than Inertia or Livewire) because the blueprint
plans a React Native app and an embeddable booking widget. Both reuse this same
API, and that only works if it is genuinely standalone.

```
Browser
  └── React SPA (this repo)
        └── HTTPS + Bearer token
              └── Laravel API ── MySQL
                              └── Redis (cache, queues)
```

## Layers

**`lib/`** — infrastructure with no domain knowledge. `apiClient` owns
transport, auth headers, tenant resolution and error normalisation. `datetime`
owns every timezone decision. `formatAmount` owns money. Nothing here imports
from `features/`.

**`constants/`** — shared domain vocabulary. The booking state machine, roles,
routes, query keys, theme palettes. Importable from anywhere; imports nothing
but itself.

**`features/<domain>/`** — one folder per domain, each with the same internal
shape (`api/`, `hooks/`, `components/`, `pages/`, `schemas/`). Features may
import from `lib/`, `constants/` and `components/`. Cross-feature imports are
allowed but should be rare and go through a hook, not a component's internals.

**`app/`** — composition root. Providers, router, route guard, error boundary.

**`mocks/`** — the API contract, executable. Not shipped to production.

## Data flow

```
component ──> hook (TanStack Query) ──> feature api/ ──> lib/apiClient ──> API
                     │
                     └── cache, keyed by constants/queryKeys
```

Components never call `api/` modules directly. That indirection is what makes
loading, error and refetch behaviour consistent, and it is what lets the
conflict path be handled in one place.

## Errors

Every failed request rejects with an `ApiError` (`lib/errors.js`) carrying a
normalised `status`, `message` and field-level `errors`. Callers ask questions —
`error.isSlotConflict`, `error.isValidation` — rather than inspecting HTTP
internals.

Three failures are special:

- **409** — the slot was taken between the availability query and the booking
  request. Expected. Refetch availability, clear the selection, explain.
- **401** — `apiClient` clears the token and notifies `AuthProvider`, which
  drops the session and clears the query cache.
- **422** — Laravel validation. Map `error.errors` back onto form fields; see
  `LoginPage`.

## State

- **Server state** — TanStack Query. Anything that came from the API.
- **Form state** — React Hook Form + Zod.
- **UI state** — `useState` in the owning page. The booking wizard's step,
  selected service, staff and slot all live in `BookingPage`.
- **Global state** — three contexts only: auth, theme, toast. There is no Redux
  and there should not be one; almost everything here is server state wearing a
  disguise.

## Theming

Tailwind colour utilities compile once and never change. What changes is the
value of the CSS custom properties they reference:

```
tailwind.config.js:  primary: 'rgb(var(--color-primary) / <alpha-value>)'
tokens.css:          --color-primary: 37 99 235;
ThemeProvider:       root.style.setProperty('--color-primary', '21 128 61')
```

Colours are stored as space-separated RGB channels rather than hex so Tailwind's
alpha modifier (`bg-primary/10`) still works.

Clients choose a palette, a font pairing and a corner style — all curated. There
is no free colour picker, on purpose.

## Multi-tenancy

The app is single-tenant per instance today, but `tenant_id` is present from day
one so the migration to multi-tenant is a deployment change rather than a
rewrite. `apiClient.getTenantSlug()` reads the subdomain and falls back to
`VITE_DEFAULT_TENANT_SLUG` locally, sending it as an `X-Tenant` header on every
request.

## The mock API

`VITE_USE_MOCK_API=true` starts MSW before React mounts. It serves seeded salon
data, and `mocks/availability.js` implements the blueprint's availability
algorithm faithfully — buffers, staff schedules, time off, holidays, lead time —
so the UI is exercised against realistic gaps rather than a uniform grid.

The same handlers back the Vitest suite. A test passing here means the contract
the UI depends on is the one being mocked.

`window.__ttsMock` exposes the in-memory database in the browser console.

## Known trade-offs

- **Eager route imports.** Fine at this size; split the admin tree with
  `React.lazy` before the bundle affects the public booking page's 2s budget.
- **Theme settings are not persisted.** Phase 5 work.
- **`HomePage` is a fixed layout.** The section builder replaces it — don't
  invest there.
- **Mock state resets on reload.** Deliberate: nothing should depend on mock
  persistence.
