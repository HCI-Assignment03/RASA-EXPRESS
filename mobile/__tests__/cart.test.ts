import type { Cart } from '../src/types';
import {
  addDish,
  cartCount,
  cartTotal,
  quantityOf,
  setNote,
  setQuantity,
  type CartDish,
} from '../src/utils/cart';

const rice: CartDish = {
  id: 'rice',
  cookId: 'bhanuka',
  name: 'Chicken Rice & Curry',
  price: 650,
  portionsLeft: 12,
};
const fish: CartDish = {
  id: 'fish',
  cookId: 'bhanuka',
  name: 'Fish Ambul Thiyal Meal',
  price: 750,
  portionsLeft: 8,
};
const hopper: CartDish = {
  id: 'hopper',
  cookId: 'nimali',
  name: 'Egg Hoppers (3)',
  price: 450,
  portionsLeft: 15,
};

describe('addDish', () => {
  it('creates a cart with the first dish', () => {
    const cart = addDish(null, rice);
    expect(cart).toEqual({
      cookId: 'bhanuka',
      items: [{ dishId: 'rice', name: rice.name, price: 650, qty: 1, note: '' }],
    });
  });

  it('adds a second dish from the same cook', () => {
    const cart = addDish(addDish(null, rice), fish);
    expect(cart.items.map((item) => item.dishId)).toEqual(['rice', 'fish']);
  });

  it('raises the quantity when the dish is already in the cart and keeps its note', () => {
    const withNote = addDish(null, rice, 1, 'Less spicy');
    const cart = addDish(withNote, rice, 2);
    expect(quantityOf(cart, 'rice')).toBe(3);
    expect(cart.items[0].note).toBe('Less spicy');
  });

  it('starts a new cart when the dish is from another cook', () => {
    const cart = addDish(addDish(null, rice), hopper);
    expect(cart.cookId).toBe('nimali');
    expect(cart.items.map((item) => item.dishId)).toEqual(['hopper']);
  });

  it('never goes above the portions left', () => {
    const lastTwo: CartDish = { ...rice, portionsLeft: 2 };
    const cart = addDish(addDish(null, lastTwo, 2), lastTwo, 1);
    expect(quantityOf(cart, 'rice')).toBe(2);
  });

  it('adds nothing when there are no portions left', () => {
    const soldOut: CartDish = { ...rice, portionsLeft: 0 };
    expect(addDish(null, soldOut).items).toEqual([]);
  });
});

describe('setQuantity', () => {
  const cart: Cart = addDish(addDish(null, rice, 2), fish);

  it('sets an exact quantity', () => {
    expect(quantityOf(setQuantity(cart, 'rice', 5), 'rice')).toBe(5);
  });

  it('caps the quantity at max', () => {
    expect(quantityOf(setQuantity(cart, 'rice', 99, 12), 'rice')).toBe(12);
  });

  it('removes the line at 0 and keeps the others', () => {
    const next = setQuantity(cart, 'rice', 0);
    expect(next?.items.map((item) => item.dishId)).toEqual(['fish']);
  });

  it('returns null when the last line is removed', () => {
    expect(setQuantity(addDish(null, rice), 'rice', 0)).toBeNull();
    expect(setQuantity(null, 'rice', 1)).toBeNull();
  });
});

describe('setNote', () => {
  it('changes only the chosen line', () => {
    const cart = addDish(addDish(null, rice), fish);
    const next = setNote(cart, 'fish', 'No onions');
    expect(next?.items.map((item) => item.note)).toEqual(['', 'No onions']);
  });
});

describe('totals', () => {
  it('counts dishes and adds up the price', () => {
    const cart = addDish(addDish(null, rice, 2), fish);
    expect(cartCount(cart)).toBe(3);
    expect(cartTotal(cart)).toBe(2 * 650 + 750);
  });

  it('is zero for an empty cart', () => {
    expect(cartCount(null)).toBe(0);
    expect(cartTotal(null)).toBe(0);
    expect(quantityOf(null, 'rice')).toBe(0);
  });
});
