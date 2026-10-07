import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';

import type { Dish, WithId } from '@/types';

import { db } from './firebase';

/**
 * Read, live: the dishes of one cook, or of every cook when cookId is null.
 * C2 searches all dishes, C3 and C4 show one cook's menu.
 */
export function subscribeToDishes(
  cookId: string | null,
  onData: (dishes: WithId<Dish>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const dishes = collection(db, 'dishes');
  return onSnapshot(
    cookId ? query(dishes, where('cookId', '==', cookId)) : dishes,
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Dish) }))),
    onError,
  );
}
