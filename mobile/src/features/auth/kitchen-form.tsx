import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { colors, fontSize, spacing } from '@/constants/theme';
import { updateKitchen } from '@/services/cooks';
import type { Cook, WithId } from '@/types';
import {
  BIO_MAX_LENGTH,
  kitchenToForm,
  validateKitchenForm,
  type KitchenFormErrors,
  type KitchenFormValues,
} from '@/utils/kitchen';

type Props = {
  cook: WithId<Cook>;
  onDone: () => void;
};

/**
 * Update: the cook's own page, as customers see it on C2 and C3.
 * Shown on the cook's More tab next to the account details.
 */
export function KitchenForm({ cook, onDone }: Props) {
  const toast = useToast();
  const [values, setValues] = useState<KitchenFormValues>(() => kitchenToForm(cook));
  const [errors, setErrors] = useState<KitchenFormErrors>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof KitchenFormValues>(key: K, value: KitchenFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  async function save() {
    const result = validateKitchenForm(values);
    setErrors(result.errors);
    if (!result.input) return;

    setSaving(true);
    try {
      await updateKitchen(cook.id, result.input);
      toast.show('Kitchen details saved', 'success');
      onDone();
    } catch {
      toast.show('Could not save. Check your connection.', 'error');
      setSaving(false);
    }
  }

  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Kitchen details</Text>
      <Text style={styles.muted}>Customers see this on your cook page.</Text>

      <TextField
        label="Kitchen name"
        value={values.displayName}
        onChangeText={(text) => set('displayName', text)}
        error={errors.displayName}
        placeholder="Amma's Kitchen"
      />
      <TextField
        label="Area"
        value={values.area}
        onChangeText={(text) => set('area', text)}
        error={errors.area}
        placeholder="Galle Fort"
      />
      <TextField
        label="About your food (optional)"
        value={values.bio}
        onChangeText={(text) => set('bio', text)}
        error={errors.bio}
        maxLength={BIO_MAX_LENGTH}
        multiline
        placeholder="Home-style rice and curry, cooked fresh every morning"
      />
      <TextField
        label="Tags, separated by commas (optional)"
        value={values.tags}
        onChangeText={(text) => set('tags', text)}
        error={errors.tags}
        placeholder="Rice & Curry, Lunch packets"
      />

      <View style={styles.row}>
        <View style={styles.rowText}>
          <Text style={styles.label}>Accept pre-orders</Text>
          <Text style={styles.muted}>Customers can order for later today or tomorrow.</Text>
        </View>
        <Switch
          accessibilityLabel="Accept pre-orders"
          value={values.acceptsPreorder}
          onValueChange={(on) => set('acceptsPreorder', on)}
          trackColor={{ false: colors.switchOff, true: colors.primary }}
          ios_backgroundColor={colors.switchOff}
          thumbColor={colors.surface}
        />
      </View>
      {values.acceptsPreorder ? (
        <TextField
          label="Same-day pre-orders close at (24-hour clock)"
          value={values.cutoffTime}
          onChangeText={(text) => set('cutoffTime', text)}
          error={errors.cutoffTime}
          placeholder="18:00"
          keyboardType="numbers-and-punctuation"
          maxLength={5}
        />
      ) : null}

      <View style={styles.times}>
        <View style={styles.time}>
          <TextField
            label="Delivery from (min)"
            value={values.etaMin}
            onChangeText={(text) => set('etaMin', text)}
            error={errors.etaMin}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
        <View style={styles.time}>
          <TextField
            label="Delivery to (min)"
            value={values.etaMax}
            onChangeText={(text) => set('etaMax', text)}
            error={errors.etaMax}
            keyboardType="number-pad"
            maxLength={3}
          />
        </View>
      </View>

      <Button title="Save kitchen details" icon="checkmark" onPress={save} loading={saving} />
      <Button title="Cancel" variant="ghost" onPress={onDone} disabled={saving} />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  title: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  label: { fontSize: fontSize.body, fontWeight: '600', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  rowText: { flex: 1, gap: 2 },
  times: { flexDirection: 'row', gap: spacing.md },
  time: { flex: 1 },
});
