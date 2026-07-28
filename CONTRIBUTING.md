# Contributing

Conventions for this codebase. Following them keeps the app consistent as the
team grows and keeps us honest about the one rule that matters: never fork the
codebase per client. Client differences are config flags, never branches.

## Where code goes

Everything lives under a feature folder:

```
src/features/<domain>/
  api/         One module per resource. Thin wrappers over `api` from lib/apiClient.
  hooks/       TanStack Query hooks. Components never call api/ directly.
  components/  Presentational. Take props, emit callbacks.
  pages/       Route-level. Own the state, wire hooks to components.
  schemas/     Zod schemas for forms.
  lib/         Pure helpers specific to this feature.
```

Shared UI primitives go in `src/components/ui/`. Something used by two features
but not generic enough for `ui/` goes in `src/components/`.

`src/features/booking/pages/BookingPage.jsx` is the reference implementation.
Copy its shape: the page owns state, components stay dumb, data comes from hooks.

## Rules that are not negotiable

**Handle 409 on any endpoint that reserves time.** A slot conflict is a normal
outcome, not an exception. Refetch availability, clear the selection, tell the
user what happened. See `useCreateBooking`.

**Never format a date without naming a timezone.** Use `src/lib/datetime.js`.
Storage and transport are UTC; display is tenant timezone for admin, browser
timezone for customers.

**Never format money inline.** Use `formatAmount` from `src/lib/formatAmount.js`.

**Never hardcode a route string.** Use `ROUTES` from `src/constants/routes.js`.

**Never hardcode a colour.** Use the Tailwind token classes (`bg-primary`,
`text-content-muted`, `border-border`). They resolve to CSS variables so
per-tenant theming keeps working.

**Never invent a booking status string.** Use `BOOKING_STATUS` and check
`canTransition` before offering an action.

**Validate on the client, but never trust it.** Zod schemas are for UX. The API
validates everything again — that is where correctness lives.

## Query keys and cache invalidation

All keys live in `src/constants/queryKeys.js`. After anything that changes when
a slot is free — a booking, a status change, a schedule edit, a settings change —
invalidate `queryKeys.availability.all`. Stale availability is how customers get
shown slots that no longer exist.

## Adding an endpoint

1. Add the handler to `src/mocks/handlers.js` with a realistic response.
2. Add the method to the feature's `api/` module, unwrapping the `{ data }`
   envelope so callers receive the resource itself.
3. Add a hook in `hooks/` with the right query key.
4. Use it from a page.

Doing the mock first means the whole team can build against the endpoint before
the Laravel side exists, and the mock doubles as the API contract.

## Tests

```bash
npm test
```

Vitest + Testing Library, with MSW serving the same handlers the browser uses.
Priority order from the blueprint:

1. Availability rules — exhaustive
2. Booking conflict handling — mandatory
3. Booking lifecycle transitions — all valid and invalid
4. Timezone edge cases — DST boundaries, midnight crossings
5. Everything else

Write a test for any bug you fix.

## Before opening a PR

```bash
npm run lint && npm test && npm run build
```

CI runs the same three. Keep them green.

## Commits

Short imperative subject: `add staff schedule editor`, `fix slot buffer overlap`.
