import { useAuth } from '@/context/AuthContext';
import { createDish, deleteDish, updateDish } from '@/services/dishes';
import type { DishInput } from '@/utils/dish-form';

import { useDishes } from './use-dishes';

/**
 * S3: the signed-in cook's own dishes, live, with the actions of the menu manager.
 * Portions and the sold-out switch are kept together: 0 portions means sold out, and switching a
 * dish back on needs at least one portion.
 */
export function useMenu() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const menu = useDishes(uid);

  return {
    ...menu,
    add: async (input: DishInput) => {
      if (uid) await createDish(uid, input);
    },
    edit: (dishId: string, input: DishInput) => updateDish(dishId, input),
    /** Sold out today / back on sale. Switching on with no portions left is the caller's to prevent. */
    setAvailable: (dishId: string, available: boolean) => updateDish(dishId, { available }),
    /** Setting 0 portions also marks the dish sold out. */
    setPortions: (dishId: string, portionsLeft: number) =>
      updateDish(
        dishId,
        portionsLeft <= 0 ? { portionsLeft: 0, available: false } : { portionsLeft },
      ),
    remove: (dishId: string) => deleteDish(dishId),
  };
}
