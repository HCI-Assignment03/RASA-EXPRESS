import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { AccountPanel } from '@/components/account-panel';
import { Screen } from '@/components/screen';
import { colors, spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { KitchenCard } from '@/features/account/kitchen-card';
import { LinkList } from '@/features/account/link-list';
import { StatTiles } from '@/features/account/stat-tiles';
import { KitchenForm } from '@/features/auth/kitchen-form';
import { useCookOrders } from '@/hooks/use-cook-orders';
import { useCook } from '@/hooks/use-cooks';
import { useDishes } from '@/hooks/use-dishes';
import { useSales } from '@/hooks/use-sales';
import { isSoldOut } from '@/utils/dish';

// Cook More tab: the account (C1), the cook page with its kitchen details, today's numbers and
// shortcuts to the cook's other tabs.
export default function CookMoreScreen() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const { cook, loading } = useCook(uid);
  const { counts } = useCookOrders();
  const sales = useSales();
  const { dishes } = useDishes(uid);
  const [editingKitchen, setEditingKitchen] = useState(false);

  if (editingKitchen && cook) {
    return (
      <Screen scroll>
        <KitchenForm cook={cook} onDone={() => setEditingKitchen(false)} />
      </Screen>
    );
  }

  const onSale = dishes.filter((dish) => !isSoldOut(dish)).length;
  const soldOut = dishes.length - onSale;
  const toConfirm = sales.pendingOrders.length;

  return (
    <Screen scroll>
      <AccountPanel>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : cook ? (
          <KitchenCard cook={cook} onEdit={() => setEditingKitchen(true)} />
        ) : null}

        <StatTiles
          items={[
            {
              icon: 'cash-outline',
              value: sales.todayTotal.toLocaleString('en-US'),
              label: "Today's sales (Rs.)",
              tone: 'success',
            },
            {
              icon: 'receipt-outline',
              value: String(counts.new),
              label: 'New orders',
              tone: 'primary',
            },
            {
              icon: 'restaurant-outline',
              value: `${onSale}/${dishes.length}`,
              label: 'Dishes on sale',
              tone: 'warning',
            },
          ]}
        />

        <LinkList
          title="Your kitchen"
          items={[
            {
              icon: 'receipt-outline',
              label: 'Orders',
              detail: `${counts.new} new · ${counts.preparing} preparing · ${counts.ready} ready`,
              count: counts.new,
              onPress: () => router.navigate('/cook/orders'),
            },
            {
              icon: 'restaurant-outline',
              label: 'Menu',
              detail: soldOut > 0 ? `${soldOut} sold out today` : 'Everything is on sale',
              tone: 'warning',
              onPress: () => router.navigate('/cook/menu'),
            },
            {
              icon: 'stats-chart-outline',
              label: 'Sales & payments',
              detail: toConfirm > 0 ? `${toConfirm} payments to confirm` : 'All payments confirmed',
              count: toConfirm,
              tone: 'success',
              onPress: () => router.navigate('/cook/sales'),
            },
          ]}
        />
      </AccountPanel>
    </Screen>
  );
}

const styles = StyleSheet.create({
  loader: { paddingVertical: spacing.lg },
});
