import {
  collection,
  doc,
  runTransaction,
  serverTimestamp,
  type Transaction,
} from 'firebase/firestore';

import type { Cart, Dish, Order, OrderSchedule, PaymentMethod, WithId } from '@/types';
import type { CheckoutForm } from '@/utils/checkout';

import { OrderChangedError } from './cook-orders';
import { db } from './firebase';

/** Thrown by placeOrder when a dish ran out or was removed while the customer was checking out. */
export class StockError extends Error {}

export type NewOrderInput = {
  cart: Cart;
  address: string;
  landmark: string;
  schedule: OrderSchedule;
  paymentMethod: PaymentMethod;
};

/** Turns the checkout form and the cart into the input of placeOrder. */
export function toOrderInput(cart: Cart, form: CheckoutForm): NewOrderInput {
  return {
    cart,
    address: form.address.trim(),
    landmark: form.landmark.trim(),
    schedule: form.schedule,
    paymentMethod: form.paymentMethod,
  };
}

/** Checks every dish of the cart still exists and has enough portions. Reads only. */
async function checkStock(transaction: Transaction, cart: Cart): Promise<void> {
  const snapshots = await Promise.all(
    cart.items.map((item) => transaction.get(doc(db, 'dishes', item.dishId))),
  );

  const problems = snapshots.flatMap((snapshot, index) => {
    const item = cart.items[index];
    if (!snapshot.exists()) return [`${item.name} is no longer on the menu`];
    const dish = snapshot.data() as Dish;
    if (!dish.available || dish.portionsLeft <= 0) return [`${item.name} is sold out`];
    if (item.qty > dish.portionsLeft) {
      return [`Only ${dish.portionsLeft} of ${item.name} left`];
    }
    return [];
  });

  if (problems.length > 0) throw new StockError(problems.join('. ') + '.');
}

/**
 * Create (C5): place the order. In one transaction it checks the dishes are still available,
 * writes the order with status "placed" and no rider, and empties the cart. Returns the order id.
 * Payment is simulated (deviation D01): every order starts with payment "pending", and the cook
 * confirms it on S2 or S4.
 */
export async function placeOrder(customerId: string, input: NewOrderInput): Promise<string> {
  const orderRef = doc(collection(db, 'orders'));

  await runTransaction(db, async (transaction) => {
    await checkStock(transaction, input.cart);

    const order = {
      customerId,
      cookId: input.cart.cookId,
      riderId: null,
      items: input.cart.items,
      total: input.cart.items.reduce((sum, item) => sum + item.price * item.qty, 0),
      schedule: input.schedule,
      address: input.address,
      landmark: input.landmark,
      paymentMethod: input.paymentMethod,
      paymentStatus: 'pending',
      status: 'placed',
      declineReason: '',
      riderLocation: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    transaction.set(orderRef, order);
    transaction.delete(doc(db, 'carts', customerId));
  });

  return orderRef.id;
}

/**
 * Update (C6): the customer cancels. Only possible while the cook has not accepted the order.
 * No portions need putting back, because they are only taken off the menu at accept.
 */
export async function cancelOrder(order: WithId<Order>): Promise<void> {
  const ref = doc(db, 'orders', order.id);

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(ref);
    if ((snapshot.data() as Order | undefined)?.status !== 'placed') {
      throw new OrderChangedError();
    }
    transaction.update(ref, { status: 'cancelled', updatedAt: serverTimestamp() });
  });
}
