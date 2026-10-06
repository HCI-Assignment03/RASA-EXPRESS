import { Stack } from 'expo-router';

// Stack so detail screens (cook profile, dish, checkout, tracking, review) open above the tabs.
export default function CustomerLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
