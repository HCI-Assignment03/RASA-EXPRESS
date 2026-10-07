import {
  collection,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';

import type { LatLng, Order, Payment, WithId } from '@/types';

import { db } from './firebase';
import { createNotification } from './notifications';

const orderRef = (orderId: string) => doc(db, 'orders', orderId);

/**
 * Read, live: the trips this rider has accepted and not finished, oldest first.
 * The first one is the active trip (R2); the rest wait in line.
 */
export function subscribeToTrips(
  uid: string,
  onData: (trips: WithId<Order>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'orders'), where('riderId', '==', uid)),
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data({ serverTimestamps: 'estimate' }) as Order),
      }));
      const open = orders.filter((o) => o.status === 'ready' || o.status === 'picked_up');
      onData(open.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()));
    },
    onError,
  );
}

// Alerts must never make a successful status change look like a failure, so errors are swallowed.
const tellCustomer = (order: Order, text: string) =>
  createNotification(order.customerId, text).catch(() => undefined);

/** Update: the rider has the food. The order moves from "ready" to "picked_up". */
export async function markPickedUp(order: WithId<Order>, riderName: string): Promise<void> {
  await updateDoc(orderRef(order.id), { status: 'picked_up', updatedAt: serverTimestamp() });
  await tellCustomer(order, `${riderName} picked up your order and is on the way.`);
}

/** Update: the food reached the customer. The order moves to "delivered". */
export async function markDelivered(order: WithId<Order>, riderName: string): Promise<void> {
  await updateDoc(orderRef(order.id), { status: 'delivered', updatedAt: serverTimestamp() });
  await tellCustomer(order, `${riderName} delivered your order. How was the food?`);
}

/**
 * Create: record the cash the rider collected. Writes the payment (read by the cook's sales
 * report, S4) and marks the order paid, in one batch. The payment id is fixed per order, so
 * pressing the button twice cannot record the cash twice.
 */
export async function recordCashCollected(order: WithId<Order>): Promise<void> {
  const payment: Omit<Payment, 'createdAt'> & { createdAt: unknown } = {
    cookId: order.cookId,
    orderId: order.id,
    amount: order.total,
    method: 'cash',
    status: 'received',
    createdAt: serverTimestamp(),
  };

  const batch = writeBatch(db);
  batch.set(doc(db, 'payments', `cash_${order.id}`), payment);
  batch.update(orderRef(order.id), { paymentStatus: 'received', updatedAt: serverTimestamp() });
  await batch.commit();
}

/** Update: the rider's position, shown to the customer on the tracking screen (C6). */
export async function updateRiderLocation(orderId: string, location: LatLng): Promise<void> {
  await updateDoc(orderRef(orderId), { riderLocation: location });
}
