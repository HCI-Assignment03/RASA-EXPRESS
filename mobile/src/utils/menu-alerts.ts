import type { Dish } from '@/types';

import { isSoldOut } from './dish';

// Saved-cook alerts (C8): what happens on the menu manager (S3) that customers hear about.

/** "added": a new dish that can be ordered. "back": a sold-out dish is on sale again. */
export type MenuChange = 'added' | 'back';

type Stock = Pick<Dish, 'available' | 'portionsLeft'>;

/** True when a dish that could not be ordered can be ordered again. */
export function cameBackOnSale(before: Stock, after: Stock): boolean {
  return isSoldOut(before) && !isSoldOut(after);
}

/** Which alert a new dish deserves: none while it cannot be ordered yet. */
export function newDishChange(dish: Stock): MenuChange | null {
  return isSoldOut(dish) ? null : 'added';
}

/** The alert text a customer reads on C8. */
export function menuAlertText(change: MenuChange, cookName: string, dishName: string): string {
  return change === 'added'
    ? `${cookName} added ${dishName} to the menu.`
    : `${dishName} from ${cookName} is back on the menu.`;
}
