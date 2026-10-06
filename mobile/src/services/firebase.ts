import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

// EXPO_PUBLIC_* variables are inlined at build time, so each must be written out in full.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missing = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missing.length > 0) {
  throw new Error(
    `Firebase config missing: ${missing.join(', ')}. ` +
      'Copy config/env.example to mobile/.env, fill it in, then restart with: npx expo start -c',
  );
}

const isFirstInit = getApps().length === 0;
const app = isFirstInit ? initializeApp(firebaseConfig) : getApp();

// initializeAuth may only run once per app, and fast refresh re-runs this module,
// so later runs reuse the existing instance.
export const auth =
  isFirstInit && Platform.OS !== 'web'
    ? initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })
    : getAuth(app);

export const db = getFirestore(app);
