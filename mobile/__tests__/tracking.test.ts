import type { OrderStatus } from '../src/types';
import {
  PROGRESS_STEPS,
  canCancel,
  canChat,
  canReview,
  customerStatus,
  etaText,
  isActive,
  progressIndex,
} from '../src/utils/tracking';

const ALL_STATUSES: OrderStatus[] = [
  'placed',
  'accepted',
  'preparing',
  'ready',
  'picked_up',
  'delivered',
  'declined',
  'cancelled',
];

describe('progressIndex', () => {
  it('moves from Placed to Delivered', () => {
    expect(progressIndex('placed')).toBe(0);
    expect(progressIndex('accepted')).toBe(1);
    expect(progressIndex('preparing')).toBe(2);
    expect(progressIndex('ready')).toBe(2);
    expect(progressIndex('picked_up')).toBe(3);
    expect(progressIndex('delivered')).toBe(4);
    expect(PROGRESS_STEPS[progressIndex('delivered')]).toBe('Delivered');
  });

  it('has no progress for declined and cancelled orders', () => {
    expect(progressIndex('declined')).toBe(-1);
    expect(progressIndex('cancelled')).toBe(-1);
  });
});

describe('customerStatus', () => {
  it('has words for every status', () => {
    for (const status of ALL_STATUSES) {
      expect(customerStatus(status, false).length).toBeGreaterThan(0);
    }
  });

  it('tells a ready order apart before and after a rider accepts', () => {
    expect(customerStatus('ready', false)).toBe('Food is ready, finding a rider');
    expect(customerStatus('ready', true)).toBe('Your rider is picking up the food');
  });
});

describe('what the customer can do', () => {
  it('can cancel only while the order is placed', () => {
    expect(canCancel('placed')).toBe(true);
    for (const status of ALL_STATUSES.filter((s) => s !== 'placed')) {
      expect(canCancel(status)).toBe(false);
    }
  });

  it('can chat only while a rider has the order', () => {
    expect(canChat({ status: 'ready', riderId: 'r1' })).toBe(true);
    expect(canChat({ status: 'picked_up', riderId: 'r1' })).toBe(true);
    expect(canChat({ status: 'ready', riderId: null })).toBe(false);
    expect(canChat({ status: 'delivered', riderId: 'r1' })).toBe(false);
    expect(canChat({ status: 'placed', riderId: null })).toBe(false);
  });

  it('can review only a delivered order', () => {
    expect(canReview('delivered')).toBe(true);
    expect(canReview('picked_up')).toBe(false);
    expect(canReview('cancelled')).toBe(false);
  });
});

describe('isActive', () => {
  it('is true while the order is still going somewhere', () => {
    for (const status of ['placed', 'accepted', 'preparing', 'ready', 'picked_up'] as const) {
      expect(isActive(status)).toBe(true);
    }
  });

  it('is false once it is delivered, declined or cancelled', () => {
    for (const status of ['delivered', 'declined', 'cancelled'] as const) {
      expect(isActive(status)).toBe(false);
    }
  });
});

describe('etaText', () => {
  const cook = { etaMin: 30, etaMax: 40 };
  const placedAt = (date: Date) => ({ toDate: () => date });
  const order = (
    status: OrderStatus,
    schedule: { when: 'asap' | 'today' | 'tomorrow'; time: string },
    date = new Date(2026, 9, 8, 15, 0),
  ) => ({ status, schedule, createdAt: placedAt(date) });

  it('adds the cook usual range to the order time for an ASAP order', () => {
    expect(etaText(order('preparing', { when: 'asap', time: '' }), cook)).toBe(
      'Arrives about 3:30 PM to 3:40 PM',
    );
  });

  it('writes midnight and noon as 12', () => {
    const late = new Date(2026, 9, 8, 23, 50);
    expect(etaText(order('placed', { when: 'asap', time: '' }, late), cook)).toBe(
      'Arrives about 12:20 AM to 12:30 AM',
    );
    const morning = new Date(2026, 9, 8, 11, 40);
    expect(etaText(order('placed', { when: 'asap', time: '' }, morning), cook)).toBe(
      'Arrives about 12:10 PM to 12:20 PM',
    );
  });

  it('shows the chosen slot for a pre-order', () => {
    expect(etaText(order('accepted', { when: 'tomorrow', time: '12:30 PM' }), cook)).toBe(
      'Scheduled for Tomorrow at 12:30 PM',
    );
    expect(etaText(order('accepted', { when: 'today', time: '6:00 PM' }), cook)).toBe(
      'Scheduled for Today at 6:00 PM',
    );
  });

  it('is empty once the order is over', () => {
    for (const status of ['delivered', 'declined', 'cancelled'] as const) {
      expect(etaText(order(status, { when: 'asap', time: '' }), cook)).toBeNull();
    }
  });

  it('is empty for an ASAP order when the cook is unknown', () => {
    expect(etaText(order('placed', { when: 'asap', time: '' }), null)).toBeNull();
  });
});
