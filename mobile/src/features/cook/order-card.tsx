import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { colors, fontSize, radius, shadow, spacing } from '@/constants/theme';
import type { Order, WithId } from '@/types';
import {
  STATUS_LABEL,
  STATUS_TONE,
  canDecline,
  itemsSummary,
  nextStep,
  orderNumber,
  paymentLabel,
} from '@/utils/cook-orders';
import { formatPrice, formatTimeAgo } from '@/utils/format';

type Props = {
  order: WithId<Order>;
  busy: boolean;
  onOpen: () => void;
  onAdvance: () => void;
  onDecline: () => void;
};

/** One order on S1: what was ordered, where it goes, and the next step for the cook. */
export function OrderCard({ order, busy, onOpen, onAdvance, onDecline }: Props) {
  const step = nextStep(order.status);
  const declinable = canDecline(order.status);

  return (
    <View style={styles.card}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Order ${orderNumber(order.id)}, ${STATUS_LABEL[order.status]}. Open details`}
        onPress={onOpen}
        style={styles.body}
      >
        <View style={styles.header}>
          <Text style={styles.number}>{orderNumber(order.id)}</Text>
          <Badge label={STATUS_LABEL[order.status]} tone={STATUS_TONE[order.status]} />
        </View>
        <Text style={styles.time}>{formatTimeAgo(order.createdAt.toDate())}</Text>

        <Text style={styles.items}>{itemsSummary(order)}</Text>
        <Text style={styles.muted}>
          {order.address}
          {order.landmark ? `, ${order.landmark}` : ''}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.payment}>{paymentLabel(order)}</Text>
          <Text style={styles.total}>{formatPrice(order.total)}</Text>
        </View>

        {order.status === 'declined' && order.declineReason ? (
          <Text style={styles.reason}>Declined: {order.declineReason}</Text>
        ) : null}
      </Pressable>

      {step || declinable ? (
        <View style={styles.buttons}>
          {declinable ? (
            <Button
              title="Decline"
              variant="danger"
              disabled={busy}
              onPress={onDecline}
              style={styles.button}
            />
          ) : null}
          {step ? (
            <Button
              title={step.label}
              icon="checkmark"
              loading={busy}
              onPress={onAdvance}
              style={styles.button}
            />
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    borderRadius: radius.lg,
    ...shadow.card,
    backgroundColor: colors.surface,
  },
  body: { gap: spacing.sm, padding: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  number: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.text },
  time: { fontSize: fontSize.caption, color: colors.textMuted },
  items: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  payment: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  total: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.primaryDark },
  reason: { fontSize: fontSize.caption, color: colors.danger },
  buttons: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.lg,
    paddingTop: 0,
  },
  button: { flex: 1 },
});
