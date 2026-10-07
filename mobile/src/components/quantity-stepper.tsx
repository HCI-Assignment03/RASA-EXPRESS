import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (next: number) => void;
  /** The plus button stops here (portions left). */
  max?: number;
  /** What the minus button does at 1 is decided by the caller: 0 usually removes the item. */
  min?: number;
};

/** − 2 +  with 44-point buttons. Used for cart quantities on C3, C4 and C5. */
export function QuantityStepper({
  value,
  onChange,
  max = Number.POSITIVE_INFINITY,
  min = 0,
}: Props) {
  const canDecrease = value > min;
  const canIncrease = value < max;

  return (
    <View style={styles.row}>
      <StepButton
        icon={value <= 1 && min === 0 ? 'trash-outline' : 'remove'}
        label={value <= 1 && min === 0 ? 'Remove from cart' : 'Decrease quantity'}
        disabled={!canDecrease}
        onPress={() => onChange(value - 1)}
      />
      <Text accessibilityLabel={`Quantity ${value}`} style={styles.value}>
        {value}
      </Text>
      <StepButton
        icon="add"
        label="Increase quantity"
        disabled={!canIncrease}
        onPress={() => onChange(value + 1)}
      />
    </View>
  );
}

function StepButton({
  icon,
  label,
  disabled,
  onPress,
}: {
  icon: 'add' | 'remove' | 'trash-outline';
  label: string;
  disabled: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabled]}
    >
      <Ionicons name={icon} size={20} color={colors.primaryDark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  button: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  disabled: { opacity: 0.35 },
  value: {
    minWidth: spacing.xl,
    textAlign: 'center',
    fontSize: fontSize.body,
    fontWeight: '700',
    color: colors.text,
  },
});
