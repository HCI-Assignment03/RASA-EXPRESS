import { Stack } from 'expo-router';

// Stack so the order detail screen opens above the tabs.
export default function CookLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
