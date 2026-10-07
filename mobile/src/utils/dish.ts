import type { Dish, WithId } from '@/types';

/** A dish cannot be ordered when the cook switched it off or no portions are left. */
export function isSoldOut(dish: Pick<Dish, 'available' | 'portionsLeft'>): boolean {
  return !dish.available || dish.portionsLeft <= 0;
}

/** Dishes that can be ordered first, sold-out ones last, each group A to Z. */
export function sortMenu(dishes: WithId<Dish>[]): WithId<Dish>[] {
  return [...dishes].sort(
    (a, b) => Number(isSoldOut(a)) - Number(isSoldOut(b)) || a.name.localeCompare(b.name),
  );
}
