import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, radius, shadow, spacing, type Tone } from '@/constants/theme';
import type { Order, Review, WithId } from '@/types';
import { STATUS_TONE, itemsSummary, orderNumber } from '@/utils/cook-orders';
import { formatPrice, formatTimeAgo } from '@/utils/format';
import { overallScore } from '@/utils/reviews';
import { canReview, customerStatus } from '@/utils/tracking';

type Props = {
  order: WithId<Order>;
  /** Name of the cook, or null if the cook no longer exists. */
  cookName: string | null;
  /** The customer's review of this order, or null when it is not rated. */
  review: WithId<Review> | null;
  onPress: () => void;
};

const TONE_COLOR: Record<Tone, string> = {
  primary: colors.primaryDark,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
  neutral: colors.textMuted,
};

/** One order in the C6 list: who cooked it, what it is, where it is now. */
export function OrderRow({ order, cookName, review, onPress }: Props) {
  const status = customerStatus(order.status, order.riderId !== null);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Order ${orderNumber(order.id)} from ${cookName ?? 'a cook'}. ${status}. Open tracking`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <Text style={styles.cook} numberOfLines={1}>
          {cookName ?? 'Cook'}
        </Text>
        <Text style={styles.time}>{formatTimeAgo(order.createdAt.toDate())}</Text>
      </View>
      <Text style={styles.items} numberOfLines={2}>
        {itemsSummary(order)}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.status, { color: TONE_COLOR[STATUS_TONE[order.status]] }]}>
          {status}
        </Text>
        <Text style={styles.total}>{formatPrice(order.total)}</Text>
      </View>
      {canReview(order.status) ? (
        <Text style={styles.rate}>
          {review ? `You rated ${overallScore(review).toFixed(1)} stars` : 'Tap to rate this order'}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadow.card,
    backgroundColor: colors.surface,
  },
  pressed: { opacity: 0.85 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  cook: { flex: 1, fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  time: { fontSize: fontSize.caption, color: colors.textMuted },
  items: { fontSize: fontSize.body, color: colors.text },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  status: { flex: 1, fontSize: fontSize.caption, fontWeight: '700' },
  total: { fontSize: fontSize.body, fontWeight: '800', color: colors.primaryDark },
  rate: { fontSize: fontSize.caption, fontWeight: '600', color: colors.primaryDark },
});
