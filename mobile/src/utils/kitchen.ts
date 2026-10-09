import type { Cook } from '@/types';

import { splitList } from './dish-form';

// The "Kitchen details" form on the cook's More tab. A new cook starts with an empty cook page
// (see createUserProfile), and this is where they fill it in. Pure functions, covered by unit tests.

/** What a cook can change about their own page. Rating, hygiene score and "verified" are not theirs to set. */
export type KitchenInput = Pick<
  Cook,
  'displayName' | 'bio' | 'area' | 'tags' | 'acceptsPreorder' | 'cutoffTime' | 'etaMin' | 'etaMax'
>;

/** The form fields. Tags are comma separated, numbers are text until they are checked. */
export type KitchenFormValues = {
  displayName: string;
  area: string;
  bio: string;
  tags: string;
  acceptsPreorder: boolean;
  cutoffTime: string;
  etaMin: string;
  etaMax: string;
};

export type KitchenFormErrors = Partial<Record<keyof KitchenFormValues, string>>;

export const BIO_MAX_LENGTH = 300;
export const MAX_TAGS = 5;

/** Fills the form from the cook's page. */
export function kitchenToForm(cook: Cook): KitchenFormValues {
  return {
    displayName: cook.displayName,
    area: cook.area,
    bio: cook.bio,
    tags: cook.tags.join(', '),
    acceptsPreorder: cook.acceptsPreorder,
    cutoffTime: cook.cutoffTime,
    etaMin: String(cook.etaMin),
    etaMax: String(cook.etaMax),
  };
}

/** "18:00" yes, "6 PM", "24:00" and "18:5" no. */
export function isClockTime(text: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(text.trim());
}

function minutes(text: string): number | null {
  return /^\d+$/.test(text.trim()) ? Number(text.trim()) : null;
}

/**
 * Checks the form. When it is fine, `input` holds the fields to save; otherwise `errors` says what
 * to fix, field by field.
 */
export function validateKitchenForm(values: KitchenFormValues): {
  errors: KitchenFormErrors;
  input: KitchenInput | null;
} {
  const errors: KitchenFormErrors = {};

  const displayName = values.displayName.trim();
  if (displayName.length < 2) errors.displayName = 'Enter the name customers will see.';

  const area = values.area.trim();
  if (area.length < 2) errors.area = 'Enter your area, for example Galle Fort.';

  const bio = values.bio.trim();
  if (bio.length > BIO_MAX_LENGTH) errors.bio = `Keep it under ${BIO_MAX_LENGTH} characters.`;

  const tags = splitList(values.tags);
  if (tags.length > MAX_TAGS) errors.tags = `Use at most ${MAX_TAGS} tags.`;

  // The cut-off only matters for pre-orders, so it is only checked when they are switched on.
  const cutoffTime = values.cutoffTime.trim();
  if (values.acceptsPreorder && !isClockTime(cutoffTime)) {
    errors.cutoffTime = 'Use the 24-hour clock, for example 18:00.';
  }

  const etaMin = minutes(values.etaMin);
  const etaMax = minutes(values.etaMax);
  if (etaMin === null || etaMin < 5 || etaMin > 180) {
    errors.etaMin = 'Enter minutes between 5 and 180.';
  }
  if (etaMax === null || etaMax < 5 || etaMax > 180) {
    errors.etaMax = 'Enter minutes between 5 and 180.';
  } else if (etaMin !== null && etaMax < etaMin) {
    errors.etaMax = 'The longest time cannot be shorter than the shortest.';
  }

  if (Object.keys(errors).length > 0 || etaMin === null || etaMax === null) {
    return { errors, input: null };
  }

  return {
    errors,
    input: {
      displayName,
      area,
      bio,
      tags,
      acceptsPreorder: values.acceptsPreorder,
      // With pre-orders off the time is not checked, so a blank or wrong one falls back to 18:00.
      cutoffTime: isClockTime(cutoffTime) ? cutoffTime : '18:00',
      etaMin,
      etaMax,
    },
  };
}
