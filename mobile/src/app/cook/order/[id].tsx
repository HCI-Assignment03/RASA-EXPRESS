import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';
import { DeclineModal } from '@/features/cook/decline-modal';
import { useOrder } from '@/hooks/use-order';
import { useUserProfile } from '@/hooks/use-user-profile';
import {
  OrderChangedError,
  advanceOrder,
  declineOrder,
  markPaymentReceived,
} from '@/services/cook-orders';
import {
  STATUS_LABEL,
  STATUS_TONE,
  canDecline,
  canMarkPaid,
  nextStep,
  orderNumber,
  paymentLabel,
} from '@/utils/cook-orders';
import { formatMobile, formatPrice, formatTimeAgo } from '@/utils/format';

// S2 Order detail.
// Read: customer, items, payment. Update: move the order on, mark payment received.
// Delete: decline the order with a reason.
export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const toast = useToast();
  const { order, loading, error, reload } = useOrder(id);
  const [busy, setBusy] = useState<'step' | 'pay' | 'decline' | null>(null);
  const [declining, setDeclining] = useState(false);

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

  const step = nextStep(order.status);

  const run = async (kind: 'step' | 'pay' | 'decline', action: () => Promise<void>, ok: string) => {
    setBusy(kind);
    try {
      await action();
      toast.show(ok, 'success');
    } catch (failure) {
      toast.show(
        failure instanceof OrderChangedError
          ? failure.message
          : 'Could not update the order. Check your connection.',
        failure instanceof OrderChangedError ? 'info' : 'error',
      );
    } finally {
      setBusy(null);
    }
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
        <Text style={styles.title}>{orderNumber(order.id)}</Text>
        <Badge label={STATUS_LABEL[order.status]} tone={STATUS_TONE[order.status]} />
      </View>
      <Text style={styles.muted}>Ordered {formatTimeAgo(order.createdAt.toDate())}</Text>

      <CustomerCard customerId={order.customerId} />

      <Card style={styles.card}>
        <Text style={styles.section}>Items</Text>
        {order.items.map((item) => (
          <View key={item.dishId} style={styles.itemRow}>
            <View style={styles.itemText}>
              <Text style={styles.itemName}>
                {item.qty} × {item.name}
              </Text>
              {item.note ? <Text style={styles.note}>Note: {item.note}</Text> : null}
            </View>
            <Text style={styles.itemPrice}>{formatPrice(item.price * item.qty)}</Text>
          </View>
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatPrice(order.total)}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.section}>Delivery</Text>
        <Text style={styles.body}>{order.address}</Text>
        {order.landmark ? <Text style={styles.muted}>Landmark: {order.landmark}</Text> : null}
        <Text style={styles.muted}>
          {order.schedule.when === 'asap'
            ? 'As soon as possible'
            : `${order.schedule.when === 'today' ? 'Today' : 'Tomorrow'} at ${order.schedule.time}`}
        </Text>
        {order.riderId ? <RiderLine riderId={order.riderId} /> : null}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.section}>Payment</Text>
        <View style={styles.payRow}>
          <Text style={styles.body}>{paymentLabel(order)}</Text>
          <Badge
            label={order.paymentStatus === 'received' ? 'Paid' : 'Pending'}
            tone={order.paymentStatus === 'received' ? 'success' : 'warning'}
          />
        </View>
        {canMarkPaid(order) ? (
          <Button
            title="Mark payment received"
            icon="cash-outline"
            variant="secondary"
            loading={busy === 'pay'}
            onPress={() => run('pay', () => markPaymentReceived(order), 'Payment recorded')}
          />
        ) : null}
      </Card>

      {order.status === 'declined' ? (
        <Card style={styles.card}>
          <Text style={styles.section}>Declined</Text>
          <Text style={styles.body}>{order.declineReason || 'No reason was given.'}</Text>
        </Card>
      ) : null}

      {step ? (
        <Button
          title={step.label}
          icon="checkmark"
          loading={busy === 'step'}
          onPress={() => run('step', () => advanceOrder(order), `${step.label}: done`)}
        />
      ) : null}
      {canDecline(order.status) ? (
        <Button
          title="Decline order"
          variant="danger"
          disabled={busy !== null}
          onPress={() => setDeclining(true)}
        />
      ) : null}

      <DeclineModal
        orderId={declining ? order.id : null}
        saving={busy === 'decline'}
        onConfirm={async (reason) => {
          await run('decline', () => declineOrder(order, reason), 'Order declined');
          setDeclining(false);
        }}
        onClose={() => setDeclining(false)}
      />
    </Screen>
  );
}

function CustomerCard({ customerId }: { customerId: string }) {
  const { profile, loading } = useUserProfile(customerId);

  return (
    <Card style={styles.card}>
      <Text style={styles.section}>Customer</Text>
      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : profile ? (
        <>
          <Text style={styles.body}>{profile.name}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Call ${profile.name}`}
            onPress={() => Linking.openURL(`tel:${profile.phone}`)}
            style={styles.call}
          >
            <Ionicons name="call-outline" size={20} color={colors.primaryDark} />
            <Text style={styles.callText}>{formatMobile(profile.phone)}</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.muted}>This customer account no longer exists.</Text>
      )}
    </Card>
  );
}

function RiderLine({ riderId }: { riderId: string }): ReactNode {
  const { profile } = useUserProfile(riderId);
  return (
    <View style={styles.rider}>
      <Ionicons name="bicycle-outline" size={20} color={colors.primaryDark} />
      <Text style={styles.body}>Rider: {profile?.name ?? 'assigned'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  card: { gap: spacing.sm },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  note: { fontSize: fontSize.caption, color: colors.warning },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md },
  itemText: { flex: 1, gap: 2 },
  itemName: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  itemPrice: { fontSize: fontSize.body, color: colors.text },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  total: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.primaryDark },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  call: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  callText: { fontSize: fontSize.body, fontWeight: '600', color: colors.primaryDark },
  rider: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingTop: spacing.xs },
});
