import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { SHEET_MAX_WIDTH } from '@/utils/layout';

type ToastTone = 'success' | 'error' | 'info';
type ToastState = { id: number; message: string; tone: ToastTone } | null;

type ToastContextValue = {
  show: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const BACKGROUND: Record<ToastTone, string> = {
  success: colors.success,
  error: colors.danger,
  info: colors.text,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const insets = useSafeAreaInsets();

  const show = useCallback((message: string, tone: ToastTone = 'info') => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return;
    opacity.setValue(0);
    const animation = Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]);
    animation.start(({ finished }) => {
      if (finished) setToast(null);
    });
    return () => animation.stop();
  }, [toast, opacity]);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          accessibilityLiveRegion="polite"
          style={[
            styles.toastRow,
            {
              top: insets.top + spacing.sm,
              paddingLeft: spacing.lg + insets.left,
              paddingRight: spacing.lg + insets.right,
              opacity,
            },
          ]}
        >
          <View style={[styles.toast, { backgroundColor: BACKGROUND[toast.tone] }]}>
            <Text style={styles.text}>{toast.message}</Text>
          </View>
        </Animated.View>
      ) : null}
    </ToastContext.Provider>
  );
}

/** Usage: const toast = useToast(); toast.show('Order placed', 'success'); */
export function useToast(): ToastContextValue {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>');
  return value;
}

const styles = StyleSheet.create({
  // Full width row, so the toast can be centred with a maximum width on tablets and in landscape.
  toastRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  toast: {
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
    padding: spacing.md,
    borderRadius: radius.md,
  },
  text: {
    color: colors.onPrimary,
    fontSize: fontSize.body,
    fontWeight: '600',
    textAlign: 'center',
  },
});
