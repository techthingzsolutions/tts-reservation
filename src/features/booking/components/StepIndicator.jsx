import { cn } from '@/lib/cn';

export function StepIndicator({ steps, currentIndex, onStepClick }) {
  return (
    <ol className="mb-6 flex items-center gap-2" aria-label="Booking steps">
      {steps.map((step, index) => {
        const isDone = index < currentIndex;
        const isCurrent = index === currentIndex;
        const canNavigate = isDone && typeof onStepClick === 'function';

        return (
          <li key={step.id} className="flex flex-1 items-center gap-2">
            <button
              type="button"
              disabled={!canNavigate}
              onClick={canNavigate ? () => onStepClick(index) : undefined}
              aria-current={isCurrent ? 'step' : undefined}
              className={cn(
                'flex min-w-0 flex-1 flex-col gap-1.5 text-left',
                canNavigate && 'cursor-pointer'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-full rounded-full transition-colors',
                  isDone || isCurrent ? 'bg-primary' : 'bg-border'
                )}
              />
              <span
                className={cn(
                  'truncate text-xs font-medium',
                  isCurrent ? 'text-primary' : 'text-content-muted'
                )}
              >
                {step.label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
