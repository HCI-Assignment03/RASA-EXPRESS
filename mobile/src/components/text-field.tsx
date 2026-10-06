import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fontSize, radius, spacing } from '@/constants/theme';

type Props = TextInputProps & {
  label: string;
  /** Message shown under the field in red. */
  error?: string;
};

export function TextField({ label, error, style, ...inputProps }: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...inputProps}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  label: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  input: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    color: colors.text,
  },
  inputError: { borderColor: colors.danger },
  error: { fontSize: fontSize.caption, color: colors.danger },
});
