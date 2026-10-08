import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';
import { DeclineModal } from '@/features/cook/decline-modal';
import { OrderCard } from '@/features/cook/order-card';
import { useCookOrders } from '@/hooks/use-cook-orders';
import { OrderChangedError } from '@/services/cook-orders';
import type { Order, WithId } from '@/types';
import { ORDER_TABS, nextStep, type OrderTab } from '@/utils/cook-orders';

const EMPTY_TEXT: Record<OrderTab, string> = {
  new: 'No new orders right now. They appear here as soon as a customer orders.',
  preparing: 'Nothing is being prepared. Accept a new order to start.',
  ready: 'No orders are waiting for a rider.',
  past: 'No finished orders yet.',
};

// S1 Orders dashboard.
// Read: orders by status tab. Update: accept, start preparing, mark ready.
// Delete: decline an order (with a reason).
export default function OrdersDashboardScreen() {
  const toast = useToast();
  const orders = useCookOrders();
  const [tab, setTab] = useState<OrderTab>('new');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [declining, setDeclining] = useState<string | null>(null);

  const report = (error: unknown) =>
    toast.show(
      error instanceof OrderChangedError
        ? error.message
        : 'Could not update the order. Check your connection.',
      error instanceof OrderChangedError ? 'info' : 'error',
    );

  const advance = async (order: WithId<Order>) => {
    setBusyId(order.id);
    try {
      await orders.advance(order);
      toast.show(`${nextStep(order.status)?.label ?? 'Updated'}: done`, 'success');
    } catch (error) {
      report(error);
    } finally {
      setBusyId(null);
    }
  };

  const decline = async (reason: string) => {
    const order = orders.orders.find((o) => o.id === declining);
    if (!order) return;
    setBusyId(order.id);
    try {
      await orders.decline(order, reason);
      toast.show('Order declined', 'success');
      setDeclining(null);
    } catch (error) {
      report(error);
      setDeclining(null);
    } finally {
      setBusyId(null);
    }
  };

  const shown = orders.inTab(tab);

  return (
    <Screen scroll>
      <Text style={styles.title}>Orders</Text>

      <View style={styles.tabs} accessibilityRole="tablist">
        {ORDER_TABS.map(({ key, label }) => {
          const selected = key === tab;
          const count = orders.counts[key];
          return (
            <Pressable
              key={key}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`${label}, ${count} orders`}
              onPress={() => setTab(key)}
              style={[styles.tab, selected && styles.tabSelected]}
            >
              <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>
                {label}
                {count > 0 ? ` (${count})` : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {orders.loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {orders.error ? (
        <Message text={orders.error}>
          <Button title="Try again" icon="refresh" onPress={orders.reload} />
        </Message>
      ) : null}

      {!orders.loading && !orders.error && shown.length === 0 ? (
        <Message text={EMPTY_TEXT[tab]} />
      ) : null}

      {shown.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          busy={busyId === order.id}
          onOpen={() => router.push({ pathname: '/cook/order/[id]', params: { id: order.id } })}
          onAdvance={() => advance(order)}
          onDecline={() => setDeclining(order.id)}
        />
      ))}

      <DeclineModal
        orderId={declining}
        saving={busyId !== null && busyId === declining}
        onConfirm={decline}
        onClose={() => setDeclining(null)}
      />
    </Screen>
  );
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.message}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: {
    flex: 1,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabSelected: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  tabLabelSelected: { color: colors.primaryDark },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
});
