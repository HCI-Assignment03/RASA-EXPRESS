import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { auth, db } from '@/services/firebase';
import {
  createUserProfile,
  deleteUserProfile,
  updateUserProfile,
  type NewUserInput,
  type ProfilePatch,
} from '@/services/users';
import type { UserProfile, WithId } from '@/types';

/**
 * loading       Firebase is still restoring the session or loading the profile.
 * signedOut     Nobody is signed in.
 * needsProfile  Signed in, but users/{uid} is missing (an interrupted sign-up).
 * ready         Signed in and the profile (with its role) is loaded.
 */
export type AuthStatus = 'loading' | 'signedOut' | 'needsProfile' | 'ready';

export type RegisterInput = NewUserInput & { password: string };

type AuthContextValue = {
  status: AuthStatus;
  /** The Firebase Auth user, or null. */
  user: User | null;
  /** The Firestore profile. Set when status is "ready". */
  profile: WithId<UserProfile> | null;
  /** C1 Create: new account plus profile. */
  register: (input: RegisterInput) => Promise<void>;
  /** C1 Read: sign in with email and password. */
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  /** C1 Update: name, phone or language. */
  updateProfile: (patch: ProfilePatch) => Promise<void>;
  /** C1 Delete: removes the profile and the account. Needs the password to re-confirm. */
  deleteAccount: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<WithId<UserProfile> | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  // While register() runs, the account exists a moment before its profile does.
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    let stopProfileListener: (() => void) | undefined;

    const stopAuthListener = onAuthStateChanged(auth, (nextUser) => {
      stopProfileListener?.();
      stopProfileListener = undefined;

      setUser(nextUser);
      setAuthLoaded(true);

      if (!nextUser) {
        setProfile(null);
        setProfileLoaded(true);
        return;
      }

      setProfileLoaded(false);
      stopProfileListener = onSnapshot(
        doc(db, 'users', nextUser.uid),
        (snap) => {
          setProfile(snap.exists() ? { id: snap.id, ...(snap.data() as UserProfile) } : null);
          setProfileLoaded(true);
        },
        (error) => {
          console.warn('Could not load profile:', error.message);
          setProfile(null);
          setProfileLoaded(true);
        },
      );
    });

    return () => {
      stopProfileListener?.();
      stopAuthListener();
    };
  }, []);

  let status: AuthStatus;
  if (!authLoaded || (user && !profileLoaded)) {
    status = 'loading';
  } else if (!user) {
    status = 'signedOut';
  } else if (profile) {
    status = 'ready';
  } else {
    status = registering ? 'loading' : 'needsProfile';
  }

  const register = async ({ password, ...input }: RegisterInput) => {
    setRegistering(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, input.email, password);
      try {
        await createUserProfile(credential.user.uid, input);
      } catch (error) {
        // Do not leave an account without a profile behind.
        await deleteUser(credential.user).catch(() => undefined);
        throw error;
      }
    } finally {
      setRegistering(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const updateProfile = async (patch: ProfilePatch) => {
    if (!user) throw new Error('Not signed in');
    await updateUserProfile(user.uid, patch);
  };

  const deleteAccount = async (password: string) => {
    if (!user || !profile || !user.email) throw new Error('Not signed in');
    // Firebase only deletes an account that signed in recently, so confirm the password first.
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, password));
    await deleteUserProfile(user.uid, profile.role);
    await deleteUser(user);
  };

  return (
    <AuthContext.Provider
      value={{ status, user, profile, register, signIn, signOut, updateProfile, deleteAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside <AuthProvider>');
  return value;
}
