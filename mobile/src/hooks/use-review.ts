import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { deleteReview, saveReview, subscribeToReview } from '@/services/reviews';
import type { Order, Review, WithId } from '@/types';
import type { ReviewInput } from '@/utils/reviews';

/**
 * C7: the review of one order, live. review is null until the customer rates the order.
 * save() creates the review the first time and edits it after that. remove() deletes it.
 */
export function useReview(orderId: string) {
  const { user } = useAuth();
  const uid = user?.uid;
  const [review, setReview] = useState<WithId<Review> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToReview(
      orderId,
      (next) => {
        setReview(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load your review. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [orderId, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return {
    review,
    loading,
    error,
    reload,
    save: async (order: WithId<Order>, input: ReviewInput) => {
      if (uid) await saveReview(uid, order, input);
    },
    remove: async () => {
      if (review) await deleteReview(review);
    },
  };
}
