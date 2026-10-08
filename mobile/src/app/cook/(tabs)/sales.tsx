import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, spacing } from '@/constants/theme';
import { CashSaleModal } from '@/features/cook/cash-sale-modal';
import { PaymentRow } from '@/features/cook/payment-row';
import { WeekChart } from '@/features/cook/week-chart';
import { useSales } from '@/hooks/use-sales';
import { OrderChangedError } from '@/services/cook-orders';
import type { Order, Payment, WithId } from '@/types';
import { itemsSummary, methodLabel, orderNumber } from '@/utils/cook-orders';
import { formatPrice } from '@/utils/format';

const RECENT_COUNT = 15;

// S4 Sales & payments.
// Create: record a manual cash sale. Read: today's total, 7-day chart, payments received.
// Update: mark a pending payment received. Delete: delete a mistaken manual entry.
export default function SalesScreen() {
  const toast = useToast();
  const sales = useSales();
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const failed = () => toast.show('Could not save the change. Check your connection.', 'error');

  const addSale = async (amount: number, note: string) => {
    setSaving(true);
    try {
      await sales.addCashSale(amount, note);
      toast.show('Cash sale recorded', 'success');
      setAdding(false);
    } catch {
      failed();
    } finally {
      setSaving(false);
    }
  };

  const confirm = async (order: WithId<Order>) => {
    setConfirmingId(order.id);
    try {
      await sales.confirmPayment(order);
      toast.show('Payment recorded', 'success');
    } catch (error) {
      if (error instanceof OrderChangedError) toast.show(error.message, 'info');
      else failed();
    } finally {
      setConfirmingId(null);
    }
  };

  const confirmDelete = (payment: WithId<Payment>) => {
    Alert.alert(
      'Delete this sale?',
      `${formatPrice(payment.amount)}${payment.note ? `, ${payment.note}` : ''} will be removed from your sales.`,
      [
        { text: 'Keep', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            sales
              .removeSale(payment)
              .then(() => toast.show('Sale deleted', 'success'))
              .catch(failed);
          },
        },
      ],
    );
  };

  const weekTotal = sales.week.reduce((sum, bar) => sum + bar.total, 0);

  return (
    <Screen scroll>
      <Text style={styles.title}>Sales</Text>

      {sales.loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {sales.error ? (
        <Message text={sales.error}>
          <Button title="Try again" icon="refresh" onPress={sales.reload} />
        </Message>
      ) : null}

      {!sales.loading && !sales.error ? (
        <>
          <Card style={styles.card}>
            <Text style={styles.muted}>Today</Text>
            <Text style={styles.big}>{formatPrice(sales.todayTotal)}</Text>
            <Text style={styles.muted}>Last 7 days: {formatPrice(weekTotal)}</Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.section}>Last 7 days</Text>
            <WeekChart bars={sales.week} />
          </Card>

          <Button title="Add cash sale" icon="add" onPress={() => setAdding(true)} />

          {sales.pendingOrders.length > 0 ? (
            <View style={styles.list}>
              <Text style={styles.section}>Waiting for payment</Text>
              {sales.pendingOrders.map((order) => (
                <Card key={order.id} style={styles.card}>
                  <Text style={styles.rowTitle}>
                    {orderNumber(order.id)} · {formatPrice(order.total)}
                  </Text>
                  <Text style={styles.muted}>
                    {itemsSummary(order)} · {methodLabel(order.paymentMethod)}
                  </Text>
                  <Button
                    title="Mark received"
                    icon="cash-outline"
                    variant="secondary"
                    loading={confirmingId === order.id}
                    onPress={() => confirm(order)}
                  />
                </Card>
              ))}
            </View>
          ) : null}

          <View style={styles.list}>
            <Text style={styles.section}>Payments received</Text>
            {sales.payments.length === 0 ? (
              <Message text="No payments yet. They appear here when orders are paid, or when you add a cash sale." />
            ) : (
              sales.payments
                .slice(0, RECENT_COUNT)
                .map((payment) => (
                  <PaymentRow
                    key={payment.id}
                    payment={payment}
                    onDelete={() => confirmDelete(payment)}
                  />
                ))
            )}
          </View>
        </>
      ) : null}

      <CashSaleModal
        visible={adding}
        saving={saving}
        onSave={addSale}
        onClose={() => setAdding(false)}
      />
    </Screen>
  );
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.card}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  loader: { paddingVertical: spacing.xl },
  card: { gap: spacing.sm },
  list: { gap: spacing.md },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  big: { fontSize: 36, fontWeight: '800', color: colors.primaryDark },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  body: { fontSize: fontSize.body, color: colors.text },
  rowTitle: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
});
