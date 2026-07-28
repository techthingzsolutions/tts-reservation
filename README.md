# tts-reservation

Booking and reservation system — React frontend.

Tech Thingz Solutions' first product. One codebase, config driven, serving many
client businesses. Built to the Booking and Reservation System Blueprint v1.0.

**Booking shape:** staff + service (salons, clinics, barbershops, spas). This is
the shape the blueprint recommends for first release; it generalises to
equipment and fixed-capacity later.

---

## Quick start

```bash
npm install
```

```bash
npm run dev
```

Open http://localhost:5173. That's the whole setup — no backend needed. A mock
API with seeded salon data runs in the browser, so every screen works on a fresh
clone.

**Demo admin login:** `owner@demo.test` / `password`

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with the mock API |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Tests in watch mode |
| `npm run lint` | ESLint over the whole project |
| `npm run format` | Prettier write |

## Connecting the real API

The frontend talks to a Laravel 11/12 + Sanctum API and nothing else. To point
at it, create `.env.local` (gitignored):

```
VITE_USE_MOCK_API=false
VITE_API_URL=http://localhost:8000/api
```

`src/mocks/handlers.js` is the API contract until Scribe/Scramble docs exist.
Every endpoint the frontend calls is defined there with its exact request and
response shape. Build the Laravel routes to match it.

## Project structure

```
src/
  app/          App shell, router, route guard, providers
  features/     One folder per domain — api/ components/ hooks/ pages/ schemas/
  components/   Shared UI primitives (ui/) and cross-feature components
  layouts/      PublicLayout, AdminLayout, AuthLayout
  lib/          apiClient, queryClient, datetime, formatAmount, errors, cn
  constants/    Booking statuses, roles, routes, query keys, theme palettes
  mocks/        MSW handlers, seeded fixtures, in-memory db
  styles/       Theme tokens and Tailwind entry
```

Feature-first, so Phase 1–3 work drops into folders that already exist.

## Three things to read before writing code

**1. Double booking is the one thing that must never break**
(`src/lib/errors.js`, `src/features/booking/hooks/useCreateBooking.js`)

A `409` from `POST /bookings` is a normal outcome — two people clicked the same
slot. It is never a crash and never a generic error toast. The frontend must
refetch availability, clear the dead selection, and tell the customer plainly.
`BookingPage` shows the pattern. The database constraint and row lock are the
backend's job; this is Layer 3 of the blueprint's three layers.

**2. Timezones have exactly one set of rules** (`src/lib/datetime.js`)

Everything is UTC in transit and storage. Admin views render in the tenant
timezone, customer views in the customer's own. Business hours are local
wall-clock time and are never reasoned about as UTC. Don't call `toLocaleString`
directly — use the helpers, so the timezone choice is always explicit.

**3. Theming is runtime, not build time** (`src/styles/tokens.css`)

Tailwind colours resolve to CSS custom properties. Rebranding a client rewrites
variable values on `:root` — no rebuild, no per-client bundle. Clients pick from
curated palettes; there is deliberately no free colour picker, because
unrestricted pickers produce unreadable sites and the client blames us.

## Testing the conflict path by hand

With the mock API running, open the console and arm a one-shot conflict:

```js
window.__ttsMock.forceConflict = true
```

The next booking attempt returns 409 so you can see the recovery UI.

## What's built and what isn't

Every unbuilt screen renders a placeholder naming its blueprint phase, so the
backlog is visible from inside the running app. See
[docs/blueprint-mapping.md](docs/blueprint-mapping.md) for the full picture.

Built: theming, auth and role gating, routing, booking state machine, timezone
layer, mock API, and the complete public booking flow as the reference pattern.

Not built: admin calendar, payments, SMS, section builder, multi-tenant routing.

## Conventions

See [CONTRIBUTING.md](CONTRIBUTING.md).
