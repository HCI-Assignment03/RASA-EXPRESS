import { collection, onSnapshot, query, where, type Unsubscribe } from 'firebase/firestore';

import type { Review, WithId } from '@/types';

import { db } from './firebase';

/**
 * Read, live: the reviews of one cook, newest first (C3 Reviews tab).
 * Sorted here rather than in the query, which would need a composite index.
 */
export function subscribeToCookReviews(
  cookId: string,
  onData: (reviews: WithId<Review>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'reviews'), where('cookId', '==', cookId)),
    (snapshot) => {
      const reviews = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Review) }));
      // A review that was just written has no server time yet, so treat it as the newest.
      const time = (review: Review) => review.createdAt?.toMillis() ?? Number.MAX_SAFE_INTEGER;
      onData(reviews.sort((a, b) => time(b) - time(a)));
    },
    onError,
  );
}
