import { forwardRef, useId } from 'react';
import { cn } from '@/lib/cn';

const BASE =
  'w-full rounded-token border bg-surface px-3 text-sm text-content placeholder:text-content-muted/70 disabled:cursor-not-allowed disabled:bg-surface-muted';

export const Input = forwardRef(function Input(
  { className, invalid = false, ...props },
  ref
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        BASE,
        'h-11',
        invalid ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  );
});

export const Textarea = forwardRef(function Textarea(
  { className, invalid = false, rows = 3, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        BASE,
        'py-2.5',
        invalid ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    />
  );
});

export const Select = forwardRef(function Select(
  { className, invalid = false, children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        BASE,
        'h-11',
        invalid ? 'border-danger' : 'border-border',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

/**
 * Label + control + error message. Wire it to React Hook Form by passing the
 * field error: <FormField label="Email" error={errors.email?.message}>.
 */
export function FormField({ label, error, hint, required, children, className }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  // Only the render-prop form receives `id`, so only then can the label bind.
  const isRenderProp = typeof children === 'function';

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label htmlFor={isRenderProp ? id : undefined} className="field-label">
          {label}
          {required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      {isRenderProp
        ? children({ id, 'aria-describedby': describedBy, invalid: Boolean(error) })
        : children}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-content-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
