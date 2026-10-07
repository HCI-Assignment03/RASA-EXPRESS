import {
  addDoc,
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

import type { AppNotification, WithId } from '@/types';

import { db } from './firebase';

/** Read, live: this customer's alerts, newest first (C8). */
export function subscribeToNotifications(
  uid: string,
  onData: (notifications: WithId<AppNotification>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'notifications'), where('uid', '==', uid)),
    (snapshot) => {
      const notifications = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data({ serverTimestamps: 'estimate' }) as AppNotification),
      }));
      // Sorted here so no composite Firestore index is needed.
      onData(notifications.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    },
    onError,
  );
}

/** Create: send an alert to a customer. Cook and rider screens call this when something changes. */
export async function createNotification(uid: string, text: string): Promise<void> {
  const notification = { uid, text, read: false, createdAt: serverTimestamp() };
  await addDoc(collection(db, 'notifications'), notification);
}

/** Update: mark one alert read (or unread). */
export async function setNotificationRead(id: string, read: boolean): Promise<void> {
  await updateDoc(doc(db, 'notifications', id), { read });
}

/** Update: mark several alerts read in one batch. */
export async function markNotificationsRead(ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach((id) => batch.update(doc(db, 'notifications', id), { read: true }));
  await batch.commit();
}
