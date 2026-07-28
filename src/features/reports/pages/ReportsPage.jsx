import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="How the business is doing." />
      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Reporting"
        notes="Group by tenant local date, never UTC date (blueprint 5.4)."
        items={[
          'Bookings per period',
          'Revenue per period',
          'Staff utilisation',
          'No-show rate',
          'Export to CSV / Excel',
        ]}
      />
    </div>
  );
}
