import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { Dish, WithId } from '@/types';
import { isSoldOut } from '@/utils/dish';
import { formatPrice } from '@/utils/format';

import { PortionStepper } from './portion-stepper';

type Props = {
  dish: WithId<Dish>;
  onToggleAvailable: (available: boolean) => void;
  onChangePortions: (next: number) => void;
  onEdit: () => void;
  onDelete: () => void;
};

/** One dish on S3: on-sale switch, portions, edit and delete. */
export function MenuDishCard({
  dish,
  onToggleAvailable,
  onChangePortions,
  onEdit,
  onDelete,
}: Props) {
  const soldOut = isSoldOut(dish);

  return (
    <View style={[styles.card, soldOut && styles.soldOut]}>
      <View style={styles.top}>
        <View style={styles.text}>
          <Text style={styles.name}>{dish.name}</Text>
          <Text style={styles.price}>{formatPrice(dish.price)}</Text>
          <Text style={styles.ingredients} numberOfLines={2}>
            {dish.ingredients.join(', ')}
          </Text>
        </View>
        {soldOut ? <Badge label="Sold out" tone="neutral" /> : null}
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>On sale today</Text>
        <Switch
          accessibilityLabel={`${dish.name} on sale`}
          value={dish.available}
          onValueChange={onToggleAvailable}
          trackColor={{ false: colors.switchOff, true: colors.primary }}
          ios_backgroundColor={colors.switchOff}
          thumbColor={colors.surface}
        />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Portions left</Text>
        <PortionStepper
          value={dish.portionsLeft}
          dishName={dish.name}
          onChange={onChangePortions}
        />
      </View>

      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Edit ${dish.name}`}
          onPress={onEdit}
          style={styles.action}
        >
          <Ionicons name="create-outline" size={20} color={colors.primaryDark} />
          <Text style={styles.actionText}>Edit</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${dish.name}`}
          onPress={onDelete}
          style={styles.action}
        >
          <Ionicons name="trash-outline" size={20} color={colors.danger} />
          <Text style={[styles.actionText, styles.delete]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  soldOut: { opacity: 0.8 },
  top: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  text: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  price: { fontSize: fontSize.body, fontWeight: '700', color: colors.primaryDark },
  ingredients: { fontSize: fontSize.caption, color: colors.textMuted },
  row: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  label: { fontSize: fontSize.body, color: colors.text },
  actions: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  action: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionText: { fontSize: fontSize.body, fontWeight: '600', color: colors.primaryDark },
  delete: { color: colors.danger },
});
