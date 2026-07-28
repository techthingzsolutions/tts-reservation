import { cn } from '@/lib/cn';

export function EmptyState({ title, description, action, icon, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-token border border-dashed border-border bg-surface px-6 py-12 text-center',
        className
      )}
    >
      {icon && <div className="text-content-muted">{icon}</div>}
      <h3 className="text-base font-semibold text-content">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-content-muted">{description}</p>
      )}
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

/** Query failure state. `onRetry` should call the query's refetch. */
export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-token border border-danger/30 bg-danger/5 px-6 py-10 text-center">
      <h3 className="text-base font-semibold text-danger">{title}</h3>
      {message && <p className="max-w-sm text-sm text-content-muted">{message}</p>}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 text-sm font-medium text-primary underline underline-offset-4"
        >
          Try again
        </button>
      )}
    </div>
  );
}
