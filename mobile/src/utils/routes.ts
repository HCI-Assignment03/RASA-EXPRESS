import type { Role } from '@/types';

/** First screen of each role after sign-in. */
export const ROLE_HOME = {
  customer: '/customer/home',
  cook: '/cook/orders',
  rider: '/rider/requests',
} as const satisfies Record<Role, string>;
