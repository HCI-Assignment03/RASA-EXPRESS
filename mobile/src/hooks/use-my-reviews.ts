import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { subscribeToMyReviews } from '@/services/reviews';
import type { Review, WithId } from '@/types';

/** The signed-in customer's reviews, live. byOrder(orderId) tells whether (and how) an order was rated. */
export function useMyReviews() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [reviews, setReviews] = useState<WithId<Review>[]>([]);

  useEffect(() => {
    if (!uid) return;
    return subscribeToMyReviews(uid, setReviews, () => setReviews([]));
  }, [uid]);

  return {
    reviews,
    byOrder: (orderId: string) => reviews.find((review) => review.orderId === orderId) ?? null,
  };
}
