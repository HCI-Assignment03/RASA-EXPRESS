import type { PaymentStatus } from '../src/types';
import {
  barHeights,
  compactAmount,
  dayTotal,
  isManualSale,
  lastSevenDays,
  parseSaleAmount,
} from '../src/utils/sales';

// Thursday 8 October 2026, mid-afternoon.
const now = new Date(2026, 9, 8, 15, 0);

const payment = (amount: number, date: Date, status: PaymentStatus = 'received') => ({
  amount,
  status,
  createdAt: { toDate: () => date },
});

describe('dayTotal', () => {
  it('adds up the payments received on that day', () => {
    const payments = [
      payment(650, new Date(2026, 9, 8, 9, 0)),
      payment(500, new Date(2026, 9, 8, 14, 30)),
      payment(900, new Date(2026, 9, 7, 12, 0)),
    ];
    expect(dayTotal(payments, now)).toBe(1150);
  });

  it('counts from the first minute of the day and not the last minute of the day before', () => {
    const payments = [
      payment(100, new Date(2026, 9, 8, 0, 1)),
      payment(200, new Date(2026, 9, 7, 23, 59)),
    ];
    expect(dayTotal(payments, now)).toBe(100);
  });

  it('ignores payments that were not received', () => {
    expect(dayTotal([payment(800, now, 'pending')], now)).toBe(0);
  });

  it('is zero with no payments', () => {
    expect(dayTotal([], now)).toBe(0);
  });
});

describe('lastSevenDays', () => {
  const bars = lastSevenDays(
    [
      payment(700, new Date(2026, 9, 2, 10, 0)),
      payment(1500, new Date(2026, 9, 7, 10, 0)),
      payment(650, new Date(2026, 9, 8, 10, 0)),
      payment(9999, new Date(2026, 9, 1, 10, 0)),
    ],
    now,
  );

  it('gives seven bars ending with today', () => {
    expect(bars.map((bar) => bar.label)).toEqual([
      'Fri',
      'Sat',
      'Sun',
      'Mon',
      'Tue',
      'Wed',
      'Today',
    ]);
  });

  it('puts each payment on its own day and leaves out older days', () => {
    expect(bars.map((bar) => bar.total)).toEqual([700, 0, 0, 0, 0, 1500, 650]);
  });

  it('works across a month boundary', () => {
    const early = lastSevenDays([payment(300, new Date(2026, 8, 30, 12, 0))], new Date(2026, 9, 2));
    expect(early.map((bar) => bar.label)[0]).toBe('Sat');
    expect(early[4].total).toBe(300);
  });
});

describe('barHeights', () => {
  it('makes the best day full height and scales the rest', () => {
    const heights = barHeights([
      { label: 'a', total: 500 },
      { label: 'b', total: 1000 },
      { label: 'c', total: 0 },
    ]);
    expect(heights).toEqual([0.5, 1, 0]);
  });

  it('is all zero when nothing was sold', () => {
    expect(barHeights([{ label: 'a', total: 0 }])).toEqual([0]);
  });
});

describe('isManualSale', () => {
  it('is true only for a payment without an order', () => {
    expect(isManualSale({ orderId: null })).toBe(true);
    expect(isManualSale({ orderId: 'order-1' })).toBe(false);
  });
});

describe('parseSaleAmount', () => {
  it('reads a whole number of rupees', () => {
    expect(parseSaleAmount('500')).toBe(500);
    expect(parseSaleAmount(' 1200 ')).toBe(1200);
  });

  it('rejects empty, zero, decimal, negative and non-numeric text', () => {
    for (const text of ['', '0', '12.5', '-5', 'abc', '5 00']) {
      expect(parseSaleAmount(text)).toBeNull();
    }
  });
});

describe('compactAmount', () => {
  it('writes short amounts for the chart bars', () => {
    expect(compactAmount(0)).toBe('');
    expect(compactAmount(850)).toBe('850');
    expect(compactAmount(1000)).toBe('1k');
    expect(compactAmount(1640)).toBe('1.6k');
    expect(compactAmount(1660)).toBe('1.7k');
    expect(compactAmount(12500)).toBe('12.5k');
  });
});
