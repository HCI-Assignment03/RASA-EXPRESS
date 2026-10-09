import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { FoodPlate } from '@/components/food-plate';
import { QuantityStepper } from '@/components/quantity-stepper';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { useCart } from '@/hooks/use-cart';
import { useLayout } from '@/hooks/use-layout';
import { useCook } from '@/hooks/use-cooks';
import { useDish } from '@/hooks/use-dishes';
import type { Nutrition } from '@/types';
import { isSoldOut } from '@/utils/dish';
import { formatPrice } from '@/utils/format';
import { CONTENT_MAX_WIDTH } from '@/utils/layout';

const NOTE_MAX_LENGTH = 120;

// C4 Dish details.
// Create: add the dish to the cart with a note to the cook. Read: ingredients, allergens, nutrition.
// Update: change the quantity or the note of a dish that is already in the cart.
export default function DishDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { short } = useLayout();
  const toast = useToast();

  const { dish, loading, error, reload } = useDish(id);
  const cart = useCart();

  // null means "the customer has not touched it", so the screen shows what is already in the cart.
  const [chosenQty, setChosenQty] = useState<number | null>(null);
  const [chosenNote, setChosenNote] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !dish) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.statusText}>{error || 'This dish could not be found.'}</Text>
        {error ? <Button title="Try again" icon="refresh" onPress={reload} /> : null}
        <Button title="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const soldOut = isSoldOut(dish);
  const inCart = cart.cart?.items.find((item) => item.dishId === dish.id);
  const qty = Math.min(chosenQty ?? inCart?.qty ?? 1, Math.max(dish.portionsLeft, 1));
  const note = chosenNote ?? inCart?.note ?? '';

  const finish = (message: string) => {
    toast.show(message, 'success');
    router.back();
  };

  const failed = () => toast.show('Could not update your cart. Try again.', 'error');

  const addToCart = async () => {
    setSaving(true);
    try {
      await cart.add(dish, qty, note.trim());
      finish('Added to your cart');
    } catch {
      failed();
    } finally {
      setSaving(false);
    }
  };

  const updateCart = async () => {
    setSaving(true);
    try {
      await cart.setQuantity(dish.id, qty, dish.portionsLeft);
      await cart.setNote(dish.id, note.trim());
      finish('Cart updated');
    } catch {
      failed();
    } finally {
      setSaving(false);
    }
  };

  // A cart holds one cook's dishes. Ask before throwing the old cart away (Milestone 02 issue U01).
  const onSubmit = () => {
    if (inCart) {
      updateCart();
      return;
    }
    if (cart.cart && cart.cart.cookId !== dish.cookId) {
      Alert.alert(
        'Start a new order?',
        'Your cart has dishes from another cook. Adding this dish will clear it.',
        [
          { text: 'Keep my cart', style: 'cancel' },
          { text: 'Start new order', style: 'destructive', onPress: addToCart },
        ],
      );
      return;
    }
    addToCart();
  };

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.cover, { paddingTop: insets.top + spacing.lg }]}>
          <FoodPlate size={short ? 96 : 168} />
        </View>

        <View
          style={[
            styles.content,
            { paddingLeft: spacing.lg + insets.left, paddingRight: spacing.lg + insets.right },
          ]}
        >
          <Card style={styles.card}>
            <Text style={styles.name}>{dish.name}</Text>
            <CookLink cookId={dish.cookId} />
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(dish.price)}</Text>
              {soldOut ? (
                <Badge label="Sold out today" tone="neutral" />
              ) : (
                <Badge
                  label={`${dish.portionsLeft} portions left`}
                  tone={dish.portionsLeft <= 3 ? 'warning' : 'success'}
                  icon="restaurant-outline"
                />
              )}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <Text style={styles.body}>
              {dish.ingredients.length > 0
                ? dish.ingredients.join(', ')
                : 'The cook has not listed the ingredients.'}
            </Text>
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Allergens</Text>
            {dish.allergens.length > 0 ? (
              <View style={styles.badges}>
                {dish.allergens.map((allergen) => (
                  <Badge
                    key={allergen}
                    label={allergen}
                    tone="warning"
                    icon="alert-circle-outline"
                  />
                ))}
              </View>
            ) : (
              <Text style={styles.body}>No common allergens listed.</Text>
            )}
          </Card>

          <Card style={styles.card}>
            <Text style={styles.sectionTitle}>Nutrition per portion</Text>
            <NutritionGrid nutrition={dish.nutrition} />
          </Card>

          {!soldOut ? (
            <Card style={styles.card}>
              <Text style={styles.sectionTitle}>Your order</Text>
              <View style={styles.qtyRow}>
                <Text style={styles.body}>Quantity</Text>
                <QuantityStepper
                  value={qty}
                  min={1}
                  max={dish.portionsLeft}
                  onChange={setChosenQty}
                />
              </View>
              <Text style={styles.label}>Note to the cook (optional)</Text>
              <TextInput
                accessibilityLabel="Note to the cook"
                value={note}
                onChangeText={setChosenNote}
                placeholder="For example: less spicy, no onions"
                placeholderTextColor={colors.textMuted}
                maxLength={NOTE_MAX_LENGTH}
                multiline
                style={styles.noteInput}
              />
              <Text style={styles.counter}>
                {note.length} / {NOTE_MAX_LENGTH}
              </Text>
            </Card>
          ) : null}
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={[styles.back, { top: insets.top + spacing.sm, left: spacing.lg + insets.left }]}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + spacing.md,
            paddingLeft: spacing.lg + insets.left,
            paddingRight: spacing.lg + insets.right,
          },
        ]}
      >
        <View style={styles.bottomInner}>
          {soldOut ? (
            <Button title="Sold out today" disabled onPress={() => {}} />
          ) : (
            <Button
              title={`${inCart ? 'Update cart' : 'Add to cart'} · ${formatPrice(dish.price * qty)}`}
              icon={inCart ? 'checkmark' : 'cart-outline'}
              loading={saving}
              onPress={onSubmit}
            />
          )}
        </View>
      </View>
    </View>
  );
}

