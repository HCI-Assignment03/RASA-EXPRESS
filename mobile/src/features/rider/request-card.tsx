import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { colors, fontSize, radius, shadow, spacing } from '@/constants/theme';
import type { Cook, Order, WithId } from '@/types';
import { formatDistance, riderFee } from '@/utils/delivery';
import { formatPrice } from '@/utils/format';

type Props = {
  order: WithId<Order>;
  /** The cook who prepared the order. null if the cook no longer exists. */
  cook: WithId<Cook> | null;
  accepting: boolean;
  onAccept: () => void;
  onDismiss: () => void;
};

/** One delivery request on R1: where to pick up, where to deliver, how far, what it pays. */
export function RequestCard({ order, cook, accepting, onAccept, onDismiss }: Props) {
  const distanceKm = cook?.distanceKm ?? 0;
  const itemCount = order.items.reduce((count, item) => count + item.qty, 0);
  const cash = order.paymentMethod === 'cash';

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.items}>
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </Text>
        <Badge
          label={cash ? `Collect ${formatPrice(order.total)} cash` : 'Paid online'}
          tone={cash ? 'warning' : 'success'}
          icon={cash ? 'cash-outline' : 'card-outline'}
        />
      </View>

      <Stop
        icon="storefront-outline"
        label="Pick up"
        title={cook?.displayName ?? 'Cook'}
        detail={cook?.area || undefined}
      />
      <Stop
        icon="location-outline"
        label="Deliver to"
        title={order.address}
        detail={order.landmark || undefined}
      />

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Ionicons name="navigate-outline" size={18} color={colors.textMuted} />
          <Text style={styles.statText}>{formatDistance(distanceKm)}</Text>
        </View>
        <View style={styles.fee}>
          <Text style={styles.feeLabel}>You earn</Text>
          <Text style={styles.feeValue}>{formatPrice(riderFee(distanceKm))}</Text>
        </View>
      </View>

      <View style={styles.buttons}>
        <Button
          title="Dismiss"
          variant="ghost"
          disabled={accepting}
          onPress={onDismiss}
          style={styles.button}
        />
        <Button
          title="Accept"
          icon="checkmark"
          loading={accepting}
          onPress={onAccept}
          style={styles.button}
        />
      </View>
    </View>
  );
}

function Stop({
  icon,
  label,
  title,
  detail,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  title: string;
  detail?: string;
}) {
  return (
    <View style={styles.stop}>
      <View style={styles.stopIcon}>
        <Ionicons name={icon} size={20} color={colors.primaryDark} />
      </View>
      <View style={styles.stopText}>
        <Text style={styles.stopLabel}>{label}</Text>
        <Text style={styles.stopTitle}>{title}</Text>
        {detail ? <Text style={styles.stopDetail}>{detail}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    ...shadow.card,
    backgroundColor: colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  items: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  stop: { flexDirection: 'row', gap: spacing.md },
  stopIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  stopText: { flex: 1, gap: 2 },
  stopLabel: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  stopTitle: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  stopDetail: { fontSize: fontSize.caption, color: colors.textMuted },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  stat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  statText: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  fee: { alignItems: 'flex-end' },
  feeLabel: { fontSize: fontSize.caption, color: colors.textMuted },
  feeValue: { fontSize: fontSize.title, fontWeight: '800', color: colors.success },
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1 },
});
