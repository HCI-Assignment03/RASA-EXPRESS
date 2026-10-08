import type { Review } from '@/types';

// Rules for C7 (rate and review), as pure functions covered by unit tests.

/** Quick tags the customer can tap. Good ones first, then the things that went wrong. */
export const REVIEW_TAGS = [
  'Fresh & tasty',
  'Good portion',
  'Clean packaging',
  'Hot on arrival',
  'Great value',
  'Late delivery',
  'Cold food',
  'Small portion',
] as const;

export const COMMENT_MAX_LENGTH = 300;

export type ReviewInput = Pick<Review, 'food' | 'hygiene' | 'delivery' | 'comment' | 'tags'>;

export type ReviewErrors = Partial<Record<'food' | 'hygiene' | 'delivery' | 'comment', string>>;

/** The one score of a review: the average of the three star ratings. */
export function overallScore(review: Pick<Review, 'food' | 'hygiene' | 'delivery'>): number {
  return (review.food + review.hygiene + review.delivery) / 3;
}

/** All three ratings must be chosen (1 to 5 stars). The comment is optional and limited in length. */
export function validateReview(input: ReviewInput): ReviewErrors {
  const errors: ReviewErrors = {};
  const isStars = (value: number) => Number.isInteger(value) && value >= 1 && value <= 5;

  if (!isStars(input.food)) errors.food = 'Tap the stars to rate the food.';
  if (!isStars(input.hygiene)) errors.hygiene = 'Tap the stars to rate the hygiene.';
  if (!isStars(input.delivery)) errors.delivery = 'Tap the stars to rate the delivery.';
  if (input.comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `Keep the comment under ${COMMENT_MAX_LENGTH} characters.`;
  }
  return errors;
}

export type CookRating = { rating: number; reviewCount: number };

const round2 = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number) => Math.min(5, Math.max(0, value));

// The cook keeps a running average (rating) and a count, so the sample cooks keep their history.
// These three functions update that average when a review is added, edited or deleted.

/** A new review with `score` is added. */
export function ratingAfterAdd(current: CookRating, score: number): CookRating {
  const reviewCount = current.reviewCount + 1;
  const total = current.rating * current.reviewCount + score;
  return { rating: round2(clamp(total / reviewCount)), reviewCount };
}

/** A review changes from `oldScore` to `newScore`. The count stays the same. */
export function ratingAfterEdit(
  current: CookRating,
  oldScore: number,
  newScore: number,
): CookRating {
  if (current.reviewCount <= 0) return ratingAfterAdd({ rating: 0, reviewCount: 0 }, newScore);
  const total = current.rating * current.reviewCount - oldScore + newScore;
  return { rating: round2(clamp(total / current.reviewCount)), reviewCount: current.reviewCount };
}

/** A review with `oldScore` is removed. With none left, the rating goes back to 0. */
export function ratingAfterRemove(current: CookRating, oldScore: number): CookRating {
  const reviewCount = Math.max(current.reviewCount - 1, 0);
  if (reviewCount === 0) return { rating: 0, reviewCount: 0 };
  const total = current.rating * current.reviewCount - oldScore;
  return { rating: round2(clamp(total / reviewCount)), reviewCount };
}
