import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { Payment, WithId } from '@/types';
import { methodLabel, orderNumber } from '@/utils/cook-orders';
import { formatPrice, formatTimeAgo } from '@/utils/format';
import { isManualSale } from '@/utils/sales';

type Props = {
  payment: WithId<Payment>;
  /** Called for manual sales only. */
  onDelete: () => void;
};

/** One payment received, on S4. Manual sales get a delete button for typing mistakes. */
export function PaymentRow({ payment, onDelete }: Props) {
  const manual = isManualSale(payment);
  const title = manual
    ? payment.note || 'Cash sale'
    : `Order ${orderNumber(payment.orderId ?? payment.id)}`;

  return (
    <View style={styles.row}>
      <View style={styles.icon}>
        <Ionicons
          name={manual ? 'create-outline' : 'receipt-outline'}
          size={20}
          color={colors.primaryDark}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.muted}>
          {manual ? 'Manual sale' : methodLabel(payment.method)} ·{' '}
          {formatTimeAgo(payment.createdAt.toDate())}
        </Text>
      </View>
      <Text style={styles.amount}>{formatPrice(payment.amount)}</Text>
      {manual ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${title}`}
          onPress={onDelete}
          style={styles.delete}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
  text: { flex: 1, gap: 2 },
  title: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  amount: { fontSize: fontSize.body, fontWeight: '800', color: colors.success },
  delete: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
});
