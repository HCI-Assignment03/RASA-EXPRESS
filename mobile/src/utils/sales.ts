import type { Payment } from '@/types';

// Sales maths for S4. Only payments that were actually received count. Pure functions with the
// current time passed in, so the unit tests do not depend on today's date.

type SalePayment = Pick<Payment, 'amount' | 'status'> & { createdAt: { toDate: () => Date } };

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

/** The money received on one calendar day. */
export function dayTotal(payments: SalePayment[], day: Date): number {
  return payments
    .filter((payment) => payment.status === 'received' && sameDay(payment.createdAt.toDate(), day))
    .reduce((total, payment) => total + payment.amount, 0);
}

export type DayBar = {
  /** "Today" for today, otherwise "Mon", "Tue" and so on. */
  label: string;
  total: number;
};

/** The last seven days for the chart, oldest first, ending with today. */
export function lastSevenDays(payments: SalePayment[], now: Date): DayBar[] {
  return Array.from({ length: 7 }, (_, index) => {
    const daysAgo = 6 - index;
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo);
    return {
      label: daysAgo === 0 ? 'Today' : WEEKDAYS[day.getDay()],
      total: dayTotal(payments, day),
    };
  });
}

/** How tall each bar is, from 0 to 1, with the best day at 1. All zero when there were no sales. */
export function barHeights(bars: DayBar[]): number[] {
  const best = Math.max(...bars.map((bar) => bar.total));
  return bars.map((bar) => (best > 0 ? bar.total / best : 0));
}

/** True for a walk-in sale the cook typed in, as opposed to a payment for an order. */
export function isManualSale(payment: Pick<Payment, 'orderId'>): boolean {
  return payment.orderId === null;
}

/** A sale amount from text: a whole number of rupees above 0, or null. */
export function parseSaleAmount(text: string): number | null {
  const trimmed = text.trim();
  if (!/^\d+$/.test(trimmed)) return null;
  const amount = Number(trimmed);
  return amount > 0 ? amount : null;
}

/** A short amount for the chart bars: 0 is blank, 850 stays 850, 1600 becomes "1.6k". */
export function compactAmount(amount: number): string {
  if (amount <= 0) return '';
  if (amount < 1000) return String(amount);
  return `${(amount / 1000).toFixed(1).replace(/\.0$/, '')}k`;
}
