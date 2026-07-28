# Blueprint mapping

Where each part of the Booking and Reservation System Blueprint v1.0 lives in
this repo, and what is still to build. Frontend only — backend items are listed
where they explain a frontend constraint.

## Status legend

- **Built** — working against the mock API
- **Scaffolded** — structure and placeholder exist, logic to come
- **Not started** — no code yet

---

## Phase 1 — Core booking engine

| Blueprint item | Status | Where |
| --- | --- | --- |
| Authentication and roles | Built | `app/providers/AuthProvider.jsx`, `constants/roles.js`, `app/ProtectedRoute.jsx` |
| Booking lifecycle state machine | Built | `constants/bookingStatus.js` + tests |
| Service and staff CRUD | Scaffolded (read-only) | `features/services/`, `features/staff/` |
| Availability rules engine | Backend | Mock reference: `mocks/availability.js` |
| Slot generation algorithm | Backend | Mock reference: `mocks/availability.js` |
| Booking creation with concurrency lock | Backend (Layers 1–2) | Frontend Layer 3: `features/booking/hooks/useCreateBooking.js` |
| Email confirmations | Backend | — |

The availability algorithm is implemented in `mocks/availability.js` following
blueprint 5.2 step by step. It is a **reference for the Laravel implementation**,
not production code — the real one runs server side with caching.

## Phase 2 — Customer facing booking flow

| Blueprint item | Status | Where |
| --- | --- | --- |
| Public booking page | Built | `features/booking/pages/BookingPage.jsx` |
| Service picker, staff picker, calendar, time slots | Built | `features/booking/components/` |
| Guest booking, no account | Built | `features/booking/components/CustomerForm.jsx` |
| Booking lookup via secure token | Built | `features/booking/pages/ManageBookingPage.jsx` |
| Cancel via token link | Built | Same |
| **Reschedule via token link** | **Not started** | Reuse the slot picker with this booking excluded from availability |
| Mobile responsive layout | Built | Throughout — date strip scrolls, slots grid reflows |
| Timezone correct display | Built | `lib/datetime.js` |
| Confirmation and reminder notifications | Backend | — |

**Exit criteria:** a stranger can book without instructions and without an
account. Met, except reschedule.

## Phase 3 — Admin dashboard

| Blueprint item | Status | Where |
| --- | --- | --- |
| Admin shell, nav, role-filtered menu | Built | `layouts/AdminLayout.jsx` |
| Dashboard with today's schedule | Built | `features/dashboard/` |
| Booking list with status management | Built | `features/bookings/pages/BookingsPage.jsx` |
| **Calendar: day / week / month** | **Not started** | `features/bookings/pages/CalendarPage.jsx` — use FullCalendar |
| **Drag to reschedule** | **Not started** | Must re-check availability on drop and handle 409 |
| **Manual booking entry** | **Not started** | Walk-in and phone bookings |
| Customer records | Scaffolded (read-only) | `features/customers/` |
| **Staff schedules and leave** | **Not started** | `features/staff/` |
| **Reports** | **Not started** | `features/reports/` — group by tenant local date |
| **Settings: hours, buffers, policy** | **Not started** | `features/settings/` |
| **Export to CSV / Excel** | **Not started** | — |

## Phase 4 — Payments and notifications

Not started. No frontend code yet. When it lands:

- Payment step goes after slot selection, before confirmation
- Deposit / full / pay-on-site is per service, so the flow branches on
  `service.paymentMode`
- Webhook idempotency is a backend concern, but the confirmation page must
  tolerate a booking whose payment is still `pending`

## Phase 5 — Customisation and white label

| Blueprint item | Status | Where |
| --- | --- | --- |
| Theme token system | Built | `styles/tokens.css`, `app/providers/ThemeProvider.jsx`, `tailwind.config.js` |
| Curated palettes, no free picker | Built | `constants/themePalettes.js` |
| Live theme preview | Built | `features/settings/pages/SettingsPage.jsx` |
| Tenant resolution from subdomain | Scaffolded | `lib/apiClient.js` → `getTenantSlug()` |
| **Persist theme to tenant_themes** | **Not started** | Settings changes are client-side only today |
| **Template selection** | **Not started** | — |
| **Page section builder** | **Not started** | Schema in blueprint 5.6. `HomePage` is the fixed stand-in |
| **Draft and publish states** | **Not started** | — |
| **Custom domain** | **Not started** | — |

`HomePage` is deliberately simple. It gets replaced by the section builder, so
don't invest in it.

## Phase 6 — Hardening

| Blueprint item | Status | Where |
| --- | --- | --- |
| Error tracking | Scaffolded | `app/ErrorBoundary.jsx` — wire Sentry via `VITE_SENTRY_DSN` |
| CI: lint, test, build | Built | `.github/workflows/ci.yml` |
| **Load test booking endpoint** | Backend | — |
| **OWASP pass** | **Not started** | — |
| **RA 10173 compliance** | **Not started** | Data privacy — affects what we store and show |

## Non-functional targets (blueprint 3.4)

| Target | Current state |
| --- | --- |
| Booking page under 2s | Not measured. Router is eagerly imported — split the admin tree with `React.lazy` when it grows |
| Availability query under 300ms | Backend concern |
| Double booking: zero tolerance | Frontend Layer 3 built and tested. Backend Layers 1–2 outstanding |
| Input validation server side always | Zod on the client is UX only — never the enforcement point |

## Deliberately out of scope for the base app

Multi-tenant data isolation, subscription billing, the embeddable widget, the
public API, and the React Native app. All are later phases and none change the
structure here.
