import { Tabs } from 'expo-router';

import { tabIcon, tabScreenOptions } from '@/components/tab-options';

export default function CustomerTabsLayout() {
  return (
    <Tabs screenOptions={tabScreenOptions}>
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: tabIcon('home', 'home-outline') }}
      />
      <Tabs.Screen
        name="favourites"
        options={{ title: 'Favourites', tabBarIcon: tabIcon('heart', 'heart-outline') }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: tabIcon('receipt', 'receipt-outline') }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: tabIcon('person', 'person-outline') }}
      />
    </Tabs>
  );
}
