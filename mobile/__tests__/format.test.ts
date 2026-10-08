import { formatDate, formatMobile, formatPrice, formatTimeAgo } from '../src/utils/format';

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

describe('formatTimeAgo', () => {
  const now = new Date(2026, 9, 8, 12, 0, 0);
  const ago = (minutes: number) => new Date(now.getTime() - minutes * 60000);

  it('says "Just now" for less than a minute', () => {
    expect(formatTimeAgo(ago(0), now)).toBe('Just now');
  });

  it('counts minutes and hours', () => {
    expect(formatTimeAgo(ago(5), now)).toBe('5 min ago');
    expect(formatTimeAgo(ago(59), now)).toBe('59 min ago');
    expect(formatTimeAgo(ago(60), now)).toBe('1 h ago');
    expect(formatTimeAgo(ago(23 * 60), now)).toBe('23 h ago');
  });

  it('says "Yesterday" and then counts days', () => {
    expect(formatTimeAgo(ago(24 * 60), now)).toBe('Yesterday');
    expect(formatTimeAgo(ago(3 * 24 * 60), now)).toBe('3 days ago');
  });

  it('falls back to the date after a week', () => {
    expect(formatTimeAgo(ago(7 * 24 * 60), now)).toBe('1 Oct 2026');
  });
});
