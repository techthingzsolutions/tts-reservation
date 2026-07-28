/**
 * Booking lifecycle state machine (blueprint 3.1 / Phase 1).
 *
 * The API is the authority on transitions - it rejects invalid ones. The
 * frontend mirrors the rules so we can disable buttons instead of letting a
 * user fire a request that is guaranteed to fail.
 */

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
  NO_SHOW: 'no_show',
};

/** Which statuses a booking may move to from its current one. */
export const BOOKING_TRANSITIONS = {
  [BOOKING_STATUS.PENDING]: [BOOKING_STATUS.CONFIRMED, BOOKING_STATUS.CANCELLED],
  [BOOKING_STATUS.CONFIRMED]: [
    BOOKING_STATUS.COMPLETED,
    BOOKING_STATUS.CANCELLED,
    BOOKING_STATUS.NO_SHOW,
  ],
  // Terminal states.
  [BOOKING_STATUS.CANCELLED]: [],
  [BOOKING_STATUS.COMPLETED]: [],
  [BOOKING_STATUS.NO_SHOW]: [],
};

/**
 * Statuses that occupy a slot. Anything in this list must be subtracted from
 * availability; anything outside it frees the time up again.
 */
export const ACTIVE_BOOKING_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.CONFIRMED,
];

export const BOOKING_STATUS_LABELS = {
  [BOOKING_STATUS.PENDING]: 'Pending',
  [BOOKING_STATUS.CONFIRMED]: 'Confirmed',
  [BOOKING_STATUS.CANCELLED]: 'Cancelled',
  [BOOKING_STATUS.COMPLETED]: 'Completed',
  [BOOKING_STATUS.NO_SHOW]: 'No show',
};

/** Badge tone per status - keeps colour choices out of components. */
export const BOOKING_STATUS_TONES = {
  [BOOKING_STATUS.PENDING]: 'warning',
  [BOOKING_STATUS.CONFIRMED]: 'success',
  [BOOKING_STATUS.CANCELLED]: 'neutral',
  [BOOKING_STATUS.COMPLETED]: 'primary',
  [BOOKING_STATUS.NO_SHOW]: 'danger',
};

export function canTransition(from, to) {
  return (BOOKING_TRANSITIONS[from] ?? []).includes(to);
}

export function allowedTransitions(from) {
  return BOOKING_TRANSITIONS[from] ?? [];
}

export function isActiveStatus(status) {
  return ACTIVE_BOOKING_STATUSES.includes(status);
}

export function isTerminalStatus(status) {
  return (BOOKING_TRANSITIONS[status] ?? []).length === 0;
}
