import { cn } from '@/lib/cn';
import { formatAmount, formatDuration } from '@/lib/formatAmount';
import { EmptyState, ErrorState, LoadingBlock } from '@/components/ui';
import { useServices } from '@/features/services/hooks/useServices';

export function ServicePicker({ selectedId, onSelect }) {
  const { data: services, isPending, isError, error, refetch } = useServices();

  if (isPending) return <LoadingBlock label="Loading services" />;
  if (isError) {
    return <ErrorState message={error.message} onRetry={refetch} />;
  }
  if (!services.length) {
    return (
      <EmptyState
        title="No services available"
        description="This business has not published any bookable services yet."
      />
    );
  }

  const categories = [...new Set(services.map((s) => s.category))];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <section key={category}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-content-muted">
            {category}
          </h3>
          <ul className="space-y-2">
            {services
              .filter((service) => service.category === category)
              .map((service) => {
                const isSelected = service.id === selectedId;
                return (
                  <li key={service.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(service)}
                      aria-pressed={isSelected}
                      className={cn(
                        'flex w-full items-start justify-between gap-4 rounded-token border p-4 text-left transition-colors',
                        isSelected
                          ? 'border-primary bg-primary-soft'
                          : 'border-border bg-surface hover:border-primary/40'
                      )}
                    >
                      <span className="min-w-0">
                        <span className="block font-medium text-content">
                          {service.name}
                        </span>
                        {service.description && (
                          <span className="mt-0.5 block text-sm text-content-muted">
                            {service.description}
                          </span>
                        )}
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block font-semibold text-content">
                          {formatAmount(service.price)}
                        </span>
                        <span className="block text-sm text-content-muted">
                          {formatDuration(service.durationMinutes)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </div>
  );
}
