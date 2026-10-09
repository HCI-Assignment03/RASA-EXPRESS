import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';

import type { Order, WithId } from '@/types';
import { newestFirst } from '@/utils/cook-orders';

import { db } from './firebase';

/** Read, live: every order this customer has placed, newest first (C6 Orders tab). */
export function subscribeToMyOrders(
  customerId: string,
  onData: (orders: WithId<Order>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'orders'), where('customerId', '==', customerId)),
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
