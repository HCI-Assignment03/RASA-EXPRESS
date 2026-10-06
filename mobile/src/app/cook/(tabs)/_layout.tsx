import { Tabs } from 'expo-router';

import { tabIcon, tabScreenOptions } from '@/components/tab-options';

export default function CookTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: tabIcon('receipt', 'receipt-outline') }}
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
