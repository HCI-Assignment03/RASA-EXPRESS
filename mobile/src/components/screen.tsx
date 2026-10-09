import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/constants/theme';
import { CONTENT_MAX_WIDTH } from '@/utils/layout';

type Props = {
  children: ReactNode;
  /** Wrap the content in a ScrollView. */
  scroll?: boolean;
  /**
   * Safe-area edges to pad. Tab screens keep the default (top only, the tab bar covers the bottom).
   * Screens with no tab bar should pass ['top', 'bottom']. Left and right are always padded, for the
   * notch of a phone held sideways.
   */
  edges?: Edge[];
  /**
   * The content stays in a centred column no wider than this, so it does not stretch across a
   * tablet or a phone in landscape. Grids pass a wider value (WIDE_MAX_WIDTH).
   */
  maxWidth?: number;
};

export function Screen({
  children,
  scroll = false,
  edges = ['top'],
  maxWidth = CONTENT_MAX_WIDTH,
}: Props) {
  const content = [styles.content, { maxWidth }];

  return (
    <SafeAreaView edges={[...edges, 'left', 'right']} style={styles.root}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={content}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          {children}
        </ScrollView>
      ) : (
        <View style={content}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: {
    flexGrow: 1,
    width: '100%',
    alignSelf: 'center',
    padding: spacing.lg,
    gap: spacing.md,
  },
});
