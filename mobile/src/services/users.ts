import { deleteDoc, doc, getDoc, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';

import type { Cook, Language, Role, UserProfile, WithId } from '@/types';

import { db } from './firebase';

export type NewUserInput = {
  name: string;
  email: string;
  phone: string;
  role: Role;
  language?: Language;
};

/** Fields a user may change from the profile screen (C1). */
export type ProfilePatch = Partial<Pick<UserProfile, 'name' | 'phone' | 'language'>>;

const userRef = (uid: string) => doc(db, 'users', uid);
const cookRef = (uid: string) => doc(db, 'cooks', uid);

/**
 * Create: writes users/{uid}. A cook also gets a starter cooks/{uid} document
 * so the cook screens and the customer discovery list have something to read.
 */
export async function createUserProfile(uid: string, input: NewUserInput): Promise<void> {
  const batch = writeBatch(db);

  batch.set(userRef(uid), {
    name: input.name,
    email: input.email,
    phone: input.phone,
    role: input.role,
    language: input.language ?? 'en',
    createdAt: serverTimestamp(),
  });

  if (input.role === 'cook') {
    const starterCook: Cook = {
      displayName: input.name,
      bio: '',
      area: '',
      verified: false,
      rating: 0,
      reviewCount: 0,
      hygieneScore: 0,
      acceptsPreorder: false,
      cutoffTime: '18:00',
      tags: [],
      etaMin: 30,
      etaMax: 45,
      distanceKm: 0,
    };
    batch.set(cookRef(uid), starterCook);
  }

  await batch.commit();
}

/** Read: one profile, or null if the document does not exist. */
export async function getUserProfile(uid: string): Promise<WithId<UserProfile> | null> {
  const snap = await getDoc(userRef(uid));
  return snap.exists() ? { id: snap.id, ...(snap.data() as UserProfile) } : null;
}

/** Update: name, phone or language. */
export async function updateUserProfile(uid: string, patch: ProfilePatch): Promise<void> {
  await updateDoc(userRef(uid), patch);
}

/** Delete: removes users/{uid} and, for cooks, cooks/{uid}. */
export async function deleteUserProfile(uid: string, role: Role): Promise<void> {
  await deleteDoc(userRef(uid));
  if (role === 'cook') {
    await deleteDoc(cookRef(uid));
  }
}
