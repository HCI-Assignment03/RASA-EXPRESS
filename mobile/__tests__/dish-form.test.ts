import type { Dish, WithId } from '../src/types';
import {
  EMPTY_DISH_FORM,
  dishToForm,
  splitList,
  validateDishForm,
  type DishFormValues,
} from '../src/utils/dish-form';

const valid: DishFormValues = {
  ...EMPTY_DISH_FORM,
  name: 'Kottu Roti',
  price: '700',
  portionsLeft: '6',
  ingredients: 'Roti, egg, vegetables',
  allergens: 'Egg',
};

describe('splitList', () => {
  it('splits on commas, trims and drops empty parts', () => {
    expect(splitList('rice, dhal ,, chicken ')).toEqual(['rice', 'dhal', 'chicken']);
    expect(splitList('')).toEqual([]);
  });
});

describe('validateDishForm', () => {
  it('turns a filled form into a dish, with blank nutrition as 0', () => {
    const { errors, input } = validateDishForm(valid);
    expect(errors).toEqual({});
    expect(input).toEqual({
      name: 'Kottu Roti',
      price: 700,
      portionsLeft: 6,
      ingredients: ['Roti', 'egg', 'vegetables'],
      allergens: ['Egg'],
      nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      available: true,
    });
  });

  it('reads the nutrition fields when they are filled in', () => {
    const { input } = validateDishForm({
      ...valid,
      kcal: '720',
      protein: '34',
      carbs: '88',
      fat: '22',
    });
    expect(input?.nutrition).toEqual({ kcal: 720, protein: 34, carbs: 88, fat: 22 });
  });

  it('reports every required field of an empty form and saves nothing', () => {
    const { errors, input } = validateDishForm(EMPTY_DISH_FORM);
    expect(input).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(['ingredients', 'name', 'portionsLeft', 'price']);
  });

  it('rejects a price that is zero, decimal or not a number', () => {
    for (const price of ['0', '12.5', 'abc', '-5']) {
      expect(validateDishForm({ ...valid, price }).errors.price).toBeDefined();
    }
  });

  it('rejects portions that are not a whole number', () => {
    expect(validateDishForm({ ...valid, portionsLeft: '2.5' }).errors.portionsLeft).toBeDefined();
    expect(validateDishForm({ ...valid, portionsLeft: '' }).errors.portionsLeft).toBeDefined();
  });

  it('rejects a name that is too short', () => {
    expect(validateDishForm({ ...valid, name: ' a ' }).errors.name).toBeDefined();
  });

  it('rejects nutrition that is not a whole number', () => {
    const { errors, input } = validateDishForm({ ...valid, fat: 'lots' });
    expect(errors.fat).toBeDefined();
    expect(input).toBeNull();
  });

  it('starts a dish with 0 portions as sold out', () => {
    const { input } = validateDishForm({ ...valid, portionsLeft: '0' });
    expect(input?.portionsLeft).toBe(0);
    expect(input?.available).toBe(false);
  });
});

describe('dishToForm', () => {
  const dish: WithId<Dish> = {
    id: 'd1',
    cookId: 'c1',
    name: 'Fish Ambul Thiyal Meal',
    price: 750,
    ingredients: ['Samba rice', 'Tuna'],
    allergens: ['Fish'],
    nutrition: { kcal: 680, protein: 38, carbs: 80, fat: 18 },
    available: true,
    portionsLeft: 8,
    photoUrl: '',
  };

  it('fills the form so that saving it again changes nothing', () => {
    const { input } = validateDishForm(dishToForm(dish));
    expect(input).toEqual({
      name: dish.name,
      price: dish.price,
      portionsLeft: dish.portionsLeft,
      ingredients: dish.ingredients,
      allergens: dish.allergens,
      nutrition: dish.nutrition,
      available: true,
    });
  });
});
