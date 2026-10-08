import type { Tone } from '@/constants/theme';
import type { Order, OrderStatus, PaymentMethod, WithId } from '@/types';

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

/** The status as the cook reads it. */
export const STATUS_LABEL: Record<OrderStatus, string> = {
  placed: 'New',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready for rider',
  picked_up: 'On the way',
  delivered: 'Delivered',
  declined: 'Declined',
  cancelled: 'Cancelled by customer',
};

export const STATUS_TONE: Record<OrderStatus, Tone> = {
  placed: 'primary',
  accepted: 'primary',
  preparing: 'warning',
  ready: 'success',
  picked_up: 'success',
  delivered: 'success',
  declined: 'danger',
  cancelled: 'neutral',
};

const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Cash on delivery',
  card: 'Card',
  bank: 'Bank transfer',
  wallet: 'Wallet',
};

/** "Cash on delivery, to collect" or "Card, received". */
export function paymentLabel(order: Pick<Order, 'paymentMethod' | 'paymentStatus'>): string {
  const state = order.paymentStatus === 'received' ? 'received' : 'to collect';
  return `${METHOD_LABEL[order.paymentMethod]}, ${state}`;
}

/** The cook can confirm a payment that is still pending, unless the order was declined or cancelled. */
export function canMarkPaid(order: Pick<Order, 'status' | 'paymentStatus'>): boolean {
  return (
    order.paymentStatus === 'pending' && order.status !== 'declined' && order.status !== 'cancelled'
  );
}
