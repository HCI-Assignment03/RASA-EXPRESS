import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { FoodPlate } from '@/components/food-plate';
import { StarRating } from '@/components/star-rating';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { DishRow } from '@/features/customer/dish-row';
import { ReviewCard } from '@/features/customer/review-card';
import { useCart } from '@/hooks/use-cart';
import { useCook } from '@/hooks/use-cooks';
import { useDishes } from '@/hooks/use-dishes';
import { useFavourites } from '@/hooks/use-favourites';
import { useLayout } from '@/hooks/use-layout';
import { useCookReviews } from '@/hooks/use-reviews';
import type { Cook, Dish, WithId } from '@/types';
import { sortMenu } from '@/utils/dish';
import { formatPrice } from '@/utils/format';
import { CONTENT_MAX_WIDTH } from '@/utils/layout';

type Tab = 'menu' | 'reviews' | 'about';

// C3 Cook profile & menu.
// Create: add a dish to the cart. Read: menu, hygiene, reviews. Update: cart quantity (stepper).
// Delete: remove a dish from the cart (stepper down to 0).
export default function CookProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { short } = useLayout();
  const toast = useToast();

  const { cook, loading, error, reload } = useCook(id);
  const menu = useDishes(id);
  const reviews = useCookReviews(id);
  const { favouriteIds, toggle } = useFavourites();
  const cart = useCart();
  const [tab, setTab] = useState<Tab>('menu');

  const cartFailed = () => toast.show('Could not update your cart. Try again.', 'error');

  const addDish = (dish: WithId<Dish>) => {
    cart.add(dish).catch(cartFailed);
  };

  // A cart holds one cook's dishes. Ask before throwing the old cart away (Milestone 02 issue U01).
  const requestAdd = (dish: WithId<Dish>) => {
    if (cart.cart && cart.cart.cookId !== dish.cookId) {
      Alert.alert(
        'Start a new order?',
        'Your cart has dishes from another cook. Adding this dish will clear it.',
        [
          { text: 'Keep my cart', style: 'cancel' },
          { text: 'Start new order', style: 'destructive', onPress: () => addDish(dish) },
        ],
      );
      return;
    }
    addDish(dish);
  };

  const changeQuantity = (dish: WithId<Dish>, next: number) => {
    cart.setQuantity(dish.id, next, dish.portionsLeft).catch(cartFailed);
  };

  const openDish = (dishId: string) =>
    router.push({ pathname: '/customer/dish/[id]', params: { id: dishId } });

  const toggleSaved = () => {
    toggle(id).catch(() => toast.show('Could not update your favourites', 'error'));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !cook) {
    return (
      <View style={[styles.centered, { paddingTop: insets.top }]}>
        <Text style={styles.statusText}>{error || 'This cook could not be found.'}</Text>
        {error ? <Button title="Try again" icon="refresh" onPress={reload} /> : null}
        <Button title="Go back" variant="ghost" onPress={() => router.back()} />
      </View>
    );
  }

  const saved = favouriteIds.has(cook.id);

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.cover, { paddingTop: insets.top + spacing.lg }]}>
          <FoodPlate size={short ? 88 : 132} />
        </View>

        <View
          style={[
            styles.content,
            { paddingLeft: spacing.lg + insets.left, paddingRight: spacing.lg + insets.right },
          ]}
        >
          <CookInfo cook={cook} />
          <TabBar value={tab} onChange={setTab} />

          {tab === 'menu' ? (
            <MenuTab
              state={menu}
              quantityOf={cart.quantityOf}
              onAdd={requestAdd}
              onChangeQuantity={changeQuantity}
              onOpen={openDish}
            />
          ) : null}
          {tab === 'reviews' ? <ReviewsTab cook={cook} state={reviews} /> : null}
          {tab === 'about' ? <AboutTab cook={cook} /> : null}
        </View>
      </ScrollView>

      <View
        style={[
          styles.topButtons,
          {
            top: insets.top + spacing.sm,
            left: spacing.lg + insets.left,
            right: spacing.lg + insets.right,
          },
        ]}
        pointerEvents="box-none"
      >
        <RoundButton icon="arrow-back" label="Go back" onPress={() => router.back()} />
        <RoundButton
          icon={saved ? 'heart' : 'heart-outline'}
          label={saved ? 'Remove from favourites' : 'Save to favourites'}
          color={saved ? colors.danger : colors.text}
          onPress={toggleSaved}
        />
      </View>

      {cart.count > 0 ? (
        <View
          pointerEvents="box-none"
          style={[
            styles.cartRow,
            {
              bottom: insets.bottom + spacing.md,
              paddingLeft: spacing.lg + insets.left,
              paddingRight: spacing.lg + insets.right,
            },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`View cart, ${cart.count} items, ${formatPrice(cart.total)}`}
            onPress={() => router.push('/customer/checkout')}
            style={styles.cartBar}
          >
            <View style={styles.cartCount}>
              <Ionicons name="cart-outline" size={20} color={colors.primaryDark} />
              <Text style={styles.cartCountText}>{cart.count}</Text>
            </View>
            <Text style={styles.cartLabel}>View cart</Text>
            <Text style={styles.cartTotal}>{formatPrice(cart.total)}</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

function RoundButton({
  icon,
  label,
  onPress,
  color = colors.text,
}: {
  icon: 'arrow-back' | 'heart' | 'heart-outline';
  label: string;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={styles.round}
    >
      <Ionicons name={icon} size={22} color={color} />
    </Pressable>
  );
}

function CookInfo({ cook }: { cook: WithId<Cook> }) {
  return (
    <Card style={styles.info}>
      <View style={styles.titleRow}>
        <Text style={styles.name}>{cook.displayName}</Text>
        {cook.verified ? (
          <Badge label="Verified" tone="success" icon="shield-checkmark-outline" />
        ) : null}
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="star" size={16} color="#F5B301" />
        <Text style={styles.rating}>{cook.rating.toFixed(1)}</Text>
        <Text style={styles.muted}>
          ({cook.reviewCount} reviews) · {cook.distanceKm.toFixed(1)} km · {cook.etaMin}–
          {cook.etaMax} min
        </Text>
      </View>
      <View style={styles.badges}>
        <Badge
          label={`Hygiene ${cook.hygieneScore.toFixed(1)} / 5`}
          tone="success"
          icon="shield-checkmark"
        />
        {cook.acceptsPreorder ? (
          <Badge label="Accepts pre-orders" tone="primary" icon="calendar-outline" />
        ) : null}
        <Badge label="COD" tone="neutral" icon="cash-outline" />
      </View>
    </Card>
  );
}

function TabBar({ value, onChange }: { value: Tab; onChange: (tab: Tab) => void }) {
  const tabs: { key: Tab; label: string }[] = [
    { key: 'menu', label: 'Menu' },
    { key: 'reviews', label: 'Reviews' },
    { key: 'about', label: 'About' },
  ];
  return (
    <View style={styles.tabs} accessibilityRole="tablist">
      {tabs.map(({ key, label }) => {
        const selected = key === value;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange(key)}
            style={[styles.tab, selected && styles.tabSelected]}
          >
            <Text style={[styles.tabLabel, selected && styles.tabLabelSelected]}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type MenuState = ReturnType<typeof useDishes>;

function MenuTab({
  state,
  quantityOf,
  onAdd,
  onChangeQuantity,
  onOpen,
}: {
  state: MenuState;
  quantityOf: (dishId: string) => number;
  onAdd: (dish: WithId<Dish>) => void;
  onChangeQuantity: (dish: WithId<Dish>, next: number) => void;
  onOpen: (dishId: string) => void;
}) {
  if (state.loading) return <Loading />;
  if (state.error) {
    return (
      <Message text={state.error}>
        <Button title="Try again" icon="refresh" onPress={state.reload} />
      </Message>
    );
  }
  if (state.dishes.length === 0) {
    return <Message text="This cook has not added any dishes yet." />;
  }

  return (
    <View style={styles.list}>
      {sortMenu(state.dishes).map((dish) => (
        <DishRow
          key={dish.id}
          dish={dish}
          quantity={quantityOf(dish.id)}
          onPress={() => onOpen(dish.id)}
          onAdd={() => onAdd(dish)}
          onChangeQuantity={(next) => onChangeQuantity(dish, next)}
        />
      ))}
    </View>
  );
}

function ReviewsTab({
  cook,
  state,
}: {
  cook: WithId<Cook>;
  state: ReturnType<typeof useCookReviews>;
}) {
  return (
    <View style={styles.list}>
      <Card style={styles.summary}>
        <Text style={styles.bigRating}>{cook.rating.toFixed(1)}</Text>
        <View style={styles.summaryText}>
          <StarRating value={cook.rating} size={20} />
          <Text style={styles.muted}>{cook.reviewCount} ratings</Text>
        </View>
      </Card>

      {state.loading ? <Loading /> : null}
      {state.error ? <Message text={state.error} /> : null}
      {!state.loading && !state.error && state.reviews.length === 0 ? (
        <Message text="No reviews yet. Be the first to order and rate this cook." />
      ) : null}
      {state.reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </View>
  );
}

function AboutTab({ cook }: { cook: WithId<Cook> }) {
  return (
    <View style={styles.list}>
      <Card style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>About {cook.displayName}</Text>
        <Text style={styles.body}>{cook.bio || 'This cook has not added a description yet.'}</Text>
      </Card>
      <Card style={styles.aboutCard}>
        <Text style={styles.sectionTitle}>Good to know</Text>
        <InfoRow label="Area" value={cook.area || 'Not set'} />
        <InfoRow label="Delivery time" value={`${cook.etaMin}–${cook.etaMax} min`} />
        <InfoRow label="Distance" value={`${cook.distanceKm.toFixed(1)} km`} />
        <InfoRow label="Hygiene score" value={`${cook.hygieneScore.toFixed(1)} out of 5`} />
        <InfoRow
          label="Pre-orders"
          value={
            cook.acceptsPreorder
              ? `Accepted. Same-day orders close at ${cook.cutoffTime}`
              : 'Not accepted'
          }
        />
        <InfoRow label="Payment" value="Cash on delivery" />
      </Card>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function Loading() {
  return <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />;
}

function Message({ text, children }: { text: string; children?: ReactNode }) {
  return (
    <Card style={styles.message}>
      <Text style={styles.body}>{text}</Text>
      {children}
    </Card>
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
  topButtons: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  round: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  info: { gap: spacing.sm },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  name: { flex: 1, fontSize: fontSize.title, fontWeight: '800', color: colors.text },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.xs },
  rating: { fontSize: fontSize.body, fontWeight: '700', color: colors.text },
  muted: { fontSize: fontSize.caption, color: colors.textMuted },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab: {
    flex: 1,
    minHeight: minTapSize,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabSelected: { borderBottomColor: colors.primary },
  tabLabel: { fontSize: fontSize.body, fontWeight: '600', color: colors.textMuted },
  tabLabelSelected: { color: colors.primaryDark },
  list: { gap: spacing.md },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  body: { fontSize: fontSize.body, color: colors.text },
  summary: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  bigRating: { fontSize: 44, fontWeight: '800', color: colors.text },
  summaryText: { gap: spacing.xs },
  aboutCard: { gap: spacing.sm },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.lg },
  infoLabel: { fontSize: fontSize.body, color: colors.textMuted },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontSize: fontSize.body,
    fontWeight: '600',
    color: colors.text,
  },
  // Full-width row that centres the cart bar, so it keeps a phone-like width on tablets.
  cartRow: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  cartBar: {
    width: '100%',
    maxWidth: CONTENT_MAX_WIDTH - spacing.lg * 2,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  cartCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  cartCountText: { fontSize: fontSize.body, fontWeight: '800', color: colors.primaryDark },
  cartLabel: { flex: 1, fontSize: fontSize.body, fontWeight: '700', color: colors.onPrimary },
  cartTotal: { fontSize: fontSize.body, fontWeight: '800', color: colors.onPrimary },
});
