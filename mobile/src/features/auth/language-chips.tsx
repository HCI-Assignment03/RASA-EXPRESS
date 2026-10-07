import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import type { Language } from '@/types';

export const LANGUAGE_LABELS: Record<Language, string> = {
  si: 'සිංහල',
  ta: 'தமிழ்',
  en: 'English',
};

const ORDER: Language[] = ['si', 'ta', 'en'];

type Props = {
  value: Language;
  onChange: (language: Language) => void;
};

/**
 * Preferred language, saved on the profile. The screens themselves are English only for now
 * (see docs/DEVIATIONS.md, D03).
 */
export function LanguageChips({ value, onChange }: Props) {
  return (
    <View style={styles.row}>
      {ORDER.map((code) => {
        const selected = code === value;
        return (
          <Pressable
            key={code}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(code)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.label, selected && styles.labelSelected]}>
              {LANGUAGE_LABELS[code]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm },
  chip: {
    minHeight: minTapSize,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  label: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  labelSelected: { color: colors.onPrimary },
});
