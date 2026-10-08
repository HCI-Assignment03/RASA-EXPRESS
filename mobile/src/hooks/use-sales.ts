import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';
import { markPaymentReceived } from '@/services/cook-orders';
import { createManualSale, deleteManualSale, subscribeToPayments } from '@/services/payments';
import type { Payment, WithId } from '@/types';
import { canMarkPaid } from '@/utils/cook-orders';
import { dayTotal, lastSevenDays } from '@/utils/sales';

import { useCookOrders } from './use-cook-orders';

/**
 * S4: the signed-in cook's money, live. Gives today's total, the seven-day bars, the payments
 * received, and the orders whose payment is still pending (with the action to confirm one).
 */
export function useSales() {
  const { user } = useAuth();
  const uid = user?.uid;
  const orders = useCookOrders();
  const [payments, setPayments] = useState<WithId<Payment>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!uid) return;
    return subscribeToPayments(
      uid,
      (next) => {
        setPayments(next);
        setError('');
        setLoading(false);
      },
      () => {
        setError('Could not load your sales. Check your connection and try again.');
        setLoading(false);
      },
    );
  }, [uid, attempt]);

  const reload = () => {
    setLoading(true);
    setError('');
    setAttempt((count) => count + 1);
    orders.reload();
  };

  const now = new Date();

  return {
    payments,
    todayTotal: dayTotal(payments, now),
    week: lastSevenDays(payments, now),
    /** Orders still waiting for their payment to be confirmed. */
    pendingOrders: orders.orders.filter(canMarkPaid),
    loading: loading || orders.loading,
    error: error || orders.error,
    reload,
    addCashSale: async (amount: number, note: string) => {
      if (uid) await createManualSale(uid, amount, note);
    },
    removeSale: deleteManualSale,
    confirmPayment: markPaymentReceived,
  };
}
