export function PageHeader({ title, description, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-content">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-content-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
