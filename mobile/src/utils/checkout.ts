import type { Cook, OrderSchedule, PaymentMethod } from '@/types';

// Rules of the C5 checkout form, as pure functions so they can be unit tested.
// ASAP is always allowed. A same-day pre-order must be placed before the cook's cut-off time.
// Tomorrow is allowed when the cook accepts pre-orders.

/** Half-hour delivery slots offered for a pre-order, from 11:00 AM to 8:00 PM. */
export const TIME_SLOTS: string[] = Array.from({ length: 19 }, (_, index) => {
  const minutes = 11 * 60 + index * 30;
  const hours24 = Math.floor(minutes / 60);
  const hours12 = hours24 > 12 ? hours24 - 12 : hours24;
  const suffix = hours24 >= 12 ? 'PM' : 'AM';
  return `${hours12}:${minutes % 60 === 0 ? '00' : '30'} ${suffix}`;
});

/** True while it is before the cut-off ("18:00") on the given moment's day. */
export function isBeforeCutoff(cutoffTime: string, now: Date): boolean {
  const [hours, minutes] = cutoffTime.split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;
  return now.getHours() * 60 + now.getMinutes() < hours * 60 + minutes;
}

export type ScheduleOption = {
  when: OrderSchedule['when'];
  label: string;
  enabled: boolean;
  /** Why it is switched off, shown under the option. */
  reason?: string;
};

/** The three delivery choices for this cook right now, with the ones that are not possible switched off. */
export function scheduleOptions(
  cook: Pick<Cook, 'acceptsPreorder' | 'cutoffTime'>,
  now: Date,
): ScheduleOption[] {
  const todayOpen = cook.acceptsPreorder && isBeforeCutoff(cook.cutoffTime, now);
  return [
    { when: 'asap', label: 'As soon as possible', enabled: true },
    {
      when: 'today',
      label: 'Later today',
      enabled: todayOpen,
      reason: !cook.acceptsPreorder
        ? 'This cook does not take pre-orders'
        : todayOpen
          ? undefined
          : `Same-day pre-orders closed at ${cook.cutoffTime}`,
    },
    {
      when: 'tomorrow',
      label: 'Tomorrow',
      enabled: cook.acceptsPreorder,
      reason: cook.acceptsPreorder ? undefined : 'This cook does not take pre-orders',
    },
  ];
}

export type CheckoutForm = {
  address: string;
  landmark: string;
  schedule: OrderSchedule;
  paymentMethod: PaymentMethod;
};

export type CheckoutErrors = Partial<Record<'address' | 'schedule', string>>;

/** Checks the checkout form. An empty result means the order can be placed. */
export function validateCheckout(
  form: CheckoutForm,
  cook: Pick<Cook, 'acceptsPreorder' | 'cutoffTime'>,
  now: Date,
): CheckoutErrors {
  const errors: CheckoutErrors = {};

  if (form.address.trim().length < 5) {
    errors.address = 'Enter the street address, for example "12 Lighthouse Street".';
  }

  const chosen = scheduleOptions(cook, now).find((option) => option.when === form.schedule.when);
  if (!chosen?.enabled) {
    errors.schedule = chosen?.reason ?? 'Choose when you want the food.';
  } else if (form.schedule.when !== 'asap' && !TIME_SLOTS.includes(form.schedule.time)) {
    errors.schedule = 'Pick a delivery time.';
  }

  return errors;
}

export type PaymentOption = {
  method: PaymentMethod;
  label: string;
  hint: string;
  icon: 'cash-outline' | 'card-outline' | 'business-outline' | 'wallet-outline';
};

/**
 * The payment methods of C5 (FR05). Only cash is real money: the others are simulated
 * (deviation D01), and the cook confirms them on S2 or S4.
 */
export const PAYMENT_OPTIONS: PaymentOption[] = [
  {
    method: 'cash',
    label: 'Cash on delivery',
    hint: 'Pay the rider when the food arrives',
    icon: 'cash-outline',
  },
  {
    method: 'card',
    label: 'Card',
    hint: 'The cook confirms your card payment',
    icon: 'card-outline',
  },
  {
    method: 'bank',
    label: 'Bank transfer',
    hint: 'The cook confirms when it arrives',
    icon: 'business-outline',
  },
  {
    method: 'wallet',
    label: 'Mobile wallet',
    hint: 'The cook confirms your wallet payment',
    icon: 'wallet-outline',
  },
];
