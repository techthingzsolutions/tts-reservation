import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, FormField, Input, Textarea } from '@/components/ui';
import { customerSchema } from '../schemas/customerSchema';

/**
 * Guest booking - no account required (blueprint Phase 2, must-have).
 * The confirmation and manage links are sent to this email as a secure token.
 */
export function CustomerForm({ onSubmit, isSubmitting, cancellationWindowHours }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { name: '', email: '', phone: '', notes: '', acceptsPolicy: false },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <FormField label="Full name" error={errors.name?.message} required>
        {(field) => (
          <Input
            {...field}
            {...register('name')}
            autoComplete="name"
            placeholder="Juan dela Cruz"
          />
        )}
      </FormField>

      <FormField
        label="Email"
        error={errors.email?.message}
        hint="Your confirmation and manage-booking link go here."
        required
      >
        {(field) => (
          <Input
            {...field}
            {...register('email')}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
          />
        )}
      </FormField>

      <FormField label="Mobile number" error={errors.phone?.message} required>
        {(field) => (
          <Input
            {...field}
            {...register('phone')}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="09XX XXX XXXX"
          />
        )}
      </FormField>

      <FormField label="Notes for the team" error={errors.notes?.message}>
        {(field) => (
          <Textarea
            {...field}
            {...register('notes')}
            placeholder="Anything we should know before your visit?"
          />
        )}
      </FormField>

      <div>
        <label className="flex items-start gap-2.5 text-sm text-content">
          <input
            type="checkbox"
            {...register('acceptsPolicy')}
            className="mt-0.5 h-4 w-4 rounded border-border text-primary"
          />
          <span>
            I understand that cancelling within {cancellationWindowHours} hours of my
            appointment may not be permitted.
          </span>
        </label>
        {errors.acceptsPolicy && (
          <p role="alert" className="field-error">
            {errors.acceptsPolicy.message}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" fullWidth loading={isSubmitting}>
        Confirm booking
      </Button>
    </form>
  );
}
