import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { DECLINE_REASONS, orderNumber } from '@/utils/cook-orders';
import { ALL_ORIENTATIONS, SHEET_MAX_WIDTH } from '@/utils/layout';

type Props = {
  /** The order being declined, or null when the form is closed. */
  orderId: string | null;
  saving: boolean;
  onConfirm: (reason: string) => void;
  onClose: () => void;
};

const OTHER = 'other';

/** Asks the cook why an order is declined. Used by S1 and S2. */
export function DeclineModal(props: Props) {
  return (
    <Modal
      visible={props.orderId !== null}
      transparent
      animationType="fade"
      supportedOrientations={ALL_ORIENTATIONS}
      onRequestClose={props.onClose}
    >
      {/* Remounted each time it opens, so it always starts empty. */}
      {props.orderId ? <Body {...props} orderId={props.orderId} /> : null}
    </Modal>
  );
}

function Body({ orderId, saving, onConfirm, onClose }: Props & { orderId: string }) {
  const [choice, setChoice] = useState<string>(DECLINE_REASONS[0]);
  const [custom, setCustom] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const reason = choice === OTHER ? custom.trim() : choice;
    if (reason.length < 3) {
      setError('Tell the customer why, in a few words.');
      return;
    }
    onConfirm(reason);
  };

  return (
    <SafeAreaView style={styles.backdrop}>
      {/* Scrolls when the phone is on its side and the sheet is taller than the screen. */}
      <ScrollView
        style={styles.sheet}
        contentContainerStyle={styles.sheetContent}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <Text style={styles.title}>Decline {orderNumber(orderId)}?</Text>
        <Text style={styles.body}>The customer will see your reason.</Text>

        <View style={styles.chips}>
          {[...DECLINE_REASONS, OTHER].map((reason) => {
            const selected = choice === reason;
            return (
              <Pressable
                key={reason}
                accessibilityRole="radio"
                accessibilityState={{ selected }}
                onPress={() => {
                  setChoice(reason);
                  setError('');
                }}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
                  {reason === OTHER ? 'Other reason' : reason}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {choice === OTHER ? (
          <TextField
            label="Your reason"
            value={custom}
            onChangeText={(text) => {
              setCustom(text);
              setError('');
            }}
            maxLength={100}
            error={error}
            placeholder="For example: the gas ran out"
          />
        ) : null}
        {choice !== OTHER && error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.buttons}>
          <Button
            title="Keep order"
            variant="ghost"
            disabled={saving}
            onPress={onClose}
            style={styles.button}
          />
          <Button
            title="Decline"
            variant="danger"
            loading={saving}
            onPress={submit}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: 'rgba(43, 33, 24, 0.55)',
  },
  sheet: {
    flexGrow: 0,
    width: '100%',
    maxWidth: SHEET_MAX_WIDTH,
    alignSelf: 'center',
    borderRadius: radius.lg,
    backgroundColor: colors.background,
  },
  sheetContent: { gap: spacing.md, padding: spacing.lg },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    minHeight: minTapSize,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  chipSelected: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  chipText: { fontSize: fontSize.body, color: colors.text },
  chipTextSelected: { fontWeight: '700', color: colors.danger },
  error: { fontSize: fontSize.caption, color: colors.danger },
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1 },
});
