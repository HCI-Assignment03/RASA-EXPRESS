import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { LogBox } from 'react-native';

import { OfflineBanner } from '@/components/offline-banner';
import { ToastProvider } from '@/components/toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Keep the splash screen up until Firebase has restored the session.
SplashScreen.preventAutoHideAsync();

// After a reconnect, Firestore on React Native sometimes cannot read its "bloom filter" shortcut.
// It then re-runs the query in full, so the data stays correct: hide the yellow box it shows in
// Expo Go, so it does not distract during tests. (Development only; the APK shows no warnings.)
LogBox.ignoreLogs(['BloomFilter error']);

function RootNavigator() {
  const { status, profile } = useAuth();

  useEffect(() => {
    if (status !== 'loading') {
      SplashScreen.hideAsync();
    }
  }, [status]);

  // Each role can only enter its own screens; everyone else is sent back to "/" and redirected.
  const role = status === 'ready' ? profile?.role : undefined;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={status !== 'ready'}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Protected guard={role === 'customer'}>
          <Stack.Screen name="customer" />
        </Stack.Protected>
        <Stack.Protected guard={role === 'cook'}>
          <Stack.Screen name="cook" />
        </Stack.Protected>
        <Stack.Protected guard={role === 'rider'}>
          <Stack.Screen name="rider" />
        </Stack.Protected>
      </Stack>
      <OfflineBanner />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <RootNavigator />
      </ToastProvider>
    </AuthProvider>
  );
}
