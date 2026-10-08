import { useEffect, useState } from 'react';

import { subscribeToDish, subscribeToDishes } from '@/services/dishes';
import type { Dish, WithId } from '@/types';

/**
 * Live dishes of one cook, or of every cook when cookId is null.
 * Call reload() after an error to try again.
 */
export function useDishes(cookId: string | null) {
  const [dishes, setDishes] = useState<WithId<Dish>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToDishes(
      cookId,
      (next) => {
        setDishes(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load the menu. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [cookId, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return { dishes, loading, error, reload };
}

/** Live data for one dish. dish is null while loading or when the id does not exist. */
export function useDish(dishId: string) {
  const [dish, setDish] = useState<WithId<Dish> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToDish(
      dishId,
      (next) => {
        setDish(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load this dish. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [dishId, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return { dish, loading, error, reload };
}
