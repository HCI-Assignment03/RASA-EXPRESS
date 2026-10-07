import { useEffect, useState } from 'react';

import { subscribeToCook, subscribeToCooks } from '@/services/cooks';
import type { Cook, WithId } from '@/types';

const LOAD_ERROR = 'Could not load cooks. Check your connection and try again.';

/** Live list of every cook. Call reload() after an error to try again. */
export function useCooks() {
  const [cooks, setCooks] = useState<WithId<Cook>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToCooks(
      (next) => {
        setCooks(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError(LOAD_ERROR);
        setLoading(false);
      },
    );
  }, [attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return { cooks, loading, error, reload };
}

/** Live data for one cook. cook is null while loading or when the id does not exist. */
export function useCook(cookId: string) {
  const [cook, setCook] = useState<WithId<Cook> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToCook(
      cookId,
      (next) => {
        setCook(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError(LOAD_ERROR);
        setLoading(false);
      },
    );
  }, [cookId, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return { cook, loading, error, reload };
}
