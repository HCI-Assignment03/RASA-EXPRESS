import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { subscribeToRiderOrders } from '@/services/trips';
import type { Order, WithId } from '@/types';
import { riderStats } from '@/utils/rider-stats';

import { useCooks } from './use-cooks';

/** The signed-in rider's deliveries today, earnings today and deliveries in total, live. */
export function useRiderStats() {
  const { user } = useAuth();
  const uid = user?.uid;
  const { cooks } = useCooks();
  const [orders, setOrders] = useState<WithId<Order>[]>([]);

  useEffect(() => {
    if (!uid) return;
    return subscribeToRiderOrders(uid, setOrders, () => setOrders([]));
  }, [uid]);

  const distanceOf = (cookId: string) => cooks.find((cook) => cook.id === cookId)?.distanceKm ?? 0;
  return riderStats(orders, distanceOf, new Date());
}
