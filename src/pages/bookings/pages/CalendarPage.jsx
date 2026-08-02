import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Day, week and month views of your team's schedule."
      />

      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Calendar still to build"
        notes="Exit criteria: the owner can run a full day from this screen without touching the database."
        items={[
          'Day / week / month views',
          'Drag-to-reschedule appointments',
          'Per-staff columns and colour coding',
          'Click an empty slot to create a booking',
        ]}
      />
    </div>
  );
}
