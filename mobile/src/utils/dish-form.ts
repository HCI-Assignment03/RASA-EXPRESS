import type { Dish, WithId } from '@/types';

// The add / edit dish form of S3. Everything is typed as text in the form, so this file turns the
// text into a Dish (or says what is wrong with it). Pure functions, covered by unit tests.

/** What the cook can set on a dish. The cook and the photo are filled in by the service. */
export type DishInput = Omit<Dish, 'cookId' | 'photoUrl'>;

/** The form fields, all as text. ingredients and allergens are comma separated. */
export type DishFormValues = {
  name: string;
  price: string;
  portionsLeft: string;
  ingredients: string;
  allergens: string;
  kcal: string;
  protein: string;
  carbs: string;
  fat: string;
};

export type DishFormErrors = Partial<Record<keyof DishFormValues, string>>;

export const EMPTY_DISH_FORM: DishFormValues = {
  name: '',
  price: '',
  portionsLeft: '',
  ingredients: '',
  allergens: '',
  kcal: '',
  protein: '',
  carbs: '',
  fat: '',
};

/** Fills the form from an existing dish (editing). */
export function dishToForm(dish: WithId<Dish>): DishFormValues {
  return {
    name: dish.name,
    price: String(dish.price),
    portionsLeft: String(dish.portionsLeft),
    ingredients: dish.ingredients.join(', '),
    allergens: dish.allergens.join(', '),
    kcal: String(dish.nutrition.kcal),
    protein: String(dish.nutrition.protein),
    carbs: String(dish.nutrition.carbs),
    fat: String(dish.nutrition.fat),
  };
}

/** "rice, dhal ,, chicken" becomes ["rice", "dhal", "chicken"]. */
export function splitList(text: string): string[] {
  return text
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/** A whole number from text, or null when it is not one ("12" yes, "12.5", "abc" and "" no). */
function wholeNumber(text: string): number | null {
  return /^\d+$/.test(text.trim()) ? Number(text.trim()) : null;
}

/** A blank nutrition field means 0, so the cook does not have to fill in all four. */
function nutritionValue(text: string): number | null {
  return text.trim() === '' ? 0 : wholeNumber(text);
}

const NUTRITION_FIELDS = ['kcal', 'protein', 'carbs', 'fat'] as const;

/**
 * Checks the form. When it is fine, `input` holds the dish to save; otherwise `errors` says what
 * to fix, field by field.
 */
export function validateDishForm(values: DishFormValues): {
  errors: DishFormErrors;
  input: DishInput | null;
} {
  const errors: DishFormErrors = {};

  const name = values.name.trim();
  if (name.length < 2) errors.name = 'Enter the dish name.';

  const price = wholeNumber(values.price);
  if (price === null || price < 1) errors.price = 'Enter the price in rupees, for example 650.';

  const portions = wholeNumber(values.portionsLeft);
  if (portions === null) errors.portionsLeft = 'Enter how many portions you can make today.';

  const ingredients = splitList(values.ingredients);
  if (ingredients.length === 0)
    errors.ingredients = 'List at least one ingredient, separated by commas.';

  const nutrition = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const field of NUTRITION_FIELDS) {
    const value = nutritionValue(values[field]);
    if (value === null) errors[field] = 'Use a whole number, or leave it blank.';
    else nutrition[field] = value;
  }

  if (Object.keys(errors).length > 0 || price === null || portions === null) {
    return { errors, input: null };
  }

  return {
    errors,
    input: {
      name,
      price,
      ingredients,
      allergens: splitList(values.allergens),
      nutrition,
      portionsLeft: portions,
      // A new dish with portions is on sale; with 0 portions it starts as sold out.
      available: portions > 0,
    },
  };
}
