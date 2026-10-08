import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Transaction,
  type Unsubscribe,
} from 'firebase/firestore';

import type { CartItem, Dish, Order, OrderStatus, WithId } from '@/types';
import { canDecline, newestFirst, nextStep } from '@/utils/cook-orders';

import { db } from './firebase';
import { createNotification } from './notifications';

const orderRef = (orderId: string) => doc(db, 'orders', orderId);

/** Thrown when the order changed while the cook was looking at it (for example the customer cancelled). */
export class OrderChangedError extends Error {
  constructor() {
    super('This order has changed. Check its new status.');
  }
}

/** Read, live: every order of this cook, newest first (S1). */
export function subscribeToCookOrders(
  cookId: string,
  onData: (orders: WithId<Order>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'orders'), where('cookId', '==', cookId)),
    (snapshot) =>
      onData(
        newestFirst(
          snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data({ serverTimestamps: 'estimate' }) as Order),
          })),
        ),
      ),
    onError,
  );
}

/**
 * Takes the ordered portions off the dishes (sign -1, when the cook accepts) or puts them back
 * (sign +1, when an accepted order is declined). A dish that no longer exists is skipped, and a
 * dish that reaches 0 portions is marked sold out. Firestore needs all reads before any write.
 */
async function adjustPortions(
  transaction: Transaction,
  items: CartItem[],
  sign: 1 | -1,
): Promise<void> {
  const refs = items.map((item) => doc(db, 'dishes', item.dishId));
  const snapshots = await Promise.all(refs.map((ref) => transaction.get(ref)));

  snapshots.forEach((snapshot, index) => {
    if (!snapshot.exists()) return;
    const dish = snapshot.data() as Dish;
    const portionsLeft = Math.max(0, dish.portionsLeft + sign * items[index].qty);
    transaction.update(refs[index], {
      portionsLeft,
      available: sign === 1 ? dish.available : dish.available && portionsLeft > 0,
    });
  });
}

const CUSTOMER_MESSAGE: Partial<Record<OrderStatus, string>> = {
  accepted: 'The cook accepted your order.',
  preparing: 'The cook is preparing your food.',
  ready: 'Your order is ready and waiting for a rider.',
};

// A failed alert must not make a saved status change look like a failure.
const tellCustomer = (order: Order, text: string) =>
  createNotification(order.customerId, text).catch(() => undefined);

/**
 * Update (S1, S2): move the order one step on: accept, start preparing, mark ready.
 * Accepting also takes the ordered portions off the menu. Runs in a transaction that first checks
 * the order still has the status the cook saw.
 */
export async function advanceOrder(order: WithId<Order>): Promise<void> {
  const step = nextStep(order.status);
  if (!step) return;

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(orderRef(order.id));
    if ((snapshot.data() as Order | undefined)?.status !== order.status) {
      throw new OrderChangedError();
    }
    if (step.to === 'accepted') await adjustPortions(transaction, order.items, -1);
    transaction.update(orderRef(order.id), { status: step.to, updatedAt: serverTimestamp() });
  });

  const message = CUSTOMER_MESSAGE[step.to];
  if (message) await tellCustomer(order, message);
}

/**
 * Delete from the cook's queue (S1, S2): decline with a reason. Only allowed before cooking starts.
 * An order that was already accepted gets its portions put back.
 */
export async function declineOrder(order: WithId<Order>, reason: string): Promise<void> {
  const trimmed = reason.trim();

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(orderRef(order.id));
    const current = snapshot.data() as Order | undefined;
    if (!current || !canDecline(current.status)) throw new OrderChangedError();

    if (current.status === 'accepted') await adjustPortions(transaction, current.items, 1);
    transaction.update(orderRef(order.id), {
      status: 'declined',
      declineReason: trimmed,
      updatedAt: serverTimestamp(),
    });
  });

  await tellCustomer(order, `Your order was declined: ${trimmed}`);
}
