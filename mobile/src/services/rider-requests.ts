import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';

import type { DismissedRequest, Order, WithId } from '@/types';

import { createNotification } from './notifications';
import { db } from './firebase';

const orderRef = (orderId: string) => doc(db, 'orders', orderId);
// One document per dismissed request, with a predictable id so dismissing twice changes nothing.
const dismissalRef = (uid: string, orderId: string) =>
  doc(db, 'dismissedRequests', `${uid}_${orderId}`);

/** Thrown by acceptRequest when another rider got there first. */
export class RequestTakenError extends Error {
  constructor() {
    super('This request was already taken by another rider.');
  }
}

/**
 * Read, live: orders the cook marked "ready" that no rider has accepted yet, oldest first.
 * The Firestore rules only let riders read orders in exactly this state.
 */
export function subscribeToOpenRequests(
  onData: (orders: WithId<Order>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'orders'), where('status', '==', 'ready'), where('riderId', '==', null)),
    (snapshot) => {
      const orders = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data({ serverTimestamps: 'estimate' }) as Order),
      }));
      // Sorted here so no composite Firestore index is needed.
      onData(orders.sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()));
    },
    onError,
  );
}

/**
 * Update: this rider takes the request. Done in a transaction so two riders cannot both get it.
 * Once another rider has taken it, the rules stop this rider reading it, so that also counts as taken.
 * The customer is told through a C8 alert.
 */
export async function acceptRequest(
  orderId: string,
  rider: { uid: string; name: string },
): Promise<void> {
  let customerId: string;
  try {
    customerId = await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(orderRef(orderId));
      const order = snapshot.data() as Order | undefined;
      if (!order || order.riderId !== null || order.status !== 'ready') {
        throw new RequestTakenError();
      }
      transaction.update(orderRef(orderId), { riderId: rider.uid, updatedAt: serverTimestamp() });
      return order.customerId;
    });
  } catch (error) {
    if (error instanceof FirebaseError && error.code === 'permission-denied') {
      throw new RequestTakenError();
    }
    throw error;
  }

  // The rider is already assigned, so a failed alert must not make the accept look like it failed.
  createNotification(
    customerId,
    `${rider.name} accepted your delivery and is heading to the cook.`,
  ).catch(() => undefined);
}

/** Read, live: the request ids this rider has dismissed. */
export function subscribeToDismissals(
  uid: string,
  onData: (dismissals: WithId<DismissedRequest>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'dismissedRequests'), where('uid', '==', uid)),
    (snapshot) =>
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as DismissedRequest) }))),
    onError,
  );
}

/** Delete (from this rider's list): hide a request. Other riders still see it. */
export async function dismissRequest(uid: string, orderId: string): Promise<void> {
  const dismissal: DismissedRequest = { uid, orderId };
  await setDoc(dismissalRef(uid, orderId), dismissal);
}

/** Undo every dismissal of this rider, so the hidden requests show again. */
export async function restoreDismissed(uid: string, orderIds: string[]): Promise<void> {
  const batch = writeBatch(db);
  orderIds.forEach((orderId) => batch.delete(dismissalRef(uid, orderId)));
  await batch.commit();
}
