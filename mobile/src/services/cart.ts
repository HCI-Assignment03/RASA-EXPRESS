import { deleteDoc, doc, onSnapshot, runTransaction, type Unsubscribe } from 'firebase/firestore';

import type { Cart } from '@/types';
import { addDish, setNote, setQuantity, type CartDish } from '@/utils/cart';

import { db } from './firebase';

// carts/{customerUid}: one document per customer, holding the dishes of a single cook.
const cartRef = (uid: string) => doc(db, 'carts', uid);

/** Read, live: the customer's cart, or null when it is empty. */
export function subscribeToCart(
  uid: string,
  onData: (cart: Cart | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    cartRef(uid),
    (snapshot) => onData(snapshot.exists() ? (snapshot.data() as Cart) : null),
    onError,
  );
}

/** Reads the cart, applies `change` and writes the result, as one transaction. */
async function updateCart(uid: string, change: (cart: Cart | null) => Cart | null): Promise<void> {
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(cartRef(uid));
    const next = change(snapshot.exists() ? (snapshot.data() as Cart) : null);

    if (next && next.items.length > 0) {
      transaction.set(cartRef(uid), next);
    } else if (snapshot.exists()) {
      transaction.delete(cartRef(uid));
    }
  });
}

/**
 * Create / Update: add a dish. A dish from another cook replaces the cart,
 * so ask the customer before calling this (see addDish).
 */
export function addToCart(uid: string, dish: CartDish, qty = 1, note?: string): Promise<void> {
  return updateCart(uid, (cart) => addDish(cart, dish, qty, note));
}

/** Update / Delete: set a quantity. 0 removes the line, and an empty cart is deleted. */
export function setCartItemQuantity(
  uid: string,
  dishId: string,
  qty: number,
  max?: number,
): Promise<void> {
  return updateCart(uid, (cart) => setQuantity(cart, dishId, qty, max));
}

/** Update: the "note to cook" of one line. */
export function setCartItemNote(uid: string, dishId: string, note: string): Promise<void> {
  return updateCart(uid, (cart) => setNote(cart, dishId, note));
}

/** Delete: empty the whole cart (after an order is placed, or "clear cart"). */
export async function clearCart(uid: string): Promise<void> {
  await deleteDoc(cartRef(uid));
}
