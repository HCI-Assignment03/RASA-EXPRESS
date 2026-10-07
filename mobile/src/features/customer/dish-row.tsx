import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Badge } from '@/components/badge';
import { FoodPlate } from '@/components/food-plate';
import { QuantityStepper } from '@/components/quantity-stepper';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import type { Dish, WithId } from '@/types';
import { isSoldOut } from '@/utils/dish';
import { formatPrice } from '@/utils/format';

type Props = {
  dish: WithId<Dish>;
  /** How many of this dish are in the cart. */
  quantity: number;
  onPress: () => void;
  onAdd: () => void;
  onChangeQuantity: (next: number) => void;
};

/** One dish on the C3 menu. Not in the cart: "Add". In the cart: a stepper (Update / Delete). */
export function DishRow({ dish, quantity, onPress, onAdd, onChangeQuantity }: Props) {
  const soldOut = isSoldOut(dish);

  return (
    <View style={[styles.row, soldOut && styles.soldOut]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${dish.name}, ${formatPrice(dish.price)}${soldOut ? ', sold out' : ''}. Show details`}
        onPress={onPress}
        style={styles.info}
      >
        <View style={styles.thumb}>
          <FoodPlate size={52} />
        </View>
        <View style={styles.text}>
          <Text style={styles.name}>{dish.name}</Text>
          <Text style={styles.ingredients} numberOfLines={2}>
            {dish.ingredients.join(', ')}
          </Text>
          <Text style={styles.price}>{formatPrice(dish.price)}</Text>
        </View>
      </Pressable>

      <View style={styles.action}>
        {soldOut ? (
          <Badge label="Sold out today" tone="neutral" />
        ) : quantity > 0 ? (
          <QuantityStepper value={quantity} max={dish.portionsLeft} onChange={onChangeQuantity} />
        ) : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${dish.name} to cart`}
            onPress={onAdd}
            style={styles.add}
          >
            <Ionicons name="add" size={20} color={colors.onPrimary} />
            <Text style={styles.addText}>Add</Text>
          </Pressable>
        )}
        {!soldOut && dish.portionsLeft <= 3 ? (
          <Text style={styles.few}>Only {dish.portionsLeft} left</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  soldOut: { opacity: 0.6 },
  info: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  thumb: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coverPeach,
  },
  text: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  ingredients: { fontSize: fontSize.caption, color: colors.textMuted },
  price: { fontSize: fontSize.body, fontWeight: '700', color: colors.primaryDark },
  action: { alignItems: 'center', gap: spacing.xs },
  add: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
  },
  addText: { fontSize: fontSize.body, fontWeight: '700', color: colors.onPrimary },
  few: { fontSize: fontSize.caption, color: colors.warning },
});
