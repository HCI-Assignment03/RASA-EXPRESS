import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';

type Props = {
  children: ReactNode;
  /** Wrap the content in a ScrollView. */
  scroll?: boolean;
  /**
   * Safe-area edges to pad. Tab screens keep the default (top only, the tab bar covers the bottom).
   * Screens with no tab bar should pass ['top', 'bottom'].
   */
  edges?: Edge[];
};

export function Screen({ children, scroll = false, edges = ['top'] }: Props) {
  return (
    <SafeAreaView edges={edges} style={styles.root}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={styles.content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { flexGrow: 1, padding: spacing.lg, gap: spacing.md },
});
