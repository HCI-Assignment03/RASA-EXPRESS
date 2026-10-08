import { useEffect, useState } from 'react';

import { subscribeToOrder } from '@/services/cook-orders';
import type { Order, WithId } from '@/types';

/** Live data for one order. order is null while loading or when the id does not exist. */
export function useOrder(orderId: string) {
  const [order, setOrder] = useState<WithId<Order> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToOrder(
      orderId,
      (next) => {
        setOrder(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load this order. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [orderId, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return { order, loading, error, reload };
}
