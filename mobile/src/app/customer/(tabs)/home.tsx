import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { useToast } from '@/components/toast';
import { colors, fontSize, minTapSize, radius, spacing } from '@/constants/theme';
import { CookCard } from '@/features/customer/cook-card';
import {
  NO_FILTERS,
  TOP_RATED_MIN,
  filterCooks,
  suggestRelaxations,
  type DiscoverFilters,
} from '@/features/customer/discover';
import { FilterChip } from '@/features/customer/filter-chip';
import { SearchBar } from '@/features/customer/search-bar';
import { useCart } from '@/hooks/use-cart';
import { useCooks } from '@/hooks/use-cooks';
import { useDishes } from '@/hooks/use-dishes';
import { useFavourites } from '@/hooks/use-favourites';

// C2 Discover cooks. Read: list, search and filter cooks. Create / Delete: the favourite heart.
export default function DiscoverCooksScreen() {
  const toast = useToast();
  const { cooks, loading, error, reload } = useCooks();
  // Search also looks at dish names, so every dish is loaded (the data set is small).
  const { dishes } = useDishes(null);
  const { favouriteIds, toggle } = useFavourites();
  const cart = useCart();
  const [filters, setFilters] = useState<DiscoverFilters>(NO_FILTERS);

  const results = filterCooks(cooks, dishes, filters);
  const filtersActive = JSON.stringify(filters) !== JSON.stringify(NO_FILTERS);

  const flip = (key: 'verifiedOnly' | 'topRated' | 'preorder') =>
    setFilters((current) => ({ ...current, [key]: !current[key] }));

  const openCook = (cookId: string) =>
    router.push({ pathname: '/customer/cook/[id]', params: { id: cookId } });

  const toggleSaved = (cookId: string) => {
    toggle(cookId).catch(() => toast.show('Could not update your favourites', 'error'));
  };

  return (
    <Screen scroll>
      <View style={styles.header}>
        <View>
          <Text style={styles.deliverTo}>Deliver to</Text>
          <View style={styles.location}>
            <Ionicons name="location" size={20} color={colors.primary} />
            <Text style={styles.locationText}>Galle Fort</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              cart.count > 0 ? `Your cart, ${cart.count} items` : 'Your cart is empty'
            }
            onPress={() => router.push('/customer/checkout')}
            style={styles.bell}
          >
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {cart.count > 0 ? (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cart.count}</Text>
              </View>
            ) : null}
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Favourites and alerts"
            onPress={() => router.push('/customer/favourites')}
            style={styles.bell}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <SearchBar
        value={filters.query}
        onChangeText={(query) => setFilters((current) => ({ ...current, query }))}
        placeholder="Search cooks or dishes"
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.chips}
      >
        <FilterChip
          label="Verified only"
          icon="shield-checkmark-outline"
          selected={filters.verifiedOnly}
          onPress={() => flip('verifiedOnly')}
        />
        <FilterChip
          label={`Top rated ${TOP_RATED_MIN}+`}
          icon="star-outline"
          selected={filters.topRated}
          onPress={() => flip('topRated')}
        />
        <FilterChip
          label="Pre-order"
          icon="calendar-outline"
          selected={filters.preorder}
          onPress={() => flip('preorder')}
        />
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Plan ahead, eat well. Show cooks that take pre-orders"
        onPress={() => setFilters((current) => ({ ...current, preorder: true }))}
        style={styles.banner}
      >
        <View style={styles.bannerText}>
          <Text style={styles.bannerTitle}>Plan ahead, eat well</Text>
          <Text style={styles.bannerBody}>Pre-order Sunday lunch packets before 6 PM Saturday</Text>
        </View>
        <Ionicons name="calendar-outline" size={36} color={colors.onPrimary} />
      </Pressable>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Cooks near you</Text>
        {!loading && !error ? (
          <Text style={styles.count}>
            {results.length} {results.length === 1 ? 'cook' : 'cooks'}
          </Text>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
      ) : null}

      {error ? (
        <Card style={styles.message}>
          <Text style={styles.messageText}>{error}</Text>
          <Button title="Try again" icon="refresh" onPress={reload} />
        </Card>
      ) : null}

      {!loading && !error && results.length === 0 ? (
        <EmptyResults
          noCooksAtAll={cooks.length === 0}
          filters={filters}
          suggestions={suggestRelaxations(cooks, dishes, filters)}
          filtersActive={filtersActive}
          onRemove={(key) => setFilters((current) => ({ ...current, [key]: NO_FILTERS[key] }))}
          onClearAll={() => setFilters(NO_FILTERS)}
        />
      ) : null}

      {results.map((cook) => (
        <CookCard
          key={cook.id}
          cook={cook}
          saved={favouriteIds.has(cook.id)}
          onPress={() => openCook(cook.id)}
          onToggleSaved={() => toggleSaved(cook.id)}
        />
      ))}
    </Screen>
  );
}

type EmptyProps = {
  noCooksAtAll: boolean;
  filters: DiscoverFilters;
  suggestions: ReturnType<typeof suggestRelaxations>;
  filtersActive: boolean;
  onRemove: (key: keyof DiscoverFilters) => void;
  onClearAll: () => void;
};

/** No cooks match: say which filter to remove and how many cooks that would bring back (U09). */
function EmptyResults({
  noCooksAtAll,
  suggestions,
  filtersActive,
  onRemove,
  onClearAll,
}: EmptyProps) {
  if (noCooksAtAll) {
    return (
      <Card style={styles.message}>
        <Text style={styles.messageText}>No cooks have joined yet. Please check back soon.</Text>
      </Card>
    );
  }

  return (
    <Card style={styles.message}>
      <Text style={styles.messageTitle}>No cooks match</Text>
      <Text style={styles.messageText}>Try removing one of these:</Text>
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion.key}
          variant="secondary"
          title={`Remove ${suggestion.label} (${suggestion.count} ${suggestion.count === 1 ? 'cook' : 'cooks'})`}
          onPress={() => onRemove(suggestion.key)}
        />
      ))}
      {filtersActive ? (
        <Button variant="ghost" title="Clear all filters" onPress={onClearAll} />
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  deliverTo: { fontSize: fontSize.caption, color: colors.textMuted },
  location: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  locationText: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  headerButtons: { flexDirection: 'row', gap: spacing.sm },
  bell: {
    width: minTapSize,
    height: minTapSize,
    borderRadius: minTapSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 24,
    height: 24,
    paddingHorizontal: spacing.xs,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  cartBadgeText: { fontSize: fontSize.caption, fontWeight: '800', color: colors.onPrimary },
  chips: { gap: spacing.sm, paddingRight: spacing.lg },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
  },
  bannerText: { flex: 1, gap: spacing.xs },
  bannerTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.onPrimary },
  bannerBody: { fontSize: fontSize.caption, color: colors.onPrimary },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  sectionTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  count: { fontSize: fontSize.caption, color: colors.textMuted },
  loader: { paddingVertical: spacing.xl },
  message: { gap: spacing.md },
  messageTitle: { fontSize: fontSize.subtitle, fontWeight: '700', color: colors.text },
  messageText: { fontSize: fontSize.body, color: colors.textMuted },
});
