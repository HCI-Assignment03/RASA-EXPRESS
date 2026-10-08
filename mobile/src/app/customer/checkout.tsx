import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { TextField } from '@/components/text-field';
import { useToast } from '@/components/toast';
import { useAuth } from '@/context/AuthContext';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { CartLine } from '@/features/customer/cart-line';
import { OptionCard } from '@/features/customer/option-card';
import { useCart } from '@/hooks/use-cart';
import { useCook } from '@/hooks/use-cooks';
import { useDishes } from '@/hooks/use-dishes';
import { StockError, placeOrder, toOrderInput } from '@/services/orders';
import type { Cart, Cook, PaymentMethod, WithId } from '@/types';
import {
  PAYMENT_OPTIONS,
  TIME_SLOTS,
  scheduleOptions,
  validateCheckout,
  type CheckoutErrors,
} from '@/utils/checkout';
import { formatPrice } from '@/utils/format';

// C5 Checkout & payment.
// Read: cart summary. Create: place the order. Update: schedule, landmark, payment method and the
// quantities. Delete: remove a dish, or clear the cart.
export default function CheckoutScreen() {
  const cart = useCart();

  if (!cart.cart) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackRow title="Checkout" />
        <Card style={styles.card}>
          <Text style={styles.body}>Your cart is empty. Pick a cook and add a dish first.</Text>
          <Button
            title="Find cooks"
            icon="search"
            onPress={() => router.navigate('/customer/home')}
          />
        </Card>
      </Screen>
    );
  }

  return <CheckoutWithCook cart={cart.cart} />;
}

/** Loads the cook of the cart, then shows the form. Split off because the cook id must exist. */
function CheckoutWithCook({ cart }: { cart: Cart }) {
  const cartActions = useCart();
  const { cook, loading } = useCook(cart.cookId);

  if (loading) {
    return (
      <Screen edges={['top', 'bottom']}>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      </Screen>
    );
  }

  if (!cook) {
    return (
      <Screen edges={['top', 'bottom']}>
        <BackRow title="Checkout" />
        <Card style={styles.card}>
          <Text style={styles.body}>This cook is no longer available.</Text>
          <Button title="Clear cart" variant="danger" onPress={() => cartActions.clear()} />
        </Card>
      </Screen>
    );
  }

  return <CheckoutForm cart={cart} cook={cook} />;
}

