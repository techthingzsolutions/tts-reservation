import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardBody, LoadingBlock } from '@/components/ui';
import { useToast } from '@/app/providers/ToastProvider';
import { CONFLICT_MESSAGE } from '@/lib/errors';
import { todayKey } from '@/lib/datetime';
import { bookingConfirmedPath } from '@/constants/routes';
import { useTenant } from '@/features/tenant/hooks/useTenant';
import { StepIndicator } from '../components/StepIndicator';
import { ServicePicker } from '../components/ServicePicker';
import { StaffPicker, ANY_STAFF } from '../components/StaffPicker';
import { DateStrip } from '../components/DateStrip';
import { SlotPicker } from '../components/SlotPicker';
import { CustomerForm } from '../components/CustomerForm';
import { BookingSummary } from '../components/BookingSummary';
import { useAvailability } from '../hooks/useAvailability';
import { useCreateBooking } from '../hooks/useCreateBooking';

const STEPS = [
  { id: 'service', label: 'Service' },
  { id: 'staff', label: 'Team member' },
  { id: 'time', label: 'Date & time' },
  { id: 'details', label: 'Your details' },
];

/**
 * The reference implementation for this codebase.
 *
 * It is the one flow that must work end to end: a stranger books without
 * instructions and without an account (blueprint Phase 2 exit criteria).
 * Copy its structure - page owns state, components stay presentational,
 * data comes from hooks - when building the remaining features.
 */
export function BookingPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const { tenant, timeZone, bookingRules, isPending: tenantLoading } = useTenant();

  const [stepIndex, setStepIndex] = useState(0);
  const [service, setService] = useState(null);
  const [staff, setStaff] = useState(ANY_STAFF);
  const [date, setDate] = useState(null);
  const [slot, setSlot] = useState(null);

  const staffId = staff === ANY_STAFF ? null : staff.id;

  // Default the date once the tenant timezone is known.
  useEffect(() => {
    if (!date && tenant) setDate(todayKey(timeZone));
  }, [date, tenant, timeZone]);

  const availability = useAvailability({
    serviceId: service?.id,
    staffId,
    date,
    enabled: stepIndex >= 2,
  });

  const createBooking = useCreateBooking({
    onConflict: () => {
      // Layer 3 (blueprint 5.3): drop the dead selection, send the customer
      // back to a freshly refetched slot list, and say what happened.
      setSlot(null);
      setStepIndex(2);
      toast.warning(CONFLICT_MESSAGE, { duration: 8000 });
    },
  });

  if (tenantLoading) return <LoadingBlock label="Loading" className="min-h-[60vh]" />;

  const goTo = (index) => setStepIndex(index);

  const handleSelectService = (nextService) => {
    setService(nextService);
    setStaff(ANY_STAFF);
    setSlot(null);
    goTo(1);
  };

  const handleSelectStaff = (nextStaff) => {
    setStaff(nextStaff);
    setSlot(null);
    goTo(2);
  };

  const handleSelectSlot = (nextSlot) => {
    setSlot(nextSlot);
    goTo(3);
  };

  const handleSubmitDetails = (values) => {
    createBooking.mutate(
      {
        serviceId: service.id,
        // "Any available" lets the server pick, which maximises success odds.
        staffId: staffId ?? 'any',
        startsAt: slot.startsAt,
        customer: {
          name: values.name,
          email: values.email,
          phone: values.phone,
        },
        notes: values.notes ?? '',
      },
      {
        onSuccess: (booking) => {
          navigate(bookingConfirmedPath(booking.token));
        },
        onError: (error) => {
          if (!error.isSlotConflict) toast.error(error.message);
        },
      }
    );
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:py-10">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-content sm:text-3xl">
          Book an appointment
        </h1>
        <p className="mt-1 text-sm text-content-muted">
          {tenant?.name} · times shown in {timeZone.replace('_', ' ')}
        </p>
      </header>

      <StepIndicator steps={STEPS} currentIndex={stepIndex} onStepClick={goTo} />

      <div className="grid gap-6 lg:grid-cols-[1fr_18rem] lg:items-start">
        <Card>
          <CardBody>
            {stepIndex === 0 && (
              <ServicePicker selectedId={service?.id} onSelect={handleSelectService} />
            )}

            {stepIndex === 1 && (
              <StaffPicker
                serviceId={service.id}
                selectedId={staff === ANY_STAFF ? ANY_STAFF : staff.id}
                onSelect={handleSelectStaff}
              />
            )}

            {stepIndex === 2 && (
              <div className="space-y-5">
                <DateStrip
                  selectedDate={date}
                  onSelect={(nextDate) => {
                    setDate(nextDate);
                    setSlot(null);
                  }}
                  timeZone={timeZone}
                  maxAdvanceDays={bookingRules.maximumAdvanceDays}
                />
                <SlotPicker
                  slots={availability.data?.slots}
                  timeZone={timeZone}
                  selectedStartsAt={slot?.startsAt}
                  onSelect={handleSelectSlot}
                  isPending={availability.isPending}
                  isError={availability.isError}
                  error={availability.error}
                  onRetry={availability.refetch}
                />
              </div>
            )}

            {stepIndex === 3 && (
              <CustomerForm
                onSubmit={handleSubmitDetails}
                isSubmitting={createBooking.isPending}
                cancellationWindowHours={bookingRules.cancellationWindowHours}
              />
            )}
          </CardBody>
        </Card>

        <aside className="space-y-3 lg:sticky lg:top-6">
          <BookingSummary
            service={service}
            staff={staff === ANY_STAFF ? null : staff}
            slot={slot}
            timeZone={timeZone}
          />
          {stepIndex > 0 && (
            <Button variant="secondary" fullWidth onClick={() => goTo(stepIndex - 1)}>
              Back
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
