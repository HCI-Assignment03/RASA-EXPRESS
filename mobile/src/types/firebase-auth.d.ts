import type { Persistence } from 'firebase/auth';

// Firebase ships getReactNativePersistence in its React Native build, but the default
// type entry of "firebase/auth" leaves it out. This declares the type only; Metro still
// bundles the real function from the "react-native" build at runtime.
declare module 'firebase/auth' {
  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): Persistence;
}
