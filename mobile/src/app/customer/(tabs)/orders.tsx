import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { colors, fontSize, spacing } from '@/constants/theme';
import { OrderRow } from '@/features/customer/order-row';
import { useCooks } from '@/hooks/use-cooks';
import { useMyOrders } from '@/hooks/use-my-orders';
import { useMyReviews } from '@/hooks/use-my-reviews';
import type { Order, WithId } from '@/types';

// C6 Orders tab. Read: the customer's orders, active ones first. Tapping one opens its tracking.
export default function OrdersScreen() {
  const orders = useMyOrders();
  const { cooks } = useCooks();
  const myReviews = useMyReviews();

  const cookName = (cookId: string) =>
    cooks.find((cook) => cook.id === cookId)?.displayName ?? null;
  const open = (order: WithId<Order>) =>
    router.push({ pathname: '/customer/track/[orderId]', params: { orderId: order.id } });

  const empty = !orders.loading && !orders.error && orders.active.length + orders.past.length === 0;

  return (
    <Screen scroll>
      <Text style={styles.title}>Orders</Text>

      {orders.loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {orders.error ? (
        <Message text={orders.error}>
          <Button title="Try again" icon="refresh" onPress={orders.reload} />
        </Message>
      ) : null}

      {empty ? (
        <Message text="You have not ordered yet. Find a cook and place your first order.">
          <Button
            title="Find cooks"
            icon="search"
            onPress={() => router.navigate('/customer/home')}
          />
        </Message>
      ) : null}

      {orders.active.length > 0 ? (
        <View style={styles.list}>
          <Text style={styles.section}>On the way</Text>
          {orders.active.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              cookName={cookName(order.cookId)}
              review={myReviews.byOrder(order.id)}
              onPress={() => open(order)}
            />
          ))}
        </View>
      ) : null}

      {orders.past.length > 0 ? (
        <View style={styles.list}>
          <Text style={styles.section}>Past orders</Text>
          {orders.past.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              cookName={cookName(order.cookId)}
              review={myReviews.byOrder(order.id)}
              onPress={() => open(order)}
            />
          ))}
        </View>
      ) : null}
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
  loader: { paddingVertical: spacing.xl },
  list: { gap: spacing.md },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
});
