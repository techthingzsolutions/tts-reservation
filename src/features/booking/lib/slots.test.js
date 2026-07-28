import { describe, expect, it } from 'vitest';
import { groupSlotsByPeriod, removeStaleSlots, slotStillAvailable } from './slots';

const TZ = 'Asia/Manila'; // UTC+8, no DST

/** Build a slot from a Manila wall-clock time. */
const slotAt = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  const utcHour = h - 8;
  const date = new Date(Date.UTC(2026, 7, 3, utcHour, m));
  return { startsAt: date.toISOString(), endsAt: date.toISOString(), staffIds: [1] };
};

describe('groupSlotsByPeriod', () => {
  it('buckets slots by tenant-local hour, not UTC hour', () => {
    // 09:00 Manila is 01:00 UTC - grouping on UTC would call this "morning"
    // by accident and 20:00 Manila (12:00 UTC) "afternoon" wrongly.
    const groups = groupSlotsByPeriod(
      [slotAt('09:00'), slotAt('14:00'), slotAt('19:30')],
      TZ
    );

    expect(groups.map((g) => g.id)).toEqual(['morning', 'afternoon', 'evening']);
    expect(groups[0].slots).toHaveLength(1);
    expect(groups[2].slots).toHaveLength(1);
  });

  it('drops empty periods so no bare heading renders', () => {
    const groups = groupSlotsByPeriod([slotAt('10:00'), slotAt('11:15')], TZ);
    expect(groups).toHaveLength(1);
    expect(groups[0].id).toBe('morning');
  });

  it('returns nothing for an empty slot list', () => {
    expect(groupSlotsByPeriod([], TZ)).toEqual([]);
    expect(groupSlotsByPeriod(undefined, TZ)).toEqual([]);
  });

  it('puts a noon slot in the afternoon, not the morning', () => {
    const groups = groupSlotsByPeriod([slotAt('12:00')], TZ);
    expect(groups[0].id).toBe('afternoon');
  });
});

describe('removeStaleSlots', () => {
  it('drops slots that have already started', () => {
    const now = new Date('2026-08-03T04:00:00Z'); // 12:00 Manila
    const kept = removeStaleSlots([slotAt('09:00'), slotAt('15:00')], now);

    expect(kept).toHaveLength(1);
    expect(kept[0].startsAt).toBe(slotAt('15:00').startsAt);
  });
});

describe('slotStillAvailable', () => {
  const slots = [slotAt('09:00'), slotAt('09:30')];

  it('confirms a slot that is still in the refreshed list', () => {
    expect(slotStillAvailable(slots, slotAt('09:30').startsAt)).toBe(true);
  });

  it('reports a slot taken by someone else as gone', () => {
    expect(slotStillAvailable(slots, slotAt('10:00').startsAt)).toBe(false);
  });
});
