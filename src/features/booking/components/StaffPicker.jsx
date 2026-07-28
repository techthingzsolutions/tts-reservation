import { cn } from '@/lib/cn';
import { ErrorState, LoadingBlock } from '@/components/ui';
import { useStaffForService } from '@/features/staff/hooks/useStaff';

export const ANY_STAFF = 'any';

/**
 * "Any available" is listed first and is the default. It materially increases
 * the number of bookable slots, so it should never be buried.
 */
export function StaffPicker({ serviceId, selectedId, onSelect }) {
  const {
    data: staff,
    isPending,
    isError,
    error,
    refetch,
  } = useStaffForService(serviceId);

  if (isPending) return <LoadingBlock label="Loading team" />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;

  const options = [
    { id: ANY_STAFF, name: 'Any available', title: 'Earliest opening, fastest to book' },
    ...staff,
  ];

  return (
    <ul className="grid gap-2 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = option.id === selectedId;
        return (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect(option.id === ANY_STAFF ? ANY_STAFF : option)}
              aria-pressed={isSelected}
              className={cn(
                'flex w-full items-center gap-3 rounded-token border p-4 text-left transition-colors',
                isSelected
                  ? 'border-primary bg-primary-soft'
                  : 'border-border bg-surface hover:border-primary/40'
              )}
            >
              <span
                aria-hidden="true"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary"
              >
                {option.id === ANY_STAFF ? '★' : initials(option.name)}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-medium text-content">
                  {option.name}
                </span>
                {option.title && (
                  <span className="block truncate text-sm text-content-muted">
                    {option.title}
                  </span>
                )}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}
