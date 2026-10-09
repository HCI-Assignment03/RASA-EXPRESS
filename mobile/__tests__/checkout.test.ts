import {
  PAYMENT_OPTIONS,
  TIME_SLOTS,
  isBeforeCutoff,
  scheduleOptions,
  validateCheckout,
  type CheckoutForm,
} from '../src/utils/checkout';

const takesPreorders = { acceptsPreorder: true, cutoffTime: '18:00' };
const noPreorders = { acceptsPreorder: false, cutoffTime: '18:00' };

const morning = new Date(2026, 9, 8, 9, 30);
const evening = new Date(2026, 9, 8, 19, 15);

const asapForm: CheckoutForm = {
  address: '12 Lighthouse Street',
  landmark: '',
  schedule: { when: 'asap', time: '' },
  paymentMethod: 'cash',
};

describe('TIME_SLOTS', () => {
  it('runs in half hours from 11:00 AM to 8:00 PM', () => {
    expect(TIME_SLOTS).toHaveLength(19);
    expect(TIME_SLOTS[0]).toBe('11:00 AM');
    expect(TIME_SLOTS[1]).toBe('11:30 AM');
    expect(TIME_SLOTS[2]).toBe('12:00 PM');
    expect(TIME_SLOTS[3]).toBe('12:30 PM');
    expect(TIME_SLOTS[4]).toBe('1:00 PM');
    expect(TIME_SLOTS[18]).toBe('8:00 PM');
  });
});

describe('isBeforeCutoff', () => {
  it('is true up to the minute before the cut-off and false from the cut-off on', () => {
    expect(isBeforeCutoff('18:00', new Date(2026, 9, 8, 17, 59))).toBe(true);
    expect(isBeforeCutoff('18:00', new Date(2026, 9, 8, 18, 0))).toBe(false);
    expect(isBeforeCutoff('18:00', new Date(2026, 9, 8, 23, 0))).toBe(false);
  });

  it('treats an unreadable cut-off as closed', () => {
    expect(isBeforeCutoff('soon', morning)).toBe(false);
  });
});

describe('scheduleOptions', () => {
  const byWhen = (options: ReturnType<typeof scheduleOptions>) =>
    Object.fromEntries(options.map((option) => [option.when, option]));

  it('offers everything to a cook who takes pre-orders, before the cut-off', () => {
    const options = byWhen(scheduleOptions(takesPreorders, morning));
    expect(options.asap.enabled).toBe(true);
    expect(options.today.enabled).toBe(true);
    expect(options.tomorrow.enabled).toBe(true);
  });

  it('closes later today after the cut-off but keeps tomorrow', () => {
    const options = byWhen(scheduleOptions(takesPreorders, evening));
    expect(options.today.enabled).toBe(false);
    expect(options.today.reason).toBe('Same-day pre-orders closed at 18:00');
    expect(options.tomorrow.enabled).toBe(true);
  });

  it('offers only ASAP when the cook does not take pre-orders', () => {
    const options = byWhen(scheduleOptions(noPreorders, morning));
    expect(options.asap.enabled).toBe(true);
    expect(options.today.enabled).toBe(false);
    expect(options.tomorrow.enabled).toBe(false);
    expect(options.tomorrow.reason).toBe('This cook does not take pre-orders');
  });
});

describe('validateCheckout', () => {
  it('accepts an ASAP order with an address, at any time of day', () => {
    expect(validateCheckout(asapForm, takesPreorders, evening)).toEqual({});
    expect(validateCheckout(asapForm, noPreorders, evening)).toEqual({});
  });

  it('asks for a street address of at least 5 characters', () => {
    expect(
      validateCheckout({ ...asapForm, address: '' }, takesPreorders, morning).address,
    ).toBeDefined();
    expect(
      validateCheckout({ ...asapForm, address: ' 12 ' }, takesPreorders, morning).address,
    ).toBeDefined();
  });

  it('asks for a time on a pre-order', () => {
    const form: CheckoutForm = { ...asapForm, schedule: { when: 'tomorrow', time: '' } };
    expect(validateCheckout(form, takesPreorders, morning).schedule).toBe('Pick a delivery time.');
  });

  it('accepts a pre-order with a valid slot', () => {
    const form: CheckoutForm = { ...asapForm, schedule: { when: 'tomorrow', time: '12:30 PM' } };
    expect(validateCheckout(form, takesPreorders, evening)).toEqual({});
  });

  it('rejects a time that is not one of the slots', () => {
    const form: CheckoutForm = { ...asapForm, schedule: { when: 'tomorrow', time: '3:17 AM' } };
    expect(validateCheckout(form, takesPreorders, morning).schedule).toBeDefined();
  });

  it('rejects a same-day pre-order after the cut-off', () => {
    const form: CheckoutForm = { ...asapForm, schedule: { when: 'today', time: '8:00 PM' } };
    expect(validateCheckout(form, takesPreorders, evening).schedule).toBe(
      'Same-day pre-orders closed at 18:00',
    );
  });

  it('rejects a pre-order for a cook who does not take them', () => {
    const form: CheckoutForm = { ...asapForm, schedule: { when: 'tomorrow', time: '12:00 PM' } };
    expect(validateCheckout(form, noPreorders, morning).schedule).toBe(
      'This cook does not take pre-orders',
    );
  });

  it('reports the address and the schedule together', () => {
    const form: CheckoutForm = { ...asapForm, address: '', schedule: { when: 'today', time: '' } };
    const errors = validateCheckout(form, takesPreorders, morning);
    expect(Object.keys(errors).sort()).toEqual(['address', 'schedule']);
  });
});

describe('PAYMENT_OPTIONS', () => {
  it('offers cash, card, bank transfer and wallet', () => {
    expect(PAYMENT_OPTIONS.map((option) => option.method)).toEqual([
      'cash',
      'card',
      'bank',
      'wallet',
    ]);
  });
});
