import {
  NO_FILTERS,
  filterCooks,
  suggestRelaxations,
  type DiscoverFilters,
} from '../src/features/customer/discover';
import type { Cook, Dish, WithId } from '../src/types';

function cook(id: string, overrides: Partial<Cook>): WithId<Cook> {
  return {
    id,
    displayName: id,
    bio: '',
    area: 'Galle Fort',
    verified: true,
    rating: 4.5,
    reviewCount: 10,
    hygieneScore: 4.5,
    acceptsPreorder: false,
    cutoffTime: '18:00',
    tags: [],
    etaMin: 30,
    etaMax: 40,
    distanceKm: 1,
    ...overrides,
  };
}

function dish(cookId: string, name: string): WithId<Dish> {
  return {
    id: `${cookId}-${name}`,
    cookId,
    name,
    price: 500,
    ingredients: [],
    allergens: [],
    nutrition: { kcal: 0, protein: 0, carbs: 0, fat: 0 },
    available: true,
    portionsLeft: 5,
    photoUrl: '',
  };
}

const bhanuka = cook('bhanuka', {
  displayName: "Bhanuka's Kitchen",
  rating: 4.8,
  acceptsPreorder: true,
  tags: ['Rice & Curry'],
});
const nimali = cook('nimali', { displayName: "Nimali's Hoppers", rating: 4.7, tags: ['Hoppers'] });
const sunethra = cook('sunethra', {
  displayName: "Sunethra's Short Eats",
  rating: 4.6,
  acceptsPreorder: true,
  verified: false,
});
const cooks = [sunethra, nimali, bhanuka];
const dishes = [dish('bhanuka', 'Fish Ambul Thiyal Meal'), dish('nimali', 'Egg Hoppers')];

const filters = (overrides: Partial<DiscoverFilters>): DiscoverFilters => ({
  ...NO_FILTERS,
  ...overrides,
});

describe('filterCooks', () => {
  it('lists every cook, best rated first, when nothing is selected', () => {
    expect(filterCooks(cooks, dishes, NO_FILTERS).map((c) => c.id)).toEqual([
      'bhanuka',
      'nimali',
      'sunethra',
    ]);
  });

  it('keeps only verified cooks', () => {
    const ids = filterCooks(cooks, dishes, filters({ verifiedOnly: true })).map((c) => c.id);
    expect(ids).not.toContain('sunethra');
  });

  it('keeps cooks rated 4.7 or more, 4.7 included', () => {
    const ids = filterCooks(cooks, dishes, filters({ topRated: true })).map((c) => c.id);
    expect(ids).toEqual(['bhanuka', 'nimali']);
  });

  it('keeps cooks that take pre-orders', () => {
    const ids = filterCooks(cooks, dishes, filters({ preorder: true })).map((c) => c.id);
    expect(ids).toEqual(['bhanuka', 'sunethra']);
  });

  it('combines filters (verified, top rated and pre-order finds one cook)', () => {
    const all = filters({ verifiedOnly: true, topRated: true, preorder: true });
    expect(filterCooks(cooks, dishes, all).map((c) => c.id)).toEqual(['bhanuka']);
  });

  it('searches names, tags and dish names, ignoring case', () => {
    expect(filterCooks(cooks, dishes, filters({ query: 'HOPPERS' })).map((c) => c.id)).toEqual([
      'nimali',
    ]);
    expect(filterCooks(cooks, dishes, filters({ query: 'ambul' })).map((c) => c.id)).toEqual([
      'bhanuka',
    ]);
    // Every word must match somewhere, in any order.
    expect(filterCooks(cooks, dishes, filters({ query: 'curry rice' })).map((c) => c.id)).toEqual([
      'bhanuka',
    ]);
    expect(filterCooks(cooks, dishes, filters({ query: 'zzz' }))).toEqual([]);
  });
});

describe('suggestRelaxations', () => {
  it('lists each filter whose removal brings cooks back, with the count', () => {
    const tooStrict = filters({ verifiedOnly: true, preorder: true, query: 'hoppers' });
    expect(filterCooks(cooks, dishes, tooStrict)).toHaveLength(0);

    // Without the search text: Bhanuka. Without Pre-order: Nimali. Without Verified: nobody.
    expect(suggestRelaxations(cooks, dishes, tooStrict)).toEqual([
      { key: 'query', label: 'the search text', count: 1 },
      { key: 'preorder', label: 'Pre-order', count: 1 },
    ]);
  });

  it('puts the filter that frees the most cooks first', () => {
    expect(suggestRelaxations(cooks, dishes, filters({ query: 'zzz' }))).toEqual([
      { key: 'query', label: 'the search text', count: 3 },
    ]);
  });

  it('suggests nothing when there are no cooks or no active filter', () => {
    expect(suggestRelaxations([], [], filters({ verifiedOnly: true }))).toEqual([]);
    expect(suggestRelaxations(cooks, dishes, NO_FILTERS)).toEqual([]);
  });
});
