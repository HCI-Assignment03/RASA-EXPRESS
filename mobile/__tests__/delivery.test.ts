import { formatDistance, riderFee } from '../src/utils/delivery';

describe('riderFee', () => {
  it('is the base fee when the distance is zero', () => {
    expect(riderFee(0)).toBe(100);
  });

  it('adds Rs. 40 per km and rounds to the nearest Rs. 10', () => {
    expect(riderFee(1.2)).toBe(150);
    expect(riderFee(2.5)).toBe(200);
    expect(riderFee(0.45)).toBe(120);
    expect(riderFee(3.1)).toBe(220);
  });
});

describe('formatDistance', () => {
  it('writes kilometres with one decimal', () => {
    expect(formatDistance(1.2)).toBe('1.2 km');
    expect(formatDistance(1)).toBe('1.0 km');
  });

  it('writes metres under one kilometre, rounded to 10 m', () => {
    expect(formatDistance(0.45)).toBe('450 m');
    expect(formatDistance(0.04)).toBe('40 m');
  });
});
