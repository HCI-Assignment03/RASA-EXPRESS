import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { Role } from '@/types';

type IconName = ComponentProps<typeof Ionicons>['name'];

const ROLES: { role: Role; label: string; icon: IconName }[] = [
  { role: 'customer', label: 'Customer', icon: 'person-outline' },
  { role: 'cook', label: 'Home cook', icon: 'storefront-outline' },
  { role: 'rider', label: 'Rider', icon: 'bicycle-outline' },
];

type Props = {
  value: Role;
  onChange: (role: Role) => void;
};

/** "I am a..." choice on the register form. Every tile has a text label (NFR07). */
export function RoleTiles({ value, onChange }: Props) {
  return (
    <View style={styles.group}>
      <Text style={styles.heading}>I AM A...</Text>
      <View style={styles.row} accessibilityRole="radiogroup">
        {ROLES.map(({ role, label, icon }) => {
          const selected = role === value;
          return (
            <Pressable
              key={role}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              accessibilityLabel={label}
              onPress={() => onChange(role)}
              style={[styles.tile, selected && styles.tileSelected]}
            >
              <Ionicons
                name={icon}
                size={26}
                color={selected ? colors.primary : colors.textMuted}
              />
              <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: spacing.sm },
  heading: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  row: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    minHeight: minTapSize + 28,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.md,
  },
  tileSelected: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  label: { fontSize: fontSize.caption, fontWeight: '600', color: colors.text },
  labelSelected: { color: colors.primaryDark },
});
