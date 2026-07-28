import { useQuery } from '@tanstack/react-query';
import { Card, CardBody, ErrorState, LoadingBlock, PageHeader } from '@/components/ui';
import { PhasePlaceholder } from '@/components/PhasePlaceholder';
import { queryKeys } from '@/constants/queryKeys';
import { staffApi } from '../api/staffApi';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function StaffPage() {
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: queryKeys.staff.list(),
    queryFn: () => staffApi.list(),
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Staff" description="Who works when, and what they can do." />

      {isPending && <LoadingBlock label="Loading staff" />}
      {isError && <ErrorState message={error.message} onRetry={refetch} />}

      {data && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data.map((member) => (
            <li key={member.id}>
              <Card className="h-full">
                <CardBody>
                  <h3 className="font-medium text-content">{member.name}</h3>
                  <p className="text-sm text-content-muted">{member.title}</p>
                  <p className="mt-2 text-sm text-content-muted">{member.bio}</p>
                  <ul className="mt-3 space-y-0.5 text-sm">
                    {member.schedule.map((shift) => (
                      <li key={shift.dayOfWeek} className="flex justify-between">
                        <span className="text-content-muted">
                          {DAY_LABELS[shift.dayOfWeek]}
                        </span>
                        <span className="font-medium text-content">
                          {shift.startTime} – {shift.endTime}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardBody>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <PhasePlaceholder
        phase="Phase 3 · Admin dashboard"
        title="Staff management still to build"
        items={[
          'Add, edit and deactivate staff',
          'Edit weekly schedules (staff_schedules)',
          'Approve time off, which blocks availability automatically',
          'Assign services per staff member',
        ]}
      />
    </div>
  );
}
