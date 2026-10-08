import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';

type Props = {
  value: number;
  onChange: (next: number) => void;
  /** Name of the dish, for screen readers. */
  dishName: string;
};

/** − 8 +  for the portions left of a dish. It stops at 0, which means sold out. */
export function PortionStepper({ value, onChange, dishName }: Props) {
  return (
    <View style={styles.row}>
      <StepButton
        icon="remove"
        label={`Fewer portions of ${dishName}`}
        disabled={value <= 0}
        onPress={() => onChange(value - 1)}
      />
      <Text accessibilityLabel={`${value} portions left`} style={styles.value}>
        {value}
      </Text>
      <StepButton
        icon="add"
        label={`More portions of ${dishName}`}
        disabled={false}
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
  icon: 'add' | 'remove';
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
