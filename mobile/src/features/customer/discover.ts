import type { Cook, Dish, WithId } from '@/types';

/** "Top rated 4.7+" chip on C2. */
export const TOP_RATED_MIN = 4.7;

export type DiscoverFilters = {
  query: string;
  verifiedOnly: boolean;
  topRated: boolean;
  preorder: boolean;
};

export const NO_FILTERS: DiscoverFilters = {
  query: '',
  verifiedOnly: false,
  topRated: false,
  preorder: false,
};

type FilterKey = keyof DiscoverFilters;

function matchesQuery(cook: WithId<Cook>, dishNames: string[], query: string): boolean {
  const text = [cook.displayName, cook.area, ...cook.tags, ...dishNames].join(' ').toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => text.includes(word));
}

/**
 * C2 Read: the cooks that pass every active filter, best rated first.
 * The search text matches a cook's name, area, tags and dish names, so "ambul" finds the cook who sells it.
 */
export function filterCooks(
  cooks: WithId<Cook>[],
  dishes: WithId<Dish>[],
  filters: DiscoverFilters,
): WithId<Cook>[] {
  const dishNamesByCook = new Map<string, string[]>();
  for (const dish of dishes) {
    dishNamesByCook.set(dish.cookId, [...(dishNamesByCook.get(dish.cookId) ?? []), dish.name]);
  }

  return cooks
    .filter(
      (cook) =>
        (!filters.verifiedOnly || cook.verified) &&
        (!filters.topRated || cook.rating >= TOP_RATED_MIN) &&
        (!filters.preorder || cook.acceptsPreorder) &&
        matchesQuery(cook, dishNamesByCook.get(cook.id) ?? [], filters.query),
    )
    .sort((a, b) => b.rating - a.rating);
}

const FILTER_LABELS: Record<FilterKey, string> = {
  query: 'the search text',
  verifiedOnly: 'Verified only',
  topRated: 'Top rated 4.7+',
  preorder: 'Pre-order',
};

export type Relaxation = {
  key: FilterKey;
  /** What to remove, for example "Pre-order". */
  label: string;
  /** How many cooks would show without it. */
  count: number;
};

/**
 * For an empty result: which single active filter, if removed, would bring cooks back,
 * best first (Milestone 02 issue U09).
 */
export function suggestRelaxations(
  cooks: WithId<Cook>[],
  dishes: WithId<Dish>[],
  filters: DiscoverFilters,
): Relaxation[] {
  const active = (Object.keys(FILTER_LABELS) as FilterKey[]).filter((key) =>
    key === 'query' ? filters.query.trim() !== '' : filters[key],
  );

  return active
    .map((key) => {
      const relaxed: DiscoverFilters = { ...filters, [key]: NO_FILTERS[key] };
      return { key, label: FILTER_LABELS[key], count: filterCooks(cooks, dishes, relaxed).length };
    })
    .filter((suggestion) => suggestion.count > 0)
    .sort((a, b) => b.count - a.count);
}
