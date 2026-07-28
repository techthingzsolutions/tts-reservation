import { describe, expect, it } from 'vitest';
import {
  BOOKING_STATUS,
  allowedTransitions,
  canTransition,
  isActiveStatus,
  isTerminalStatus,
} from './bookingStatus';

describe('booking state machine', () => {
  it('allows a pending booking to be confirmed or cancelled', () => {
    expect(canTransition(BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED)).toBe(true);
    expect(canTransition(BOOKING_STATUS.PENDING, BOOKING_STATUS.CANCELLED)).toBe(true);
  });

  it('does not allow a pending booking to jump straight to completed', () => {
    expect(canTransition(BOOKING_STATUS.PENDING, BOOKING_STATUS.COMPLETED)).toBe(false);
    expect(canTransition(BOOKING_STATUS.PENDING, BOOKING_STATUS.NO_SHOW)).toBe(false);
  });

  it('allows a confirmed booking to complete, cancel or no-show', () => {
    expect(allowedTransitions(BOOKING_STATUS.CONFIRMED)).toEqual([
      BOOKING_STATUS.COMPLETED,
      BOOKING_STATUS.CANCELLED,
      BOOKING_STATUS.NO_SHOW,
    ]);
  });

  it('treats cancelled, completed and no-show as terminal', () => {
    expect(isTerminalStatus(BOOKING_STATUS.CANCELLED)).toBe(true);
    expect(isTerminalStatus(BOOKING_STATUS.COMPLETED)).toBe(true);
    expect(isTerminalStatus(BOOKING_STATUS.NO_SHOW)).toBe(true);
    expect(isTerminalStatus(BOOKING_STATUS.PENDING)).toBe(false);
  });

  it('never reopens a terminal booking', () => {
    for (const to of Object.values(BOOKING_STATUS)) {
      expect(canTransition(BOOKING_STATUS.CANCELLED, to)).toBe(false);
      expect(canTransition(BOOKING_STATUS.COMPLETED, to)).toBe(false);
    }
  });

  it('counts only pending and confirmed as occupying a slot', () => {
    expect(isActiveStatus(BOOKING_STATUS.PENDING)).toBe(true);
    expect(isActiveStatus(BOOKING_STATUS.CONFIRMED)).toBe(true);
    expect(isActiveStatus(BOOKING_STATUS.CANCELLED)).toBe(false);
    expect(isActiveStatus(BOOKING_STATUS.COMPLETED)).toBe(false);
    expect(isActiveStatus(BOOKING_STATUS.NO_SHOW)).toBe(false);
  });

  it('returns an empty list for an unknown status rather than throwing', () => {
    expect(allowedTransitions('not_a_status')).toEqual([]);
    expect(canTransition('not_a_status', BOOKING_STATUS.CONFIRMED)).toBe(false);
  });
});
