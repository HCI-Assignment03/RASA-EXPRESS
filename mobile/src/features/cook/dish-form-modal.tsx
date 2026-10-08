import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { TextField } from '@/components/text-field';
import { colors, fontSize, minTapSize, spacing } from '@/constants/theme';
import {
  EMPTY_DISH_FORM,
  validateDishForm,
  type DishFormErrors,
  type DishFormValues,
  type DishInput,
} from '@/utils/dish-form';

type Props = {
  visible: boolean;
  /** The form to start from: empty for a new dish, filled for an edit. */
  initial: DishFormValues;
  /** Heading, "Add dish" or "Edit dish". */
  title: string;
  saving: boolean;
  onSave: (input: DishInput) => void;
  onClose: () => void;
};

/** The add / edit dish form of S3, shown over the menu. */
export function DishFormModal(props: Props) {
  return (
    <Modal visible={props.visible} animationType="slide" onRequestClose={props.onClose}>
      {/* Remounted every time it opens, so the fields always start from `initial`. */}
      {props.visible ? <FormBody {...props} /> : null}
    </Modal>
  );
}

function FormBody({ initial, title, saving, onSave, onClose }: Props) {
  const [values, setValues] = useState<DishFormValues>(initial);
  const [errors, setErrors] = useState<DishFormErrors>({});

  const set = (field: keyof DishFormValues) => (text: string) => {
    setValues((current) => ({ ...current, [field]: text }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const submit = () => {
    const result = validateDishForm(values);
    setErrors(result.errors);
    if (result.input) onSave(result.input);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          onPress={onClose}
          style={styles.close}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
      >
        <TextField
          label="Dish name"
          value={values.name}
          onChangeText={set('name')}
          error={errors.name}
          placeholder="Chicken Rice & Curry"
        />
        <TextField
          label="Price"
          prefix="Rs."
          value={values.price}
          onChangeText={set('price')}
          error={errors.price}
          keyboardType="number-pad"
          placeholder="650"
        />
        <TextField
          label="Portions you can make today"
          value={values.portionsLeft}
          onChangeText={set('portionsLeft')}
          error={errors.portionsLeft}
          keyboardType="number-pad"
          placeholder="10"
        />
        <TextField
          label="Ingredients (separate with commas)"
          value={values.ingredients}
          onChangeText={set('ingredients')}
          error={errors.ingredients}
          placeholder="Samba rice, chicken, coconut, dhal"
          multiline
        />
        <TextField
          label="Allergens (optional, separate with commas)"
          value={values.allergens}
          onChangeText={set('allergens')}
          placeholder="Egg, fish, tree nuts"
        />

        <Text style={styles.section}>Nutrition per portion (optional)</Text>
        <View style={styles.pair}>
          <View style={styles.half}>
            <TextField
              label="Calories (kcal)"
              value={values.kcal}
              onChangeText={set('kcal')}
              error={errors.kcal}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <TextField
              label="Protein (g)"
              value={values.protein}
              onChangeText={set('protein')}
              error={errors.protein}
              keyboardType="number-pad"
            />
          </View>
        </View>
        <View style={styles.pair}>
          <View style={styles.half}>
            <TextField
              label="Carbs (g)"
              value={values.carbs}
              onChangeText={set('carbs')}
              error={errors.carbs}
              keyboardType="number-pad"
            />
          </View>
          <View style={styles.half}>
            <TextField
              label="Fat (g)"
              value={values.fat}
              onChangeText={set('fat')}
              error={errors.fat}
              keyboardType="number-pad"
            />
          </View>
        </View>

        <Button title="Save dish" icon="checkmark" loading={saving} onPress={submit} />
      </ScrollView>
    </SafeAreaView>
  );
}

/** A fresh empty form, for "Add dish". */
export const NEW_DISH_FORM = EMPTY_DISH_FORM;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  title: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  close: {
    width: minTapSize,
    height: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: { gap: spacing.md, padding: spacing.lg },
  section: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  pair: { flexDirection: 'row', gap: spacing.md },
  half: { flex: 1 },
});
