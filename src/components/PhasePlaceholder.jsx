import { Card, CardBody } from '@/components/ui';

/**
 * Marks a screen that is scoped but not yet built. Every placeholder names the
 * blueprint phase it belongs to so the backlog is visible from the running app.
 */
export function PhasePlaceholder({ phase, title, items = [], notes }) {
  return (
    <Card>
      <CardBody>
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {phase}
        </p>
        <h2 className="mt-1 text-lg font-semibold text-content">{title}</h2>
        {notes && <p className="mt-1 text-sm text-content-muted">{notes}</p>}
        {items.length > 0 && (
          <ul className="mt-4 space-y-1.5 text-sm text-content-muted">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <span aria-hidden="true" className="text-content-muted/60">
                  ▢
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </CardBody>
    </Card>
  );
}
