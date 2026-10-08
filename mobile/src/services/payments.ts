import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { Payment, WithId } from '@/types';
import { isManualSale } from '@/utils/sales';

import { db } from './firebase';

/** Read, live: every payment of this cook, newest first (S4). */
export function subscribeToPayments(
  cookId: string,
  onData: (payments: WithId<Payment>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'payments'), where('cookId', '==', cookId)),
    (snapshot) => {
      const payments = snapshot.docs.map((d) => ({
        id: d.id,
        ...(d.data({ serverTimestamps: 'estimate' }) as Payment),
      }));
      // Sorted here so no composite Firestore index is needed.
      onData(payments.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()));
    },
    onError,
  );
}

/** Create (S4): record a cash sale that did not come through the app, such as a walk-in customer. */
export async function createManualSale(
  cookId: string,
  amount: number,
  note: string,
): Promise<void> {
  const sale = {
    cookId,
    orderId: null,
    amount,
    method: 'cash',
    status: 'received',
    note: note.trim(),
    createdAt: serverTimestamp(),
  };
  await addDoc(collection(db, 'payments'), sale);
}

/** Delete (S4): remove a manual entry typed in by mistake. Payments for orders cannot be deleted. */
export async function deleteManualSale(payment: WithId<Payment>): Promise<void> {
  if (!isManualSale(payment)) {
    throw new Error('Only manual sales can be deleted.');
  }
  await deleteDoc(doc(db, 'payments', payment.id));
}
