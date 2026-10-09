import { collection, doc, onSnapshot, updateDoc, type Unsubscribe } from 'firebase/firestore';

import type { Cook, WithId } from '@/types';
import type { KitchenInput } from '@/utils/kitchen';

import { db } from './firebase';

/** Read, live: every cook (C2). The callback runs again whenever a cook changes. */
export function subscribeToCooks(
  onData: (cooks: WithId<Cook>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    collection(db, 'cooks'),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Cook) }))),
    onError,
  );
}

/** Read, live: one cook, or null if it does not exist (C3). */
export function subscribeToCook(
  cookId: string,
  onData: (cook: WithId<Cook> | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    doc(db, 'cooks', cookId),
    (snapshot) =>
      onData(snapshot.exists() ? { id: snapshot.id, ...(snapshot.data() as Cook) } : null),
    onError,
  );
}

/** Update: the cook changes their own page (name, area, description, tags, pre-orders, times). */
export async function updateKitchen(cookId: string, input: KitchenInput): Promise<void> {
  await updateDoc(doc(db, 'cooks', cookId), input);
}
