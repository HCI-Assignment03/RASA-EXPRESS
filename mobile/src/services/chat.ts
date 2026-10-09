import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';

import type { ChatMessage, WithId } from '@/types';

import { db } from './firebase';

// orders/{orderId}/messages: the customer and the rider talk here. The Firestore rules let every
// party of the order read and write, so the cook can read it too.
const messagesRef = (orderId: string) => collection(db, 'orders', orderId, 'messages');

/** Read, live: the messages of one order, oldest first. */
export function subscribeToMessages(
  orderId: string,
  onData: (messages: WithId<ChatMessage>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(messagesRef(orderId), orderBy('createdAt', 'asc')),
    (snapshot) =>
      onData(
        snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data({ serverTimestamps: 'estimate' }) as ChatMessage),
        })),
      ),
    onError,
  );
}

/** Create (C6 customer, R2 rider): send a message. */
export async function sendMessage(orderId: string, senderId: string, text: string): Promise<void> {
  await addDoc(messagesRef(orderId), {
    senderId,
    text: text.trim(),
    createdAt: serverTimestamp(),
  });
}