function CheckoutForm({ cart, cook }: { cart: Cart; cook: WithId<Cook> }) {
  const toast = useToast();
  const { user } = useAuth();
  const cartActions = useCart();
  const menu = useDishes(cart.cookId);

  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [when, setWhen] = useState<'asap' | 'today' | 'tomorrow'>('asap');
  const [time, setTime] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('cash');
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [stockProblem, setStockProblem] = useState('');
  const [placing, setPlacing] = useState(false);

  const total = cart.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const options = scheduleOptions(cook, new Date());
  const maxFor = (dishId: string) =>
    menu.dishes.find((dish) => dish.id === dishId)?.portionsLeft ?? Number.POSITIVE_INFINITY;

  const changeQuantity = (dishId: string, next: number) => {
    cartActions
      .setQuantity(dishId, next, maxFor(dishId))
      .catch(() => toast.show('Could not update your cart. Try again.', 'error'));
  };

  const confirmClear = () => {
    Alert.alert('Clear your cart?', 'All dishes will be removed.', [
      { text: 'Keep', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          cartActions.clear().catch(() => toast.show('Could not clear the cart.', 'error'));
        },
      },
    ]);
  };

  const submit = async () => {
    if (!user) return;
    const form = {
      address,
      landmark,
      schedule: { when, time: when === 'asap' ? '' : time },
      paymentMethod: method,
    };
    const found = validateCheckout(form, cook, new Date());
    setErrors(found);
    setStockProblem('');
    if (Object.keys(found).length > 0) return;

    setPlacing(true);
    try {
      const orderId = await placeOrder(user.uid, toOrderInput(cart, form));
      toast.show('Order placed. The cook will confirm it shortly.', 'success');
      router.replace({ pathname: '/customer/track/[orderId]', params: { orderId } });
    } catch (error) {
      if (error instanceof StockError) setStockProblem(error.message);
      else toast.show('Could not place the order. Check your connection and try again.', 'error');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <Screen scroll edges={['top', 'bottom']}>
      <BackRow title="Checkout" />

      <Card style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.section}>Your order from {cook.displayName}</Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear cart"
            onPress={confirmClear}
            style={styles.clear}
          >
            <Text style={styles.clearText}>Clear</Text>
          </Pressable>
        </View>
        {cart.items.map((item) => (
          <CartLine
            key={item.dishId}
            item={item}
            max={maxFor(item.dishId)}
            onChangeQuantity={(next) => changeQuantity(item.dishId, next)}
          />
        ))}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.total}>{formatPrice(total)}</Text>
        </View>
      </Card>

      {stockProblem ? (
        <View style={styles.problem}>
          <Ionicons name="alert-circle-outline" size={20} color={colors.danger} />
          <Text style={styles.problemText}>{stockProblem} Change your cart and try again.</Text>
        </View>
      ) : null}

      <Card style={styles.card}>
        <Text style={styles.section}>Delivery address</Text>
        <TextField
          label="Street address"
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            setErrors((e) => ({ ...e, address: undefined }));
          }}
          error={errors.address}
          placeholder="12 Lighthouse Street, Galle Fort"
        />
        <TextField
          label="Landmark (optional)"
          value={landmark}
          onChangeText={setLandmark}
          maxLength={80}
          placeholder="Opposite the Dutch Hospital"
        />
      </Card>

      <Card style={styles.card}>
        <Text style={styles.section}>When do you want it?</Text>
        {options.map((option) => (
          <OptionCard
            key={option.when}
            label={option.label}
            hint={option.reason}
            icon={option.when === 'asap' ? 'flash-outline' : 'calendar-outline'}
            selected={when === option.when}
            disabled={!option.enabled}
            onPress={() => {
              setWhen(option.when);
              setErrors((e) => ({ ...e, schedule: undefined }));
            }}
          />
        ))}
        {when !== 'asap' ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.slots}
          >
            {TIME_SLOTS.map((slot) => {
              const selected = slot === time;
              return (
                <Pressable
                  key={slot}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setTime(slot);
                    setErrors((e) => ({ ...e, schedule: undefined }));
                  }}
                  style={[styles.slot, selected && styles.slotSelected]}
                >
                  <Text style={[styles.slotText, selected && styles.slotTextSelected]}>{slot}</Text>
                </Pressable>
              );
            })}
          </ScrollView>
        ) : null}
        {errors.schedule ? <Text style={styles.error}>{errors.schedule}</Text> : null}
      </Card>

      <Card style={styles.card}>
        <Text style={styles.section}>How will you pay?</Text>
        {PAYMENT_OPTIONS.map((option) => (
          <OptionCard
            key={option.method}
            label={option.label}
            hint={option.hint}
            icon={option.icon}
            selected={method === option.method}
            onPress={() => setMethod(option.method)}
          />
        ))}
      </Card>

      <Button
        title={`Place order · ${formatPrice(total)}`}
        icon="checkmark"
        loading={placing}
        onPress={submit}
      />
    </Screen>
  );
}

function BackRow({ title }: { title: string }) {
  return (
    <View style={styles.topRow}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={() => router.back()}
        style={styles.back}
      >
        <Ionicons name="arrow-back" size={22} color={colors.text} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.xl },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: minTapSize, height: minTapSize, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: fontSize.heading, fontWeight: '800', color: colors.text },
  card: { gap: spacing.md },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  section: { flex: 1, fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  body: { fontSize: fontSize.body, color: colors.text },
  clear: { minHeight: minTapSize, justifyContent: 'center', paddingHorizontal: spacing.sm },
  clearText: { fontSize: fontSize.body, fontWeight: '600', color: colors.danger },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  total: { fontSize: fontSize.subtitle, fontWeight: '800', color: colors.primaryDark },
  problem: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.dangerSoft,
  },
  problemText: { flex: 1, fontSize: fontSize.body, color: colors.danger },
  slots: { gap: spacing.sm, paddingVertical: spacing.xs },
  slot: {
    minHeight: minTapSize,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  slotSelected: { borderColor: colors.primary, backgroundColor: colors.primary },
  slotText: { fontSize: fontSize.body, color: colors.text },
  slotTextSelected: { fontWeight: '700', color: colors.onPrimary },
  error: { fontSize: fontSize.caption, color: colors.danger },
});
