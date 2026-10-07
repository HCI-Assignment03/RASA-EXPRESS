import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  addToCart,
  clearCart,
  setCartItemNote,
  setCartItemQuantity,
  subscribeToCart,
} from '@/services/cart';
import type { Cart } from '@/types';
import { cartCount, cartTotal, quantityOf, type CartDish } from '@/utils/cart';

/** The signed-in customer's cart, live, with the actions every cart screen needs. */
export function useCart() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [cart, setCart] = useState<Cart | null>(null);

  useEffect(() => {
    if (!uid) return;
    return subscribeToCart(uid, setCart, () => setCart(null));
  }, [uid]);

  return {
    /** null when the cart is empty. */
    cart,
    /** Number of dishes, counting quantities. */
    count: cartCount(cart),
    total: cartTotal(cart),
    quantityOf: (dishId: string) => quantityOf(cart, dishId),
    add: async (dish: CartDish, qty = 1, note?: string) => {
      if (uid) await addToCart(uid, dish, qty, note);
    },
    setQuantity: async (dishId: string, qty: number, max?: number) => {
      if (uid) await setCartItemQuantity(uid, dishId, qty, max);
    },
    setNote: async (dishId: string, note: string) => {
      if (uid) await setCartItemNote(uid, dishId, note);
    },
    clear: async () => {
      if (uid) await clearCart(uid);
    },
  };
}
