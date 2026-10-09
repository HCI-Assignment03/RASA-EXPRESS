import type { OrderStatus } from '../src/types';
import { riderStats, type RiderOrder } from '../src/utils/rider-stats';

const now = new Date(2026, 9, 9, 18, 0);

const order = (cookId: string, status: OrderStatus, when: Date): RiderOrder => ({
  cookId,
  status,
  updatedAt: { toDate: () => when },
});

// Cook "near" is 1.2 km away (Rs. 150 a trip), cook "far" 2.5 km (Rs. 200).
const distanceOf = (cookId: string) => ({ near: 1.2, far: 2.5 })[cookId] ?? 0;

describe('riderStats', () => {
  it("counts today's deliveries and what they earned", () => {
    const stats = riderStats(
      [
        order('near', 'delivered', new Date(2026, 9, 9, 9, 30)),
        order('far', 'delivered', new Date(2026, 9, 9, 13, 0)),
        order('near', 'delivered', new Date(2026, 9, 8, 20, 0)),
      ],
      distanceOf,
      now,
    );
    expect(stats).toEqual({ todayCount: 2, todayEarned: 350, totalCount: 3 });
  });

  it('leaves out trips that are not delivered yet', () => {
    const stats = riderStats(
      [order('near', 'ready', now), order('near', 'picked_up', now)],
      distanceOf,
      now,
    );
    expect(stats).toEqual({ todayCount: 0, todayEarned: 0, totalCount: 0 });
  });

  it('pays the base fee when the cook is unknown', () => {
    expect(riderStats([order('gone', 'delivered', now)], distanceOf, now).todayEarned).toBe(100);
  });
});
