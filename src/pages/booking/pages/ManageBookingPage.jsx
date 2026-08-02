import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

/**
 * Public self-service screen a customer reaches from their confirmation link.
 * Reads the booking token from the URL; no login required.
 */
export function ManageBookingPage() {
  const { token } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage your booking"
        description="View, reschedule or cancel your appointment."
      />

      <PhasePlaceholder
        phase="Phase 2 · Public booking"
        title="Manage-booking screen still to build"
        notes={`Booking reference: ${token ?? 'unknown'}`}
        items={[
          'Look up the booking by token (GET /bookings/token/:token)',
          'Reschedule to another available slot',
          'Cancel within the tenant cancellation window',
        ]}
      />
    </div>
  );
}
