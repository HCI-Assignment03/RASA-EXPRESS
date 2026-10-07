import { useEffect, useState } from 'react';

import { subscribeToCookReviews } from '@/services/reviews';
import type { Review, WithId } from '@/types';

/** Live reviews of one cook, newest first. */
export function useCookReviews(cookId: string) {
  const [reviews, setReviews] = useState<WithId<Review>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    return subscribeToCookReviews(
      cookId,
      (next) => {
        setReviews(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load reviews.');
        setLoading(false);
      },
    );
  }, [cookId]);

  return { reviews, loading, error };
}
