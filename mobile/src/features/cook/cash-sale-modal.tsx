import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { ALL_ORIENTATIONS, SHEET_MAX_WIDTH } from '@/utils/layout';
import { parseSaleAmount } from '@/utils/sales';

type Props = {
  visible: boolean;
  saving: boolean;
  onSave: (amount: number, note: string) => void;
  onClose: () => void;
};

/** The "Add cash sale" form of S4, for sales that did not come through the app. */
export function CashSaleModal(props: Props) {
  return (
    <Modal
      visible={props.visible}
      transparent
      animationType="fade"
      supportedOrientations={ALL_ORIENTATIONS}
      onRequestClose={props.onClose}
    >
      {/* Remounted each time it opens, so it always starts empty. */}
      {props.visible ? <Body {...props} /> : null}
    </Modal>
  );
}

function Body({ saving, onSave, onClose }: Props) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    const parsed = parseSaleAmount(amount);
    if (parsed === null) {
      setError('Enter the amount in rupees, for example 500.');
      return;
    }
    onSave(parsed, note);
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
        <Text style={styles.title}>Add cash sale</Text>
        <Text style={styles.body}>For a customer who paid you directly, not through the app.</Text>

        <TextField
          label="Amount"
          prefix="Rs."
          value={amount}
          onChangeText={(text) => {
            setAmount(text);
            setError('');
          }}
          error={error}
          keyboardType="number-pad"
          placeholder="500"
        />
        <TextField
          label="Note (optional)"
          value={note}
          onChangeText={setNote}
          maxLength={60}
          placeholder="Walk-in lunch"
        />

        <View style={styles.buttons}>
          <Button
            title="Cancel"
            variant="ghost"
            disabled={saving}
            onPress={onClose}
            style={styles.button}
          />
          <Button
            title="Save sale"
            icon="checkmark"
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
  buttons: { flexDirection: 'row', gap: spacing.md },
  button: { flex: 1 },
});
