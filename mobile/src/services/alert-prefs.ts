import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { AlertPreference, Cook, WithId } from '@/types';
import { menuAlertText, type MenuChange } from '@/utils/menu-alerts';

import { db } from './firebase';
import { createNotifications } from './notifications';

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

/**
 * Create: tell every customer who switched alerts on for this cook about a menu change (S3 calls
 * this when a dish is added or back on sale). The rules let a cook read the preferences about them.
 */
export async function notifyFollowers(
  cookId: string,
  change: MenuChange,
  dishName: string,
): Promise<void> {
  const prefs = await getDocs(
    query(
      collection(db, 'alertPrefs'),
      where('cookId', '==', cookId),
      where('enabled', '==', true),
    ),
  );
  if (prefs.empty) return;

  const cook = await getDoc(doc(db, 'cooks', cookId));
  const cookName = (cook.data() as Cook | undefined)?.displayName ?? 'A cook you saved';
  const uids = prefs.docs.map((pref) => (pref.data() as AlertPreference).uid);
  await createNotifications(uids, menuAlertText(change, cookName, dishName));
}
