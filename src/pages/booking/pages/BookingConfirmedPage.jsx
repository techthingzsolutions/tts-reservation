import { useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';

/** Shown after a successful booking. Reads the booking token from the URL. */
export function BookingConfirmedPage() {
  const { token } = useParams();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Booking confirmed"
        description="We've saved your appointment and sent you the details."
      />

      <PhasePlaceholder
        phase="Phase 2 · Public booking"
        title="Confirmation screen still to build"
        notes={`Booking reference: ${token ?? 'unknown'}`}
        items={[
          'Show the confirmed service, time, staff and price',
          'Add-to-calendar link',
          'Link to manage or cancel the booking',
        ]}
      />
    </div>
  );
}
