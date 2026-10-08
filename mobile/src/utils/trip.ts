import type { Order } from '@/types';

/** What the rider has to do next on R2. */
export type TripStep = 'pick_up' | 'collect_cash' | 'deliver';

/**
 * The next step of a trip. A cash order cannot be marked delivered until the cash has been
 * recorded, so the rider cannot forget it. Orders paid online go straight from pick up to deliver.
 */
export function tripStep(
  order: Pick<Order, 'status' | 'paymentMethod' | 'paymentStatus'>,
): TripStep {
  if (order.status === 'ready') return 'pick_up';
  if (order.paymentMethod === 'cash' && order.paymentStatus !== 'received') return 'collect_cash';
  return 'deliver';
}
