import { Link } from 'react-router-dom';
import { Card, CardBody, LoadingBlock } from '@/components/ui';
import { formatAmount, formatDuration } from '@/lib/formatAmount';
import { ROUTES } from '@/constants/routes';
import { useServices } from '@/pages/services/hooks/useServices';
import { useTenant } from '@/pages/tenant/hooks/useTenant';

/**
 * Minimal public landing page.
 *
 * Phase 5 replaces this with the JSON section builder (blueprint 5.6): hero,
 * services, staff, gallery, testimonials, location, booking. Until then this
 * renders a fixed hero + services list so the demo instance is presentable.
 */
export function HomePage() {
  const { tenant, isPending } = useTenant();
  const { data: services } = useServices();

  if (isPending) return <LoadingBlock label="Loading" className="min-h-[60vh]" />;

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="mx-auto w-full max-w-5xl px-4 py-14 text-center sm:py-20">
          <h1 className="font-heading text-3xl font-semibold text-content sm:text-5xl">
            {tenant?.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-content-muted">
            Book your appointment online in under a minute. No account needed.
          </p>
          <Link
            to={ROUTES.BOOK}
            className="mt-7 inline-block rounded-token bg-primary px-8 py-3 font-medium text-primary-contrast hover:bg-primary-hover"
          >
            Book now
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 py-12">
        <h2 className="mb-5 font-heading text-xl font-semibold text-content">
          Our services
        </h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <li key={service.id}>
              <Card className="h-full">
                <CardBody>
                  <h3 className="font-medium text-content">{service.name}</h3>
                  {service.description && (
                    <p className="mt-1 text-sm text-content-muted">
                      {service.description}
                    </p>
                  )}
                  <p className="mt-3 text-sm font-semibold text-content">
                    {formatAmount(service.price)}
                    <span className="ml-2 font-normal text-content-muted">
                      {formatDuration(service.durationMinutes)}
                    </span>
                  </p>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      {tenant && (
        <section className="border-t border-border bg-surface">
          <div className="mx-auto w-full max-w-5xl px-4 py-10 text-sm text-content-muted">
            <h2 className="mb-2 font-heading text-base font-semibold text-content">
              Visit us
            </h2>
            <p>{tenant.address}</p>
            <p>
              {tenant.phone} · {tenant.email}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
