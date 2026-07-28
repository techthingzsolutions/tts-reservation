import { cn } from '@/lib/cn';

export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn('rounded-token border border-border bg-surface shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, description, action, className }) {
  return (
    <div
      className={cn(
        'flex items-start justify-between gap-4 border-b border-border px-5 py-4',
        className
      )}
    >
      <div>
        <h2 className="text-base font-semibold text-content">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-content-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-3 border-t border-border px-5 py-4',
        className
      )}
    >
      {children}
    </div>
  );
}
