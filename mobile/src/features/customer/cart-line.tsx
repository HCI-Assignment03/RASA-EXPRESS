import { StyleSheet, Text, View } from 'react-native';

import { QuantityStepper } from '@/components/quantity-stepper';
import { colors, fontSize, spacing } from '@/constants/theme';
import type { CartItem } from '@/types';
import { formatPrice } from '@/utils/format';

type Props = {
  item: CartItem;
  /** Portions the cook has left: the plus button stops here. */
  max: number;
  onChangeQuantity: (next: number) => void;
};

/** One dish in the C5 cart summary. The stepper changes the quantity; at 1 the minus removes the dish. */
export function CartLine({ item, max, onChangeQuantity }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>{formatPrice(item.price * item.qty)}</Text>
        {item.note ? <Text style={styles.note}>Note: {item.note}</Text> : null}
      </View>
      <QuantityStepper value={item.qty} max={max} onChange={onChangeQuantity} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  text: { flex: 1, gap: 2 },
  name: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  price: { fontSize: fontSize.body, color: colors.primaryDark, fontWeight: '600' },
  note: { fontSize: fontSize.caption, color: colors.textMuted },
});
