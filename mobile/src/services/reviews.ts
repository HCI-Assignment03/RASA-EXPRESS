import {
  collection,
  doc,
  onSnapshot,
  query,
  runTransaction,
  serverTimestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore';

import type { Cook, Order, Review, WithId } from '@/types';
import {
  overallScore,
  ratingAfterAdd,
  ratingAfterEdit,
  ratingAfterRemove,
  type ReviewInput,
} from '@/utils/reviews';

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

/** Read, live: this customer's own reviews (C7), so the Orders tab can show which orders are rated. */
export function subscribeToMyReviews(
  customerId: string,
  onData: (reviews: WithId<Review>[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'reviews'), where('customerId', '==', customerId)),
    (snapshot) => onData(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Review) }))),
    onError,
  );
}

// One review per order: the review document has the same id as the order.
const reviewRef = (orderId: string) => doc(db, 'reviews', orderId);

/** Read, live: the review of one order, or null when it has not been rated (C7). */
export function subscribeToReview(
  orderId: string,
  onData: (review: WithId<Review> | null) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    reviewRef(orderId),
    (snapshot) =>
      onData(
        snapshot.exists()
          ? { id: snapshot.id, ...(snapshot.data({ serverTimestamps: 'estimate' }) as Review) }
          : null,
      ),
    onError,
  );
}

/**
 * Create or Update (C7): saves the review of a delivered order. If the order was already rated,
 * the review is edited and keeps its date. The cook's rating is updated in the same transaction.
 */
export async function saveReview(
  customerId: string,
  order: WithId<Order>,
  input: ReviewInput,
): Promise<void> {
  const cookRef = doc(db, 'cooks', order.cookId);

  await runTransaction(db, async (transaction) => {
    const [existing, cookSnap] = await Promise.all([
      transaction.get(reviewRef(order.id)),
      transaction.get(cookRef),
    ]);

    let cookRating = null;
    if (cookSnap.exists()) {
      const cook = cookSnap.data() as Cook;
      const current = { rating: cook.rating, reviewCount: cook.reviewCount };
      cookRating = existing.exists()
        ? ratingAfterEdit(current, overallScore(existing.data() as Review), overallScore(input))
        : ratingAfterAdd(current, overallScore(input));
    }

    if (existing.exists()) {
      transaction.update(reviewRef(order.id), { ...input });
    } else {
      transaction.set(reviewRef(order.id), {
        orderId: order.id,
        cookId: order.cookId,
        customerId,
        ...input,
        createdAt: serverTimestamp(),
      });
    }
    if (cookRating) transaction.update(cookRef, cookRating);
  });
}

/** Delete (C7): removes the review and takes it out of the cook's rating, in one transaction. */
export async function deleteReview(review: WithId<Review>): Promise<void> {
  const cookRef = doc(db, 'cooks', review.cookId);

  await runTransaction(db, async (transaction) => {
    const [existing, cookSnap] = await Promise.all([
      transaction.get(reviewRef(review.id)),
      transaction.get(cookRef),
    ]);
    if (!existing.exists()) return;

    transaction.delete(reviewRef(review.id));
    if (cookSnap.exists()) {
      const cook = cookSnap.data() as Cook;
      transaction.update(
        cookRef,
        ratingAfterRemove(
          { rating: cook.rating, reviewCount: cook.reviewCount },
          overallScore(existing.data() as Review),
        ),
      );
    }
  });
}
