import { z } from 'zod';

/**
 * Client-side validation only. The API validates every field again - server
 * side validation is non-negotiable (blueprint 3.4).
 */

// Philippine mobile numbers, with or without +63 / leading 0, spaces allowed.
const PH_PHONE = /^(\+63|0)?9\d{9}$/;

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Please enter your full name.')
    .max(100, 'Name is too long.'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required so we can send your confirmation.')
    .email('Please enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Mobile number is required for reminders.')
    .transform((value) => value.replace(/[\s-()]/g, ''))
    .refine((value) => PH_PHONE.test(value), 'Enter a valid PH mobile number.'),
  notes: z.string().trim().max(500, 'Please keep notes under 500 characters.').optional(),
  acceptsPolicy: z.literal(true, {
    errorMap: () => ({ message: 'Please accept the cancellation policy.' }),
  }),
});
