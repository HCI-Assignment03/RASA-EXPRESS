import { useAuth } from '@/context/AuthContext';
import { notifyFollowers } from '@/services/alert-prefs';
import { createDish, deleteDish, updateDish } from '@/services/dishes';
import type { Dish } from '@/types';
import type { DishInput } from '@/utils/dish-form';
import { cameBackOnSale, newDishChange, type MenuChange } from '@/utils/menu-alerts';

import { useDishes } from './use-dishes';

/**
 * S3: the signed-in cook's own dishes, live, with the actions of the menu manager.
 * Portions and the sold-out switch are kept together: 0 portions means sold out, and switching a
 * dish back on needs at least one portion.
 * Customers who switched on alerts for this cook (C8) hear about new dishes and dishes back on sale.
 */
export function useMenu() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;
  const menu = useDishes(uid);

  // A failed alert must not make a saved menu change look like a failure.
  const alertFollowers = (change: MenuChange | null, dishName: string) => {
    if (uid && change) notifyFollowers(uid, change, dishName).catch(() => undefined);
  };

  /** Saves a stock change and sends the "back on the menu" alert when the dish was sold out. */
  const changeStock = async (
    dishId: string,
    patch: Pick<Partial<Dish>, 'available' | 'portionsLeft'>,
  ) => {
    const before = menu.dishes.find((dish) => dish.id === dishId);
    await updateDish(dishId, patch);
    if (before && cameBackOnSale(before, { ...before, ...patch })) {
      alertFollowers('back', before.name);
    }
  };

  return {
    ...menu,
    add: async (input: DishInput) => {
      if (!uid) return;
      await createDish(uid, input);
      alertFollowers(newDishChange(input), input.name);
    },
    edit: (dishId: string, input: DishInput) => updateDish(dishId, input),
    /** Sold out today / back on sale. Switching on with no portions left is the caller's to prevent. */
    setAvailable: (dishId: string, available: boolean) => changeStock(dishId, { available }),
    /**
     * Setting 0 portions also marks the dish sold out. `restock` puts a dish that had run out
     * back on sale when portions are added again.
     */
    setPortions: (dishId: string, portionsLeft: number, restock = false) =>
      changeStock(
        dishId,
        portionsLeft <= 0
          ? { portionsLeft: 0, available: false }
          : restock
            ? { portionsLeft, available: true }
            : { portionsLeft },
      ),
    remove: (dishId: string) => deleteDish(dishId),
  };
}
