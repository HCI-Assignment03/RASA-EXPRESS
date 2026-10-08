import type { Order, OrderStatus, WithId } from '@/types';

// Order rules for the cook screens (S1 dashboard, S2 detail). Pure functions, covered by tests.
// The status lifecycle is placed -> accepted -> preparing -> ready. After "ready" the rider takes
// over (picked_up, delivered), and a cook can decline an order that is not being prepared yet.

/** The tabs of the S1 dashboard. */
export type OrderTab = 'new' | 'preparing' | 'ready' | 'past';

export const ORDER_TABS: { key: OrderTab; label: string }[] = [
  { key: 'new', label: 'New' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'past', label: 'Past' },
];

const TAB_OF_STATUS: Record<OrderStatus, OrderTab> = {
  placed: 'new',
  accepted: 'preparing',
  preparing: 'preparing',
  ready: 'ready',
  picked_up: 'ready',
  delivered: 'past',
  declined: 'past',
  cancelled: 'past',
};

export function tabOf(status: OrderStatus): OrderTab {
  return TAB_OF_STATUS[status];
}

/** How many orders are in each tab. */
export function countByTab(orders: Pick<Order, 'status'>[]): Record<OrderTab, number> {
  const counts: Record<OrderTab, number> = { new: 0, preparing: 0, ready: 0, past: 0 };
  orders.forEach((order) => (counts[tabOf(order.status)] += 1));
  return counts;
}

/** The orders of one tab. The list keeps the order it came in (newest first). */
export function ordersInTab<T extends Pick<Order, 'status'>>(orders: T[], tab: OrderTab): T[] {
  return orders.filter((order) => tabOf(order.status) === tab);
}

/** The one step a cook can take next, with the button text for it. null when the cook is done. */
export function nextStep(status: OrderStatus): { label: string; to: OrderStatus } | null {
  switch (status) {
    case 'placed':
      return { label: 'Accept order', to: 'accepted' };
    case 'accepted':
      return { label: 'Start preparing', to: 'preparing' };
    case 'preparing':
      return { label: 'Mark as ready', to: 'ready' };
    default:
      return null;
  }
}

/** A cook can decline until the cooking starts. */
export function canDecline(status: OrderStatus): boolean {
  return status === 'placed' || status === 'accepted';
}

/** Quick reasons offered on the decline form. "Other" lets the cook type their own. */
export const DECLINE_REASONS = [
  'Sold out',
  'Too busy right now',
  'Outside my delivery area',
  'Closed for the day',
] as const;

/** A short readable order number: the last five characters of the id, such as "#K3F9A". */
export function orderNumber(orderId: string): string {
  return `#${orderId.slice(-5).toUpperCase()}`;
}

/** "2 × Chicken Rice & Curry, 1 × Watalappan". */
export function itemsSummary(order: Pick<Order, 'items'>): string {
  return order.items.map((item) => `${item.qty} × ${item.name}`).join(', ');
}

/** Orders newest first. */
export function newestFirst<T extends WithId<Order>>(orders: T[]): T[] {
  return [...orders].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}
