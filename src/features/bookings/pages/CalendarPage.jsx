import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

export function CalendarPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        description="Day, week and month views of the schedule."
      />
      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Calendar view"
        notes="Use FullCalendar here (blueprint 4.1). Drag-to-reschedule is called out as a strong selling feature — build it early, and make every drag re-check availability before committing."
        items={[
          'Day / week / month views',
          'Drag to reschedule, with 409 handling on drop',
          'Filter by staff member',
          'Click an empty slot to create a manual booking',
        ]}
      />
    </div>
  );
}
