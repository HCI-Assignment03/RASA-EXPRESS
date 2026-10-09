import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { subscribeToMyOrders } from '@/services/my-orders';
import type { Order, WithId } from '@/types';
import { isActive } from '@/utils/tracking';

/** C6: the signed-in customer's orders, live. `active` are still going, `past` are finished. */
export function useMyOrders() {
  const { user } = useAuth();
  const uid = user?.uid;
  const [orders, setOrders] = useState<WithId<Order>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToMyOrders(
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
    active: orders.filter((order) => isActive(order.status)),
    past: orders.filter((order) => !isActive(order.status)),
    loading,
    error,
    reload,
  };
}
