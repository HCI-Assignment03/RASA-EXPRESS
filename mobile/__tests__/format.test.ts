import { formatDate, formatMobile, formatPrice } from '../src/utils/format';

describe('formatMobile', () => {
  it('groups a stored mobile number', () => {
    expect(formatMobile('0771234567')).toBe('+94 77 123 4567');
  });

  it('leaves anything else alone', () => {
    expect(formatMobile('')).toBe('');
    expect(formatMobile('12345')).toBe('12345');
  });
});

describe('formatPrice', () => {
  it('writes rupees with thousands separators', () => {
    expect(formatPrice(650)).toBe('Rs. 650');
    expect(formatPrice(1550)).toBe('Rs. 1,550');
  });
});

describe('formatDate', () => {
  it('writes day, short month and year', () => {
    expect(formatDate(new Date(2026, 9, 7))).toBe('7 Oct 2026');
    expect(formatDate(new Date(2026, 0, 31))).toBe('31 Jan 2026');
  });
});
