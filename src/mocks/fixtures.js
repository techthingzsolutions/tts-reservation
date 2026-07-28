/**
 * Seeded demo data (blueprint 6.6 - "an empty calendar sells nothing").
 *
 * Vertical: staff + service, the shape recommended for first release.
 * Tenant: a salon, matching the recommended target vertical.
 */

export const TENANT = {
  id: 1,
  slug: 'demo-salon',
  name: 'Bloom Salon & Spa',
  timezone: 'Asia/Manila',
  currency: 'PHP',
  address: '2F Unit 204, Rizal Ave, Olongapo City, Zambales',
  phone: '+63 917 555 0142',
  email: 'hello@bloomsalon.ph',
  theme: {
    paletteId: 'plum-luxe',
    fontPairing: 'playfair-inter',
    radius: 'soft',
    businessName: 'Bloom Salon & Spa',
    logoUrl: null,
  },
  bookingRules: {
    slotIncrementMinutes: 15,
    minimumLeadTimeMinutes: 120,
    maximumAdvanceDays: 60,
    cancellationWindowHours: 24,
  },
};

/** Business hours per weekday. 0 = Sunday. Local wall-clock time (5.4). */
export const BUSINESS_HOURS = [
  { dayOfWeek: 0, openTime: null, closeTime: null }, // closed Sundays
  { dayOfWeek: 1, openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 2, openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 3, openTime: '09:00', closeTime: '18:00' },
  { dayOfWeek: 4, openTime: '09:00', closeTime: '20:00' },
  { dayOfWeek: 5, openTime: '09:00', closeTime: '20:00' },
  { dayOfWeek: 6, openTime: '08:00', closeTime: '17:00' },
];

export const SERVICES = [
  {
    id: 1,
    name: 'Haircut & Blow Dry',
    description: 'Consultation, wash, cut and finish.',
    category: 'Hair',
    durationMinutes: 45,
    price: '650.00',
    bufferBefore: 0,
    bufferAfter: 15,
    isActive: true,
    staffIds: [1, 2, 3],
  },
  {
    id: 2,
    name: 'Hair Colour (Full)',
    description: 'Full-head colour with toner and treatment.',
    category: 'Hair',
    durationMinutes: 150,
    price: '3200.00',
    bufferBefore: 0,
    bufferAfter: 30,
    isActive: true,
    staffIds: [1, 3],
  },
  {
    id: 3,
    name: 'Classic Manicure',
    description: 'Shaping, cuticle care and polish.',
    category: 'Nails',
    durationMinutes: 45,
    price: '450.00',
    bufferBefore: 0,
    bufferAfter: 10,
    isActive: true,
    staffIds: [2, 4],
  },
  {
    id: 4,
    name: 'Gel Manicure & Pedicure',
    description: 'Gel application on hands and feet.',
    category: 'Nails',
    durationMinutes: 90,
    price: '1150.00',
    bufferBefore: 0,
    bufferAfter: 15,
    isActive: true,
    staffIds: [4],
  },
  {
    id: 5,
    name: 'Relaxing Body Massage',
    description: '60-minute full body Swedish massage.',
    category: 'Spa',
    durationMinutes: 60,
    price: '900.00',
    bufferBefore: 10,
    bufferAfter: 20,
    isActive: true,
    staffIds: [3, 4],
  },
  {
    id: 6,
    name: 'Hair & Makeup (Events)',
    description: 'Styling and makeup for weddings and events.',
    category: 'Hair',
    durationMinutes: 120,
    price: '2800.00',
    bufferBefore: 0,
    bufferAfter: 30,
    isActive: false,
    staffIds: [1],
  },
];

export const STAFF = [
  {
    id: 1,
    name: 'Mika Reyes',
    title: 'Senior Stylist',
    bio: 'Twelve years in colour correction and bridal styling.',
    avatarUrl: null,
    isActive: true,
    // day 0 = Sunday. Missing days = not working.
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '11:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '20:00' },
    ],
  },
  {
    id: 2,
    name: 'Joan dela Cruz',
    title: 'Stylist',
    bio: 'Precision cuts and everyday styling.',
    avatarUrl: null,
    isActive: true,
    schedule: [
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '17:00' },
    ],
  },
  {
    id: 3,
    name: 'Paolo Santos',
    title: 'Senior Stylist & Therapist',
    bio: 'Colour specialist, also certified in Swedish massage.',
    avatarUrl: null,
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 3, startTime: '10:00', endTime: '18:00' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '20:00' },
      { dayOfWeek: 5, startTime: '10:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '16:00' },
    ],
  },
  {
    id: 4,
    name: 'Aira Lim',
    title: 'Nail Technician',
    bio: 'Gel and nail art specialist.',
    avatarUrl: null,
    isActive: true,
    schedule: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 2, startTime: '09:00', endTime: '17:00' },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '18:00' },
      { dayOfWeek: 6, startTime: '08:00', endTime: '17:00' },
    ],
  },
];

export const CUSTOMERS = [
  {
    id: 1,
    name: 'Grace Villanueva',
    email: 'grace.v@example.com',
    phone: '+63 917 555 0101',
    notes: 'Prefers Mika. Allergic to ammonia-based dye.',
    visitCount: 14,
    noShowCount: 0,
  },
  {
    id: 2,
    name: 'Marco Tan',
    email: 'marco.tan@example.com',
    phone: '+63 918 555 0102',
    notes: '',
    visitCount: 3,
    noShowCount: 1,
  },
  {
    id: 3,
    name: 'Bea Ocampo',
    email: 'bea.ocampo@example.com',
    phone: '+63 919 555 0103',
    notes: 'Always books the last slot of the day.',
    visitCount: 7,
    noShowCount: 0,
  },
];

/** Demo login. Mock only - the real API issues Sanctum tokens. */
export const USERS = [
  {
    id: 1,
    name: 'Owner Demo',
    email: 'owner@demo.test',
    password: 'password',
    role: 'owner',
  },
  {
    id: 2,
    name: 'Mika Reyes',
    email: 'staff@demo.test',
    password: 'password',
    role: 'staff',
    staffId: 1,
  },
];

/** Public holidays that block the whole day (blueprint 5.2 step 3). */
export const HOLIDAYS = [{ date: '2026-08-21', name: 'Ninoy Aquino Day' }];

export const STAFF_TIME_OFF = [
  // Populated relative to today by the mock db so the demo always shows one.
];