/** "By Bhanuka's Kitchen", tapping it opens the cook's profile. */
function CookLink({ cookId }: { cookId: string }) {
  const { cook } = useCook(cookId);
  if (!cook) return null;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Cook ${cook.displayName}. Open profile`}
      onPress={() => router.push({ pathname: '/customer/cook/[id]', params: { id: cookId } })}
      style={styles.cookLink}
    >
      <Ionicons name="person-circle-outline" size={20} color={colors.primaryDark} />
      <Text style={styles.cookName}>By {cook.displayName}</Text>
    </Pressable>
  );
}

function NutritionGrid({ nutrition }: { nutrition: Nutrition }) {
  const cells = [
    { label: 'Calories', value: `${nutrition.kcal} kcal` },
    { label: 'Protein', value: `${nutrition.protein} g` },
    { label: 'Carbs', value: `${nutrition.carbs} g` },
    { label: 'Fat', value: `${nutrition.fat} g` },
  ];
  return (
    <View style={styles.grid}>
      {cells.map((cell) => (
        <View key={cell.label} style={styles.cell}>
          <Text style={styles.cellValue}>{cell.value}</Text>
          <Text style={styles.cellLabel}>{cell.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  statusText: { fontSize: fontSize.body, color: colors.textMuted, textAlign: 'center' },
  cover: {
    alignItems: 'center',
    paddingBottom: spacing.xxl + spacing.lg,
    backgroundColor: colors.coverPeach,
  },
  // A centred column on tablets and in landscape; the side padding (with the notch) is set inline.
  content: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH,
    alignSelf: 'center',
    gap: spacing.md,
    marginTop: -spacing.xl,
  },
  card: { gap: spacing.sm },
  name: { fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  cookLink: {
    minHeight: minTapSize,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  cookName: { fontSize: fontSize.body, fontWeight: '600', color: colors.primaryDark },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  price: { fontSize: fontSize.heading, fontWeight: '800', color: colors.primaryDark },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  cell: {
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    gap: 2,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceMuted,
  },
  cellValue: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.text },
  cellLabel: { fontSize: fontSize.caption, color: colors.textMuted },
  qtyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: fontSize.caption, fontWeight: '600', color: colors.textMuted },
  noteInput: {
    minHeight: 72,
    padding: spacing.md,
    textAlignVertical: 'top',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    fontSize: fontSize.body,
    color: colors.text,
  },
  counter: { alignSelf: 'flex-end', fontSize: fontSize.caption, color: colors.textMuted },
  back: {
    position: 'absolute',
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  bottomInner: { width: '100%', maxWidth: CONTENT_MAX_WIDTH, alignSelf: 'center' },
});
