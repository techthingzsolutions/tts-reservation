import {
  Badge,
  Card,
  CardBody,
  ErrorState,
  LoadingBlock,
  PageHeader,
} from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { formatAmount, formatDuration } from '@/lib/formatAmount';
import { useServices } from '../hooks/useServices';

export function ServicesPage() {
  const { data, isPending, isError, error, refetch } = useServices({
    includeInactive: true,
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="What customers can book, how long it takes, and what it costs."
      />

      {isPending && <LoadingBlock label="Loading services" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {data && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((service) => (
            <li key={service.id}>
              <Card className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-content">{service.name}</h3>
                    <Badge tone={service.isActive ? 'success' : 'neutral'}>
                      {service.isActive ? 'Active' : 'Hidden'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-content-muted">{service.description}</p>
                  <dl className="mt-3 grid grid-cols-2 gap-y-1 text-sm">
                    <Field label="Price" value={formatAmount(service.price)} />
                    <Field
                      label="Duration"
                      value={formatDuration(service.durationMinutes)}
                    />
                    <Field label="Buffer before" value={`${service.bufferBefore} min`} />
                    <Field label="Buffer after" value={`${service.bufferAfter} min`} />
                  </dl>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <PhasePlaceholder
        phase="Phase 1 · Core booking engine"
        title="Service management is read-only for now"
        items={[
          'Create, edit and archive services',
          'Assign staff to each service (service_staff)',
          'Category management',
          'Per-service payment mode: deposit, full, or pay on site',
        ]}
      />
    </div>
  );
}

function Field({ label, value }) {
  return (
    <>
      <dt className="text-content-muted">{label}</dt>
      <dd className="text-right font-medium text-content">{value}</dd>
    </>
  );
}
