import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

/**
 * The public booking wizard - the single most important customer-facing screen.
 * Scoped but not yet built; the route resolves so the rest of the app can run.
 */
export function BookingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Book an appointment"
        description="Choose a service, pick a time, and confirm - no account required."
      />

      <PhasePlaceholder
        phase="Phase 2 · Public booking"
        title="Booking flow still to build"
        notes="Exit criteria: a stranger on a phone can book in under two minutes (blueprint 3.4)."
        items={[
          'Select a service and (optionally) a staff member',
          'Pick an available slot from live availability',
          'Enter contact details and confirm',
          'Receive a confirmation with a manage-booking link',
        ]}
      />
    </div>
  );
}
