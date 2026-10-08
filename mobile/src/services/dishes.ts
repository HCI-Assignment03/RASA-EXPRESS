import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { Dish, WithId } from '@/types';
import type { DishInput } from '@/utils/dish-form';

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

/** Read, live: one dish for C4. onData gets null when the dish does not exist (or was deleted). */
export function subscribeToDish(
  dishId: string,
  onData: (dish: WithId<Dish> | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'dishes', dishId),
    (snapshot) =>
      onData(snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() as Dish) } : null),
    onError,
  );
}

/** Create (S3): add a dish to this cook's menu. There are no photos yet, so photoUrl stays empty. */
export async function createDish(cookId: string, input: DishInput): Promise<void> {
  const dish: Dish = { ...input, cookId, photoUrl: '' };
  await addDoc(collection(db, 'dishes'), dish);
}

/** Update (S3): change any fields of a dish, for example portionsLeft or available. */
export async function updateDish(dishId: string, patch: Partial<DishInput>): Promise<void> {
  await updateDoc(doc(db, 'dishes', dishId), patch);
}

/** Delete (S3): remove a dish from the menu. */
export async function deleteDish(dishId: string): Promise<void> {
  await deleteDoc(doc(db, 'dishes', dishId));
}
