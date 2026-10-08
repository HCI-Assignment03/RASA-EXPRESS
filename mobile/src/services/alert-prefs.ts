import {
  collection,
  doc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { AlertPreference, WithId } from '@/types';

import { db } from './firebase';

// One document per saved cook, with a predictable id (same idea as favourites).
const prefRef = (uid: string, cookId: string) => doc(db, 'alertPrefs', `${uid}_${cookId}`);

/** Read, live: the alert switches this customer has set (C8). */
export function subscribeToAlertPrefs(
  uid: string,
  onData: (prefs: WithId<AlertPreference>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'alertPrefs'), where('uid', '==', uid)),
    (snapshot) =>
      onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as AlertPreference) }))),
    onError,
  );
}

/** Create: switch alerts on for a cook for the first time. */
export async function createAlertPreference(uid: string, cookId: string): Promise<void> {
  const preference: AlertPreference = { uid, cookId, enabled: true };
  await setDoc(prefRef(uid, cookId), preference);
}

/** Update: switch the alerts of a cook on or off. */
export async function setAlertEnabled(
  uid: string,
  cookId: string,
  enabled: boolean,
): Promise<void> {
  await updateDoc(prefRef(uid, cookId), { enabled });
}
