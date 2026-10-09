import type { OrderStatus } from '@/types';

import { riderFee } from './delivery';

// The numbers on the rider's Profile tab. Pure functions, covered by unit tests.

/** What the stats need from an order. A Firestore Timestamp has toDate(). */
export type RiderOrder = {
  cookId: string;
  status: OrderStatus;
  /** Set when the rider marks the order delivered. */
  updatedAt: { toDate(): Date };
};

export type RiderStats = {
  /** Deliveries finished today. */
  todayCount: number;
  /** Fees earned for today's deliveries, in rupees. */
  todayEarned: number;
  /** Every delivery this rider has finished. */
  totalCount: number;
};

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/**
 * Counts the delivered orders and what they earned today. The fee of a trip depends on the cook's
 * distance (`riderFee`), so `distanceOf` gives the distance of a cook, or 0 when it is unknown.
 */
export function riderStats(
  orders: RiderOrder[],
  distanceOf: (cookId: string) => number,
  now: Date,
): RiderStats {
  const delivered = orders.filter((order) => order.status === 'delivered');
  const today = delivered.filter((order) => sameDay(order.updatedAt.toDate(), now));

  return {
    todayCount: today.length,
    todayEarned: today.reduce((sum, order) => sum + riderFee(distanceOf(order.cookId)), 0),
    totalCount: delivered.length,
  };
}
