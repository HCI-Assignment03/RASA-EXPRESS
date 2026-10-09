import {
  COMMENT_MAX_LENGTH,
  REVIEW_TAGS,
  overallScore,
  ratingAfterAdd,
  ratingAfterEdit,
  ratingAfterRemove,
  validateReview,
  type ReviewInput,
} from '../src/utils/reviews';

const valid: ReviewInput = {
  food: 5,
  hygiene: 4,
  delivery: 3,
  comment: 'Tasted like home.',
  tags: ['Fresh & tasty'],
};

describe('overallScore', () => {
  it('is the average of the three ratings', () => {
    expect(overallScore({ food: 5, hygiene: 4, delivery: 3 })).toBe(4);
    expect(overallScore({ food: 5, hygiene: 5, delivery: 4 })).toBeCloseTo(4.67, 2);
  });
});

describe('validateReview', () => {
  it('accepts a review with all three ratings, with or without a comment', () => {
    expect(validateReview(valid)).toEqual({});
    expect(validateReview({ ...valid, comment: '', tags: [] })).toEqual({});
  });

  it('asks for every rating that is missing', () => {
    const errors = validateReview({ ...valid, food: 0, hygiene: 0, delivery: 0 });
    expect(Object.keys(errors).sort()).toEqual(['delivery', 'food', 'hygiene']);
  });

  it('rejects ratings outside 1 to 5 or with decimals', () => {
    expect(validateReview({ ...valid, food: 6 }).food).toBeDefined();
    expect(validateReview({ ...valid, hygiene: 3.5 }).hygiene).toBeDefined();
    expect(validateReview({ ...valid, delivery: -1 }).delivery).toBeDefined();
  });

  it('limits the comment length', () => {
    const tooLong = 'a'.repeat(COMMENT_MAX_LENGTH + 1);
    expect(validateReview({ ...valid, comment: tooLong }).comment).toBeDefined();
    expect(validateReview({ ...valid, comment: 'a'.repeat(COMMENT_MAX_LENGTH) })).toEqual({});
  });
});

describe('the cook running rating', () => {
  it('adds a review to the average', () => {
    expect(ratingAfterAdd({ rating: 4, reviewCount: 2 }, 5)).toEqual({
      rating: 4.33,
      reviewCount: 3,
    });
  });

  it('starts from nothing for the first review', () => {
    expect(ratingAfterAdd({ rating: 0, reviewCount: 0 }, 4.67)).toEqual({
      rating: 4.67,
      reviewCount: 1,
    });
  });

  it('keeps the history of a cook who already has many reviews', () => {
    const next = ratingAfterAdd({ rating: 4.8, reviewCount: 126 }, 3);
    expect(next.reviewCount).toBe(127);
    expect(next.rating).toBeGreaterThan(4.7);
    expect(next.rating).toBeLessThan(4.8);
  });

  it('changes the average when a review is edited, without changing the count', () => {
    expect(ratingAfterEdit({ rating: 4.5, reviewCount: 2 }, 4, 5)).toEqual({
      rating: 5,
      reviewCount: 2,
    });
    expect(ratingAfterEdit({ rating: 4.5, reviewCount: 2 }, 5, 3)).toEqual({
      rating: 3.5,
      reviewCount: 2,
    });
  });

  it('treats an edit on a cook with no count as a first review', () => {
    expect(ratingAfterEdit({ rating: 0, reviewCount: 0 }, 4, 5)).toEqual({
      rating: 5,
      reviewCount: 1,
    });
  });

  it('takes a review out of the average', () => {
    expect(ratingAfterRemove({ rating: 4.5, reviewCount: 2 }, 4)).toEqual({
      rating: 5,
      reviewCount: 1,
    });
  });

  it('goes back to 0 when the last review is removed', () => {
    expect(ratingAfterRemove({ rating: 5, reviewCount: 1 }, 5)).toEqual({
      rating: 0,
      reviewCount: 0,
    });
  });

  it('adding then removing the same review gives the original average', () => {
    const start = { rating: 4.6, reviewCount: 10 };
    const added = ratingAfterAdd(start, 3);
    const removed = ratingAfterRemove(added, 3);
    expect(removed.reviewCount).toBe(10);
    expect(removed.rating).toBeCloseTo(4.6, 1);
  });
});

describe('REVIEW_TAGS', () => {
  it('includes the tags used by the sample reviews', () => {
    for (const tag of ['Fresh & tasty', 'Clean packaging', 'Good portion', 'Late delivery']) {
      expect(REVIEW_TAGS).toContain(tag);
    }
  });
});
