import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { advanceOrder, declineOrder, subscribeToCookOrders } from '@/services/cook-orders';
import type { Order, WithId } from '@/types';
import { countByTab, ordersInTab, type OrderTab } from '@/utils/cook-orders';

/**
 * S1 and S2: the signed-in cook's orders, live, newest first.
 * counts says how many orders are in each tab, inTab(tab) gives the orders of one tab.
 */
export function useCookOrders() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [orders, setOrders] = useState<WithId<Order>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToCookOrders(
      uid,
      (next) => {
        setOrders(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load your orders. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [uid, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return {
    orders,
    counts: countByTab(orders),
    inTab: (tab: OrderTab) => ordersInTab(orders, tab),
    loading,
    error,
    reload,
    advance: advanceOrder,
    decline: declineOrder,
  };
}
