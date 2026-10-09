import { Tabs } from 'expo-router';

import { tabIcon, useTabScreenOptions } from '@/components/tab-options';
import { useCookOrders } from '@/hooks/use-cook-orders';

export default function CookTabsLayout() {
  const screenOptions = useTabScreenOptions();
  // New orders waiting for the cook to accept them show as a badge, on every tab (NFR08).
  const { counts } = useCookOrders();

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: tabIcon('receipt', 'receipt-outline'),
          tabBarBadge: counts.new > 0 ? counts.new : undefined,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{ title: 'Menu', tabBarIcon: tabIcon('restaurant', 'restaurant-outline') }}
      />
      <Tabs.Screen
        name="sales"
        options={{ title: 'Sales', tabBarIcon: tabIcon('stats-chart', 'stats-chart-outline') }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
          tabBarIcon: tabIcon('ellipsis-horizontal', 'ellipsis-horizontal-outline'),
        }}
      />
    </Tabs>
  );
}
