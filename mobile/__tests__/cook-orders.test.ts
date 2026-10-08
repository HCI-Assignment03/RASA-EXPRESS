import type { Order, OrderStatus, WithId } from '../src/types';
import {
  STATUS_LABEL,
  canDecline,
  countByTab,
  itemsSummary,
  newestFirst,
  nextStep,
  orderNumber,
  ordersInTab,
  paymentLabel,
  tabOf,
} from '../src/utils/cook-orders';

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

describe('tabOf', () => {
  it('puts every status in a tab', () => {
    expect(tabOf('placed')).toBe('new');
    expect(tabOf('accepted')).toBe('preparing');
    expect(tabOf('preparing')).toBe('preparing');
    expect(tabOf('ready')).toBe('ready');
    expect(tabOf('picked_up')).toBe('ready');
    expect(tabOf('delivered')).toBe('past');
    expect(tabOf('declined')).toBe('past');
    expect(tabOf('cancelled')).toBe('past');
  });
});

describe('countByTab and ordersInTab', () => {
  const orders = [
    { status: 'placed' },
    { status: 'placed' },
    { status: 'accepted' },
    { status: 'preparing' },
    { status: 'declined' },
  ] as Pick<Order, 'status'>[];

  it('counts the orders in each tab', () => {
    expect(countByTab(orders)).toEqual({ new: 2, preparing: 2, ready: 0, past: 1 });
  });

  it('returns only the orders of one tab', () => {
    expect(ordersInTab(orders, 'preparing')).toHaveLength(2);
    expect(ordersInTab(orders, 'ready')).toEqual([]);
  });
});

describe('nextStep', () => {
  it('walks placed, accepted, preparing, ready', () => {
    expect(nextStep('placed')).toEqual({ label: 'Accept order', to: 'accepted' });
    expect(nextStep('accepted')).toEqual({ label: 'Start preparing', to: 'preparing' });
    expect(nextStep('preparing')).toEqual({ label: 'Mark as ready', to: 'ready' });
  });

  it('gives the cook nothing to do once the food is ready or the order is over', () => {
    for (const status of ['ready', 'picked_up', 'delivered', 'declined', 'cancelled'] as const) {
      expect(nextStep(status)).toBeNull();
    }
  });
});

describe('canDecline', () => {
  it('allows declining only before the cooking starts', () => {
    expect(canDecline('placed')).toBe(true);
    expect(canDecline('accepted')).toBe(true);
    expect(canDecline('preparing')).toBe(false);
    expect(canDecline('ready')).toBe(false);
    expect(canDecline('delivered')).toBe(false);
  });
});

describe('labels', () => {
  it('has a label for every status', () => {
    for (const status of ALL_STATUSES) {
      expect(STATUS_LABEL[status].length).toBeGreaterThan(0);
    }
  });

  it('writes the order number from the end of the id', () => {
    expect(orderNumber('abcdefgh12k3f')).toBe('#12K3F');
  });

  it('summarises the items', () => {
    const order = {
      items: [
        { dishId: 'a', name: 'Chicken Rice & Curry', price: 650, qty: 2, note: '' },
        { dishId: 'b', name: 'Watalappan', price: 300, qty: 1, note: '' },
      ],
    };
    expect(itemsSummary(order)).toBe('2 × Chicken Rice & Curry, 1 × Watalappan');
  });

  it('says whether the payment is still to be collected', () => {
    expect(paymentLabel({ paymentMethod: 'cash', paymentStatus: 'pending' })).toBe(
      'Cash on delivery, to collect',
    );
    expect(paymentLabel({ paymentMethod: 'card', paymentStatus: 'received' })).toBe(
      'Card, received',
    );
  });
});

describe('newestFirst', () => {
  const at = (id: string, millis: number) =>
    ({ id, createdAt: { toMillis: () => millis } }) as unknown as WithId<Order>;

  it('puts the latest order first without changing the original list', () => {
    const list = [at('old', 1000), at('new', 3000), at('mid', 2000)];
    expect(newestFirst(list).map((order) => order.id)).toEqual(['new', 'mid', 'old']);
    expect(list.map((order) => order.id)).toEqual(['old', 'new', 'mid']);
  });
});
