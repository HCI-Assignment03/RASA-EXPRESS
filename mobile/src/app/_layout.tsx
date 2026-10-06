import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { ToastProvider } from '@/components/toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Keep the splash screen up until Firebase has restored the session.
SplashScreen.preventAutoHideAsync();

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
