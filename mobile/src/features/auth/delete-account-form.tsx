import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, radius, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { authErrorMessage } from '@/utils/auth-errors';

type Props = {
  onCancel: () => void;
};

/** C1 Delete: asks for the password again, then removes the profile and the account. */
export function DeleteAccountForm({ onCancel }: Props) {
  const { deleteAccount } = useAuth();
  const toast = useToast();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function confirmDelete() {
    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }
    setError('');
    setDeleting(true);
    try {
      await deleteAccount(password);
      // The account is gone, so the app returns to the sign-in screen.
      toast.show('Your account was deleted', 'info');
    } catch (failure) {
      setError(authErrorMessage(failure));
      setDeleting(false);
    }
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Delete account</Text>
      <View style={styles.warning}>
        <Ionicons name="warning-outline" size={22} color={colors.danger} />
        <Text style={styles.warningText}>
          This permanently deletes your account and your profile. Cooks also lose their cook page
          and dishes; customers lose their cart and saved cooks. It cannot be undone.
        </Text>
      </View>
      <TextField
        label="Password"
        value={password}
        onChangeText={setPassword}
        error={error}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={confirmDelete}
      />
      <Button
        title="Delete my account"
        variant="danger"
        icon="trash-outline"
        onPress={confirmDelete}
        loading={deleting}
      />
      <Button title="Keep my account" variant="ghost" onPress={onCancel} disabled={deleting} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  warning: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  warningText: { flex: 1, fontSize: fontSize.body, color: colors.danger },
});
