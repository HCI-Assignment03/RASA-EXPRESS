import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import {
  acceptRequest,
  dismissRequest,
  restoreDismissed,
  subscribeToDismissals,
  subscribeToOpenRequests,
} from '@/services/rider-requests';
import type { DismissedRequest, Order, WithId } from '@/types';

/**
 * R1: the delivery requests this rider can take, live.
 * `requests` leaves out the ones the rider dismissed; `dismissedCount` says how many are hidden.
 */
export function useOpenRequests() {
  const { user, profile } = useAuth();
  const uid = user?.uid;
  const [orders, setOrders] = useState<WithId<Order>[]>([]);
  const [dismissals, setDismissals] = useState<WithId<DismissedRequest>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    return subscribeToOpenRequests(
      (next) => {
        setOrders(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load delivery requests. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [attempt]);

  useEffect(() => {
    if (!uid) return;
    return subscribeToDismissals(uid, setDismissals, () => setDismissals([]));
  }, [uid]);

  const dismissedIds = new Set(dismissals.map((dismissal) => dismissal.orderId));
  const requests = orders.filter((order) => !dismissedIds.has(order.id));
  const hidden = orders.filter((order) => dismissedIds.has(order.id));

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
  };

  return {
    requests,
    dismissedCount: hidden.length,
    loading,
    error,
    reload,
    accept: async (orderId: string) => {
      if (uid) await acceptRequest(orderId, { uid, name: profile?.name ?? 'Your rider' });
    },
    dismiss: async (orderId: string) => {
      if (uid) await dismissRequest(uid, orderId);
    },
    restoreAll: async () => {
      if (uid)
        await restoreDismissed(
          uid,
          hidden.map((order) => order.id),
        );
    },
  };
}
