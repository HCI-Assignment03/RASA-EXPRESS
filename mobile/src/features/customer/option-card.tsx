import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';

type Props = {
  label: string;
  /** A second line under the label, such as why the option is switched off. */
  hint?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

/** One choice in a radio list on C5: a delivery time or a payment method. */
export function OptionCard({ label, hint, icon, selected, disabled = false, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.card, selected && styles.selected, disabled && styles.disabled]}
    >
      <Ionicons name={icon} size={22} color={selected ? colors.primaryDark : colors.textMuted} />
      <View style={styles.text}>
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
        {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      </View>
      <Ionicons
        name={selected ? 'radio-button-on' : 'radio-button-off'}
        size={22}
        color={selected ? colors.primary : colors.border}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  selected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  disabled: { opacity: 0.5 },
  text: { flex: 1, gap: 2 },
  label: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  labelSelected: { color: colors.primaryDark },
  hint: { fontSize: fontSize.caption, color: colors.textMuted },
});
