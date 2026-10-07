import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { Favourite, WithId } from '@/types';

import { db } from './firebase';

// One document per saved cook, with a predictable id so saving twice cannot create duplicates.
const favouriteRef = (uid: string, cookId: string) => doc(db, 'favourites', `${uid}_${cookId}`);

/** Read, live: the cooks this customer has saved (C2 hearts, C8 list). */
export function subscribeToFavourites(
  uid: string,
  onData: (favourites: WithId<Favourite>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'favourites'), where('uid', '==', uid)),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Favourite) }))),
    onError,
  );
}

/** Create: save a cook. */
export async function addFavourite(uid: string, cookId: string): Promise<void> {
  const favourite: Favourite = { uid, cookId };
  await setDoc(favouriteRef(uid, cookId), favourite);
}

/** Delete: remove a saved cook. */
export async function removeFavourite(uid: string, cookId: string): Promise<void> {
  await deleteDoc(favouriteRef(uid, cookId));
}
