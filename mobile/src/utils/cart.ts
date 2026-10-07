import type { Cart, CartItem, Dish, WithId } from '@/types';

// Pure cart logic, shared by C3 (menu), C4 (dish details) and C5 (checkout).
// The functions never touch Firestore: services/cart.ts runs them inside a transaction.
// A cart holds the dishes of one cook only.

/** The part of a dish the cart needs. */
export type CartDish = Pick<WithId<Dish>, 'id' | 'cookId' | 'name' | 'price' | 'portionsLeft'>;

export function cartCount(cart: Cart | null): number {
  return cart ? cart.items.reduce((count, item) => count + item.qty, 0) : 0;
}

export function cartTotal(cart: Cart | null): number {
  return cart ? cart.items.reduce((total, item) => total + item.price * item.qty, 0) : 0;
}

export function quantityOf(cart: Cart | null, dishId: string): number {
  return cart?.items.find((item) => item.dishId === dishId)?.qty ?? 0;
}

/**
 * Create / Update: the cart after adding `qty` of a dish. The quantity never goes above the
 * portions the cook has left. A dish from a different cook starts a new cart, so ask the
 * customer first (Milestone 02 issue U01). `note` is the "note to cook"; leave it out to keep the old one.
 */
export function addDish(cart: Cart | null, dish: CartDish, qty = 1, note?: string): Cart {
  const kept = cart && cart.cookId === dish.cookId ? cart.items : [];
  const existing = kept.find((item) => item.dishId === dish.id);

  const nextQty = Math.min((existing?.qty ?? 0) + qty, dish.portionsLeft);
  if (nextQty <= 0) return { cookId: dish.cookId, items: kept };

  const line: CartItem = {
    dishId: dish.id,
    name: dish.name,
    price: dish.price,
    qty: nextQty,
    note: note ?? existing?.note ?? '',
  };
  const items = existing
    ? kept.map((item) => (item.dishId === dish.id ? line : item))
    : [...kept, line];
  return { cookId: dish.cookId, items };
}

/**
 * Update / Delete: set a line to an exact quantity (capped at `max` when given).
 * A quantity of 0 removes the line. Returns null when the cart becomes empty.
 */
export function setQuantity(
  cart: Cart | null,
  dishId: string,
  qty: number,
  max = Number.POSITIVE_INFINITY,
): Cart | null {
  if (!cart) return null;
  const capped = Math.min(qty, max);
  const items =
    capped <= 0
      ? cart.items.filter((item) => item.dishId !== dishId)
      : cart.items.map((item) => (item.dishId === dishId ? { ...item, qty: capped } : item));
  return items.length > 0 ? { ...cart, items } : null;
}

/** Update: the "note to cook" of one line. */
export function setNote(cart: Cart | null, dishId: string, note: string): Cart | null {
  if (!cart) return null;
  return {
    ...cart,
    items: cart.items.map((item) => (item.dishId === dishId ? { ...item, note } : item)),
  };
}
