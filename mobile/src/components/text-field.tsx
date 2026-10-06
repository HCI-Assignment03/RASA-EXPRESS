import type { ReactNode } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  /** Message shown under the field in red. */
  error?: string;
  /** Fixed text before the input, such as "+94". */
  prefix?: string;
  /** Something at the end of the field, such as a show/hide password button. */
  trailing?: ReactNode;
};

export function TextField({ label, error, prefix, trailing, style, ...inputProps }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        {prefix ? <Text style={styles.prefix}>{prefix}</Text> : null}
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.textMuted}
          style={[styles.input, style]}
          {...inputProps}
        />
        {trailing}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  field: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  fieldError: { borderColor: colors.danger },
  prefix: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  input: { flex: 1, minHeight: 48, fontSize: fontSize.body, color: colors.text },
  error: { fontSize: fontSize.caption, color: colors.danger },
});
