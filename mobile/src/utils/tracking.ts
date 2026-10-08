import type { Cook, Order, OrderStatus } from '@/types';

// What the customer sees on C6 (orders list and tracking). Pure functions, covered by tests.

/** The steps of the progress bar, in order. */
export const PROGRESS_STEPS = [
  'Placed',
  'Confirmed',
  'Preparing',
  'On the way',
  'Delivered',
] as const;

/**
 * Which step the order has reached, 0 to 4. A ready order counts as "Preparing" until the rider
 * picks it up. Declined and cancelled orders have no progress: -1.
 */
export function progressIndex(status: OrderStatus): number {
  switch (status) {
    case 'placed':
      return 0;
    case 'accepted':
      return 1;
    case 'preparing':
    case 'ready':
      return 2;
    case 'picked_up':
      return 3;
    case 'delivered':
      return 4;
    default:
      return -1;
  }
}

/** The status in the customer's words. `hasRider` tells a ready order apart before and after a rider accepts. */
export function customerStatus(status: OrderStatus, hasRider: boolean): string {
  switch (status) {
    case 'placed':
      return 'Waiting for the cook to confirm';
    case 'accepted':
      return 'Order confirmed';
    case 'preparing':
      return 'Your food is being prepared';
    case 'ready':
      return hasRider ? 'Your rider is picking up the food' : 'Food is ready, finding a rider';
    case 'picked_up':
      return 'On the way to you';
    case 'delivered':
      return 'Delivered. Enjoy your meal!';
    case 'declined':
      return 'The cook could not take this order';
    case 'cancelled':
      return 'You cancelled this order';
  }
}

/** The customer can cancel until the cook accepts. */
export function canCancel(status: OrderStatus): boolean {
  return status === 'placed';
}

/** Chat with the rider works from the moment a rider accepts until the food is delivered. */
export function canChat(order: Pick<Order, 'status' | 'riderId'>): boolean {
  return order.riderId !== null && (order.status === 'ready' || order.status === 'picked_up');
}

/** The customer can rate an order once it has been delivered. */
export function canReview(status: OrderStatus): boolean {
  return status === 'delivered';
}

/** True while the order is still going somewhere, so the Orders tab can show it first. */
export function isActive(status: OrderStatus): boolean {
  return progressIndex(status) >= 0 && status !== 'delivered';
}

function clock(date: Date): string {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

/**
 * When to expect the food: "Arrives about 3:10 PM to 3:25 PM" for an ASAP order (order time plus
 * the cook's usual range), or the chosen slot for a pre-order. null when the order is over.
 */
export function etaText(
  order: Pick<Order, 'status' | 'schedule'> & { createdAt: { toDate: () => Date } },
  cook: Pick<Cook, 'etaMin' | 'etaMax'> | null,
): string | null {
  if (progressIndex(order.status) < 0 || order.status === 'delivered') return null;

  if (order.schedule.when !== 'asap') {
    const day = order.schedule.when === 'today' ? 'Today' : 'Tomorrow';
    return `Scheduled for ${day} at ${order.schedule.time}`;
  }
  if (!cook) return null;

  const placed = order.createdAt.toDate().getTime();
  const from = new Date(placed + cook.etaMin * 60000);
  const to = new Date(placed + cook.etaMax * 60000);
  return `Arrives about ${clock(from)} to ${clock(to)}`;
}
