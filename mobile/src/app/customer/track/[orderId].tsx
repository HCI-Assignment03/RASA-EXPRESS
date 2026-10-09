import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { ChatBox } from '@/features/customer/chat-box';
import { ProgressBar } from '@/features/customer/progress-bar';
import { TripMap } from '@/features/rider/trip-map';
import { useCook } from '@/hooks/use-cooks';
import { useOrder } from '@/hooks/use-order';
import { useReview } from '@/hooks/use-review';
import { useUserProfile } from '@/hooks/use-user-profile';
import { OrderChangedError } from '@/services/cook-orders';
import { cancelOrder } from '@/services/orders';
import type { Order, WithId } from '@/types';
import { itemsSummary, orderNumber, paymentLabel } from '@/utils/cook-orders';
import { formatMobile, formatPrice } from '@/utils/format';
import { tripStops } from '@/utils/geo';
import {
  canCancel,
  canChat,
  canReview,
  customerStatus,
  etaText,
  progressIndex,
} from '@/utils/tracking';

// C6 Live order tracking.
// Read: live status, ETA, rider. Create: a chat message to the rider.
// Update: cancel the order while it is still "placed".
export default function TrackOrderScreen() {
  const { orderId } = useLocalSearchParams<{ orderId: string }>();
  const { order, loading, error, reload } = useOrder(orderId);

  if (loading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Screen>
    );
  }

  if (error || !order) {
    return (
      <Screen edges={['top', 'bottom']}>
        <Card style={styles.card}>
          <Text style={styles.body}>{error || 'This order could not be found.'}</Text>
          {error ? <Button title="Try again" icon="refresh" onPress={reload} /> : null}
          <Button title="Go back" variant="ghost" onPress={() => router.back()} />
        </Card>
      </Screen>
    );
  }

  return <TrackView order={order} />;
}

function TrackView({ order }: { order: WithId<Order> }) {
  const toast = useToast();
  const { cook } = useCook(order.cookId);
  const { review } = useReview(order.id);
  const [cancelling, setCancelling] = useState(false);

  const step = progressIndex(order.status);
  const eta = etaText(order, cook);
  const stops = tripStops(order);
  const showMap =
    order.riderId !== null && (order.status === 'ready' || order.status === 'picked_up');

  const confirmCancel = () => {
    Alert.alert(
      'Cancel this order?',
      'The cook has not confirmed it yet, so it is free to cancel.',
      [
        { text: 'Keep order', style: 'cancel' },
        {
          text: 'Cancel order',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelOrder(order);
              toast.show('Order cancelled', 'success');
            } catch (failure) {
              toast.show(
                failure instanceof OrderChangedError
                  ? 'The cook just confirmed this order, so it can no longer be cancelled.'
                  : 'Could not cancel. Check your connection.',
                failure instanceof OrderChangedError ? 'info' : 'error',
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{orderNumber(order.id)}</Text>
          <Text style={styles.muted}>{cook?.displayName ?? 'Your cook'}</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.status}>{customerStatus(order.status, order.riderId !== null)}</Text>
        {eta ? <Text style={styles.eta}>{eta}</Text> : null}
        {step >= 0 ? <ProgressBar current={step} /> : null}
        {order.status === 'declined' && order.declineReason ? (
          <Text style={styles.declined}>Reason: {order.declineReason}</Text>
        ) : null}
      </Card>

      {showMap ? (
        <TripMap pickup={stops.pickup} dropoff={stops.dropoff} rider={order.riderLocation} />
      ) : null}

      {order.riderId ? <RiderCard order={order} /> : null}

      <Card style={styles.card}>
        <Text style={styles.section}>Your order</Text>
        <Text style={styles.body}>{itemsSummary(order)}</Text>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatPrice(order.total)}</Text>
        </View>
        <Text style={styles.muted}>{paymentLabel(order)}</Text>
        <Text style={styles.muted}>
          Deliver to {order.address}
          {order.landmark ? `, ${order.landmark}` : ''}
        </Text>
      </Card>

      {canCancel(order.status) ? (
        <Button
          title="Cancel order"
          variant="danger"
          loading={cancelling}
          onPress={confirmCancel}
        />
      ) : null}

      {canReview(order.status) ? (
        <Button
          title={review ? 'Edit your review' : 'Rate your order'}
          icon="star-outline"
          onPress={() =>
            router.push({ pathname: '/customer/review/[orderId]', params: { orderId: order.id } })
          }
        />
      ) : null}
    </Screen>
  );
}

function RiderCard({ order }: { order: WithId<Order> }) {
  const { profile } = useUserProfile(order.riderId ?? '');
  const name = profile?.name ?? 'Your rider';

  return (
    <Card style={styles.card}>
      <View style={styles.riderRow}>
        <View style={styles.riderIcon}>
          <Ionicons name="bicycle-outline" size={24} color={colors.primaryDark} />
        </View>
        <View style={styles.riderText}>
          <Text style={styles.section}>{name}</Text>
          <Text style={styles.muted}>Your rider</Text>
        </View>
        {profile ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${name} on ${formatMobile(profile.phone)}`}
            onPress={() => Linking.openURL(`tel:${profile.phone}`)}
            style={styles.call}
          >
            <Ionicons name="call" size={20} color={colors.onPrimary} />
          </Pressable>
        ) : null}
      </View>

      {canChat(order) ? <ChatBox orderId={order.id} otherName={name} otherRole="rider" /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  titleBlock: { flex: 1 },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  card: { gap: spacing.md },
  status: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  eta: { fontSize: fontSize.body, color: colors.primaryDark, fontWeight: '600' },
  declined: { fontSize: fontSize.body, color: colors.danger },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  total: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.primaryDark },
  riderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  riderIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  riderText: { flex: 1 },
  call: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
  },
});
