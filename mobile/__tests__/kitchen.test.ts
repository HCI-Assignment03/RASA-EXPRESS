import type { Cook } from '../src/types';
import {
  BIO_MAX_LENGTH,
  MAX_TAGS,
  isClockTime,
  kitchenToForm,
  validateKitchenForm,
  type KitchenFormValues,
} from '../src/utils/kitchen';

const cook: Cook = {
  displayName: "Amma's Kitchen",
  bio: 'Rice and curry from Galle.',
  area: 'Galle Fort',
  verified: true,
  rating: 4.8,
  reviewCount: 126,
  hygieneScore: 4.9,
  acceptsPreorder: true,
  cutoffTime: '18:00',
  tags: ['Rice & Curry', 'Lunch packets'],
  etaMin: 30,
  etaMax: 40,
  distanceKm: 1.2,
};

const valid: KitchenFormValues = kitchenToForm(cook);

describe('kitchenToForm', () => {
  it('fills the form from the cook page', () => {
    expect(valid).toEqual({
      displayName: "Amma's Kitchen",
      area: 'Galle Fort',
      bio: 'Rice and curry from Galle.',
      tags: 'Rice & Curry, Lunch packets',
      acceptsPreorder: true,
      cutoffTime: '18:00',
      etaMin: '30',
      etaMax: '40',
    });
  });
});

describe('isClockTime', () => {
  it('accepts 24-hour times only', () => {
    expect(isClockTime('18:00')).toBe(true);
    expect(isClockTime('09:30')).toBe(true);
    expect(isClockTime('6 PM')).toBe(false);
    expect(isClockTime('24:00')).toBe(false);
    expect(isClockTime('18:5')).toBe(false);
    expect(isClockTime('')).toBe(false);
  });
});

describe('validateKitchenForm', () => {
  it('turns a valid form into the fields to save, without rating or verified', () => {
    const { errors, input } = validateKitchenForm({
      ...valid,
      tags: ' Rice & Curry ,, Short eats ',
    });
    expect(errors).toEqual({});
    expect(input).toEqual({
      displayName: "Amma's Kitchen",
      area: 'Galle Fort',
      bio: 'Rice and curry from Galle.',
      tags: ['Rice & Curry', 'Short eats'],
      acceptsPreorder: true,
      cutoffTime: '18:00',
      etaMin: 30,
      etaMax: 40,
    });
  });

  it('needs a name and an area', () => {
    const { errors, input } = validateKitchenForm({ ...valid, displayName: ' ', area: '' });
    expect(input).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(['area', 'displayName']);
  });

  it('limits the description and the number of tags', () => {
    const tooManyTags = Array.from({ length: MAX_TAGS + 1 }, (_, i) => `Tag ${i}`).join(', ');
    const { errors } = validateKitchenForm({
      ...valid,
      bio: 'a'.repeat(BIO_MAX_LENGTH + 1),
      tags: tooManyTags,
    });
    expect(errors.bio).toBeDefined();
    expect(errors.tags).toBeDefined();
  });

  it('checks the cut-off time only when pre-orders are on', () => {
    expect(validateKitchenForm({ ...valid, cutoffTime: '6 PM' }).errors.cutoffTime).toBeDefined();

    const off = validateKitchenForm({ ...valid, acceptsPreorder: false, cutoffTime: '6 PM' });
    expect(off.errors).toEqual({});
    expect(off.input?.cutoffTime).toBe('18:00');
  });

  it('needs delivery times in minutes, shortest first', () => {
    expect(validateKitchenForm({ ...valid, etaMin: 'abc' }).errors.etaMin).toBeDefined();
    expect(validateKitchenForm({ ...valid, etaMin: '2' }).errors.etaMin).toBeDefined();
    expect(validateKitchenForm({ ...valid, etaMax: '200' }).errors.etaMax).toBeDefined();
    expect(validateKitchenForm({ ...valid, etaMin: '45', etaMax: '30' }).errors.etaMax).toBe(
      'The longest time cannot be shorter than the shortest.',
    );
  });
});
