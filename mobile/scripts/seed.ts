/**
 * Seeds the shared Firebase project with test accounts, cooks and dishes
 * taken from the Milestone 02 prototype, so every member tests against the same data.
 *
 *   cd mobile
 *   npm run seed
 *
 * Safe to run again: accounts are reused and documents are overwritten with the same ids.
 * Needs Node 22.18+ (or 24) and a filled-in mobile/.env. Email/Password sign-in must be
 * enabled and firebase/firestore.rules must be published in the Firebase console first.
 */
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  type Auth,
} from 'firebase/auth';
import {
  Timestamp,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
  type Firestore,
} from 'firebase/firestore';

import type { AppNotification, Cook, Dish, Order, Payment, Review, Role } from '../src/types';

// Test accounts for the shared development project only. Not real people.
const SEED_PASSWORD = 'Rasa@2026';

type SeedUser = {
  key: string;
  email: string;
  name: string;
  phone: string;
  role: Role;
  cook?: Cook;
  dishes?: Omit<Dish, 'cookId' | 'photoUrl'>[];
};

const NONE: string[] = [];

const SEED_USERS: SeedUser[] = [
  {
    key: 'kawya',
    email: 'kawya.customer@rasaexpress.test',
    name: 'Kawya A.',
    phone: '0771234567',
    role: 'customer',
  },
  {
    key: 'imasha',
    email: 'imasha.rider@rasaexpress.test',
    name: 'Imasha Lakshan',
    phone: '0772345678',
    role: 'rider',
  },
  {
    key: 'bhanuka',
    email: 'bhanuka.cook@rasaexpress.test',
    name: 'Bhanuka A.',
    phone: '0773456789',
    role: 'cook',
    cook: {
      displayName: "Bhanuka's Kitchen",
      bio: 'Home-cooked Sri Lankan rice and curry, made fresh every morning.',
      area: 'Galle Fort',
      verified: true,
      rating: 4.8,
      reviewCount: 126,
      hygieneScore: 4.9,
      acceptsPreorder: true,
      cutoffTime: '18:00',
      tags: ['Rice & Curry', 'Lunch packets'],
      etaMin: 30,
      etaMax: 40,
      distanceKm: 1.2,
    },
    dishes: [
      {
        name: 'Chicken Rice & Curry',
        price: 650,
        ingredients: ['Samba rice', 'Chicken', 'Coconut', 'Dhal', 'Curry leaves', 'Chilli'],
        allergens: NONE,
        nutrition: { kcal: 720, protein: 34, carbs: 88, fat: 22 },
        available: true,
        portionsLeft: 12,
      },
      {
        name: 'Fish Ambul Thiyal Meal',
        price: 750,
        ingredients: ['Samba rice', 'Tuna', 'Goraka', 'Black pepper', 'Dhal'],
        allergens: ['Fish'],
        nutrition: { kcal: 680, protein: 38, carbs: 80, fat: 18 },
        available: true,
        portionsLeft: 8,
      },
      {
        name: 'Vegetable Rice & Curry',
        price: 550,
        ingredients: ['Samba rice', 'Seasonal vegetables', 'Coconut', 'Dhal', 'Papadam'],
        allergens: NONE,
        nutrition: { kcal: 560, protein: 16, carbs: 92, fat: 14 },
        available: true,
        portionsLeft: 10,
      },
      {
        name: 'Watalappan',
        price: 300,
        ingredients: ['Coconut milk', 'Jaggery', 'Egg', 'Cashew', 'Cardamom'],
        allergens: ['Egg', 'Tree nuts'],
        nutrition: { kcal: 340, protein: 7, carbs: 46, fat: 14 },
        available: false,
        portionsLeft: 0,
      },
    ],
  },
  {
    key: 'nimali',
    email: 'nimali.cook@rasaexpress.test',
    name: 'Nimali P.',
    phone: '0774567890',
    role: 'cook',
    cook: {
      displayName: "Nimali's Hoppers",
      bio: 'Fresh hoppers and string hoppers for breakfast and dinner.',
      area: 'Galle Fort',
      verified: true,
      rating: 4.7,
      reviewCount: 84,
      hygieneScore: 4.8,
      acceptsPreorder: false,
      cutoffTime: '18:00',
      tags: ['Hoppers', 'String hoppers'],
      etaMin: 35,
      etaMax: 45,
      distanceKm: 2.0,
    },
    dishes: [
      {
        name: 'Egg Hoppers (3)',
        price: 450,
        ingredients: ['Rice flour', 'Coconut milk', 'Egg', 'Yeast'],
        allergens: ['Egg'],
        nutrition: { kcal: 420, protein: 14, carbs: 58, fat: 14 },
        available: true,
        portionsLeft: 15,
      },
      {
        name: 'String Hoppers & Sambol',
        price: 400,
        ingredients: ['Rice flour', 'Coconut sambol', 'Dhal curry'],
        allergens: NONE,
        nutrition: { kcal: 460, protein: 11, carbs: 78, fat: 10 },
        available: true,
        portionsLeft: 20,
      },
    ],
  },
  {
    key: 'sunethra',
    email: 'sunethra.cook@rasaexpress.test',
    name: 'Sunethra W.',
    phone: '0775678901',
    role: 'cook',
    cook: {
      displayName: "Sunethra's Short Eats",
      bio: 'Crispy short eats and sweet treats for tea time and parties.',
      area: 'Katugoda',
      verified: true,
      rating: 4.6,
      reviewCount: 52,
      hygieneScore: 4.7,
      acceptsPreorder: true,
      cutoffTime: '17:00',
      tags: ['Short eats', 'Desserts'],
      etaMin: 40,
      etaMax: 50,
      distanceKm: 3.1,
    },
    dishes: [
      {
        name: 'Fish Cutlets (4)',
        price: 480,
        ingredients: ['Tuna', 'Potato', 'Breadcrumbs', 'Onion', 'Chilli'],
        allergens: ['Fish', 'Gluten'],
        nutrition: { kcal: 380, protein: 20, carbs: 34, fat: 17 },
        available: true,
        portionsLeft: 18,
      },
      {
        name: 'Vegetable Rolls (4)',
        price: 420,
        ingredients: ['Carrot', 'Potato', 'Leeks', 'Flour', 'Egg'],
        allergens: ['Egg', 'Gluten'],
        nutrition: { kcal: 360, protein: 9, carbs: 40, fat: 18 },
        available: true,
        portionsLeft: 14,
      },
    ],
  },
];

type SeedReview = Pick<Review, 'food' | 'hygiene' | 'delivery' | 'comment' | 'tags'> & {
  cook: string;
  daysAgo: number;
};

// A few reviews so the C3 Reviews tab has something to show. Written by the customer test account.
const SEED_REVIEWS: SeedReview[] = [
  {
    cook: 'bhanuka',
    daysAgo: 2,
    food: 5,
    hygiene: 5,
    delivery: 4,
    comment: 'Tasted like home. Packed neatly and still warm.',
    tags: ['Fresh & tasty', 'Clean packaging'],
  },
  {
    cook: 'bhanuka',
    daysAgo: 6,
    food: 5,
    hygiene: 5,
    delivery: 5,
    comment: 'The ambul thiyal was perfect. Will order again.',
    tags: ['Fresh & tasty', 'Good portion'],
  },
  {
    cook: 'bhanuka',
    daysAgo: 12,
    food: 4,
    hygiene: 5,
    delivery: 3,
    comment: 'Great food, the rider came a little late.',
    tags: ['Late delivery'],
  },
  {
    cook: 'nimali',
    daysAgo: 4,
    food: 5,
    hygiene: 4,
    delivery: 5,
    comment: 'Soft hoppers, the egg was cooked just right.',
    tags: ['Fresh & tasty', 'Hot on arrival'],
  },
];

// A few alerts so the C8 Alerts section has something to show. daysAgo can be a fraction.
const SEED_NOTIFICATIONS: { text: string; daysAgo: number; read: boolean }[] = [
  {
    text: "Bhanuka's Kitchen added Fish Ambul Thiyal Meal to the menu.",
    daysAgo: 0.05,
    read: false,
  },
  {
    text: "Nimali's Hoppers is taking orders for tomorrow's breakfast.",
    daysAgo: 0.4,
    read: false,
  },
  { text: 'Your order was delivered. How was the food?', daysAgo: 1.5, read: true },
  { text: "Sunethra's Short Eats has new short eats today.", daysAgo: 3, read: true },
];

// Orders the cook has marked ready and no rider has taken yet, so R1 has requests to show.
// Running the seed again puts them back to "no rider", which is handy for testing.
const SEED_REQUESTS = [
  {
    cook: 'bhanuka',
    address: '12 Lighthouse Street, Galle Fort',
    landmark: 'Opposite the Dutch Hospital',
    pickup: { lat: 6.0312, lng: 80.2128 },
    dropoff: { lat: 6.0262, lng: 80.2172 },
    paymentMethod: 'cash' as const,
    items: [{ name: 'Chicken Rice & Curry', price: 650, qty: 2, note: 'Less spicy' }],
  },
  {
    cook: 'nimali',
    address: '45 Pedlar Street, Galle Fort',
    landmark: 'Next to the Fort Bazaar',
    pickup: { lat: 6.0285, lng: 80.2205 },
    dropoff: { lat: 6.0271, lng: 80.2159 },
    paymentMethod: 'cash' as const,
    items: [{ name: 'Egg Hoppers (3)', price: 450, qty: 3, note: '' }],
  },
  {
    cook: 'sunethra',
    address: '8 Church Street, Galle Fort',
    landmark: 'Beside the Groote Kerk',
    pickup: { lat: 6.0241, lng: 80.2193 },
    dropoff: { lat: 6.0289, lng: 80.2146 },
    paymentMethod: 'card' as const,
    items: [{ name: 'Short Eats Box', price: 600, qty: 1, note: 'No onions' }],
  },
];

// Orders for the cook screens (S1, S2, S4), in every status. Dish ids match the seeded menus, so
// accepting an order really takes portions off the menu. daysAgo / minutesAgo set the order time.
type SeedCookOrder = {
  cook: string;
  status: Order['status'];
  minutesAgo: number;
  paymentMethod: Order['paymentMethod'];
  paymentStatus: Order['paymentStatus'];
  address: string;
  landmark: string;
  declineReason?: string;
  items: { dish: string; price: number; qty: number; note: string }[];
};

const SEED_COOK_ORDERS: SeedCookOrder[] = [
  {
    cook: 'bhanuka',
    status: 'placed',
    minutesAgo: 4,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    address: '21 Leyn Baan Street, Galle Fort',
    landmark: 'Near the Fort clock tower',
    items: [
      { dish: 'Chicken Rice & Curry', price: 650, qty: 2, note: 'Less spicy' },
      { dish: 'Watalappan', price: 300, qty: 1, note: '' },
    ],
  },
  {
    cook: 'bhanuka',
    status: 'placed',
    minutesAgo: 11,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    address: '5 Hospital Street, Galle Fort',
    landmark: 'Blue gate opposite the post office',
    items: [{ dish: 'Fish Ambul Thiyal Meal', price: 750, qty: 1, note: 'No chilli please' }],
  },
  {
    cook: 'bhanuka',
    status: 'accepted',
    minutesAgo: 25,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    address: '30 Church Street, Galle Fort',
    landmark: 'Next to the museum',
    items: [{ dish: 'Vegetable Rice & Curry', price: 550, qty: 3, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'preparing',
    minutesAgo: 40,
    paymentMethod: 'card',
    paymentStatus: 'pending',
    address: '2 Lighthouse Road, Galle Fort',
    landmark: 'Beside the lighthouse',
    items: [
      { dish: 'Chicken Rice & Curry', price: 650, qty: 1, note: '' },
      { dish: 'Fish Ambul Thiyal Meal', price: 750, qty: 1, note: '' },
    ],
  },
  {
    cook: 'bhanuka',
    status: 'declined',
    minutesAgo: 60 * 5,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    address: '9 Pedlar Street, Galle Fort',
    landmark: 'Green shop front',
    declineReason: 'Sold out',
    items: [{ dish: 'Watalappan', price: 300, qty: 2, note: '' }],
  },
  {
    cook: 'nimali',
    status: 'placed',
    minutesAgo: 7,
    paymentMethod: 'cash',
    paymentStatus: 'pending',
    address: '14 Parawa Street, Galle Fort',
    landmark: 'Opposite the art gallery',
    items: [{ dish: 'Egg Hoppers (3)', price: 450, qty: 2, note: 'Soft eggs' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 90,
    paymentMethod: 'cash',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Chicken Rice & Curry', price: 650, qty: 1, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 1500,
    paymentMethod: 'cash',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [
      { dish: 'Chicken Rice & Curry', price: 650, qty: 2, note: '' },
      { dish: 'Watalappan', price: 300, qty: 1, note: '' },
    ],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 1640,
    paymentMethod: 'card',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Fish Ambul Thiyal Meal', price: 750, qty: 2, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 2940,
    paymentMethod: 'cash',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Vegetable Rice & Curry', price: 550, qty: 3, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 4380,
    paymentMethod: 'card',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [
      { dish: 'Chicken Rice & Curry', price: 650, qty: 1, note: '' },
      { dish: 'Fish Ambul Thiyal Meal', price: 750, qty: 1, note: '' },
    ],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 5820,
    paymentMethod: 'cash',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Chicken Rice & Curry', price: 650, qty: 3, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 7260,
    paymentMethod: 'card',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Vegetable Rice & Curry', price: 550, qty: 2, note: '' }],
  },
  {
    cook: 'bhanuka',
    status: 'delivered',
    minutesAgo: 8700,
    paymentMethod: 'cash',
    paymentStatus: 'received',
    address: '17 Middle Street, Galle Fort',
    landmark: 'Near the old gate',
    items: [{ dish: 'Fish Ambul Thiyal Meal', price: 750, qty: 2, note: '' }],
  },
];

// Set in main() once the .env values have been checked.
let auth: Auth;
let db: Firestore;

function errorCode(error: unknown): string {
  return typeof error === 'object' && error !== null && 'code' in error
    ? String((error as { code: unknown }).code)
    : '';
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Signs in to the test account, creating it the first time. Returns its uid. */
async function signInOrCreate(user: SeedUser): Promise<string> {
  try {
    const credential = await signInWithEmailAndPassword(auth, user.email, SEED_PASSWORD);
    return credential.user.uid;
  } catch (error) {
    const code = errorCode(error);
    if (code !== 'auth/invalid-credential' && code !== 'auth/user-not-found') throw error;
  }
  try {
    const credential = await createUserWithEmailAndPassword(auth, user.email, SEED_PASSWORD);
    return credential.user.uid;
  } catch (error) {
    if (errorCode(error) === 'auth/email-already-in-use') {
      throw new Error(
        `${user.email} already exists with a different password. Delete it in the Firebase console and run again.`,
      );
    }
    throw error;
  }
}

async function seedUser(user: SeedUser): Promise<string> {
  const uid = await signInOrCreate(user);

  await setDoc(
    doc(db, 'users', uid),
    {
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      language: 'en',
      createdAt: serverTimestamp(),
    },
    { merge: true },
  );

  if (user.cook) {
    await setDoc(doc(db, 'cooks', uid), user.cook);
  }

  for (const dish of user.dishes ?? []) {
    const document: Dish = { ...dish, cookId: uid, photoUrl: '' };
    await setDoc(doc(db, 'dishes', `${user.key}-${slug(dish.name)}`), document);
  }

  await signOut(auth);
  console.log(`ok  ${user.role.padEnd(8)} ${user.email}`);
  return uid;
}

/** Signs in as the customer test account and writes the sample reviews for the cooks. */
async function seedReviews(uids: Record<string, string>): Promise<void> {
  const customer = SEED_USERS.find((user) => user.role === 'customer');
  if (!customer) return;

  const customerId = await signInOrCreate(customer);
  let count = 0;
  for (const review of SEED_REVIEWS) {
    count += 1;
    const { cook, daysAgo, ...scores } = review;
    const document: Review = {
      ...scores,
      orderId: `seed-order-${count}`,
      cookId: uids[cook],
      customerId,
      createdAt: Timestamp.fromMillis(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
    };
    await setDoc(doc(db, 'reviews', `seed-${cook}-${count}`), document);
  }
  await signOut(auth);
  console.log(`ok  ${SEED_REVIEWS.length} sample reviews`);
}

async function seedNotifications(): Promise<void> {
  const customer = SEED_USERS.find((user) => user.role === 'customer');
  if (!customer) return;

  const customerId = await signInOrCreate(customer);
  let count = 0;
  for (const note of SEED_NOTIFICATIONS) {
    count += 1;
    const document: AppNotification = {
      uid: customerId,
      text: note.text,
      read: note.read,
      createdAt: Timestamp.fromMillis(Date.now() - note.daysAgo * 24 * 60 * 60 * 1000),
    };
    await setDoc(doc(db, 'notifications', `seed-note-${count}`), document);
  }
  await signOut(auth);
  console.log(`ok  ${SEED_NOTIFICATIONS.length} sample alerts`);
}

async function seedRequests(uids: Record<string, string>): Promise<void> {
  const customer = SEED_USERS.find((user) => user.role === 'customer');
  if (!customer) return;

  const customerId = await signInOrCreate(customer);
  let count = 0;
  for (const request of SEED_REQUESTS) {
    count += 1;
    const items = request.items.map((item, index) => ({
      ...item,
      dishId: `seed-dish-${count}-${index}`,
    }));
    const document: Order = {
      customerId,
      cookId: uids[request.cook],
      riderId: null,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      schedule: { when: 'asap', time: '' },
      address: request.address,
      landmark: request.landmark,
      paymentMethod: request.paymentMethod,
      paymentStatus: 'pending',
      status: 'ready',
      declineReason: '',
      riderLocation: null,
      pickup: request.pickup,
      dropoff: request.dropoff,
      createdAt: Timestamp.fromMillis(Date.now() - (30 - count * 8) * 60 * 1000),
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };
    await setDoc(doc(db, 'orders', `seed-request-${count}`), document);
  }
  await signOut(auth);
  console.log(`ok  ${SEED_REQUESTS.length} sample delivery requests`);
}

async function seedCookOrders(uids: Record<string, string>): Promise<void> {
  const customer = SEED_USERS.find((user) => user.role === 'customer');
  if (!customer) return;

  const customerId = await signInOrCreate(customer);
  let count = 0;
  for (const order of SEED_COOK_ORDERS) {
    count += 1;
    const items = order.items.map(({ dish, ...line }) => ({
      ...line,
      name: dish,
      dishId: `${order.cook}-${slug(dish)}`,
    }));
    const document: Order = {
      customerId,
      cookId: uids[order.cook],
      riderId: order.status === 'delivered' ? uids.imasha : null,
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      schedule: { when: 'asap', time: '' },
      address: order.address,
      landmark: order.landmark,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      status: order.status,
      declineReason: order.declineReason ?? '',
      riderLocation: null,
      createdAt: Timestamp.fromMillis(Date.now() - order.minutesAgo * 60 * 1000),
      updatedAt: serverTimestamp() as unknown as Timestamp,
    };
    await setDoc(doc(db, 'orders', `seed-cook-order-${count}`), document);
  }
  await signOut(auth);
  console.log(`ok  ${SEED_COOK_ORDERS.length} sample cook orders`);
}

// Walk-in cash sales typed in by the cook (S4), so the manual entries have something to show.
const SEED_MANUAL_SALES = [
  { amount: 500, note: 'Walk-in lunch', minutesAgo: 45 },
  { amount: 750, note: 'Neighbour, 2 short eats boxes', minutesAgo: 1440 + 120 },
];

/** Payments for the delivered orders and the manual sales, written by the cook (S4). */
async function seedPayments(uids: Record<string, string>): Promise<void> {
  const cook = SEED_USERS.find((user) => user.key === 'bhanuka');
  if (!cook) return;

  await signInOrCreate(cook);
  let count = 0;
  for (const [index, order] of SEED_COOK_ORDERS.entries()) {
    if (order.status !== 'delivered') continue;
    count += 1;
    const total = order.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const payment: Payment = {
      cookId: uids.bhanuka,
      orderId: `seed-cook-order-${index + 1}`,
      amount: total,
      method: order.paymentMethod,
      status: 'received',
      createdAt: Timestamp.fromMillis(Date.now() - order.minutesAgo * 60 * 1000),
    };
    await setDoc(doc(db, 'payments', `seed-payment-${count}`), payment);
  }
  for (const [index, sale] of SEED_MANUAL_SALES.entries()) {
    count += 1;
    const payment: Payment = {
      cookId: uids.bhanuka,
      orderId: null,
      amount: sale.amount,
      method: 'cash',
      status: 'received',
      note: sale.note,
      createdAt: Timestamp.fromMillis(Date.now() - sale.minutesAgo * 60 * 1000),
    };
    await setDoc(doc(db, 'payments', `seed-manual-${index + 1}`), payment);
  }
  await signOut(auth);
  console.log(`ok  ${count} sample payments`);
}

async function main(): Promise<void> {
  const missing = ['EXPO_PUBLIC_FIREBASE_API_KEY', 'EXPO_PUBLIC_FIREBASE_PROJECT_ID'].filter(
    (name) => !process.env[name],
  );
  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(', ')}. Fill in mobile/.env first.`);
  }

  const app = initializeApp({
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  });
  auth = getAuth(app);
  db = getFirestore(app);

  console.log(`Seeding project ${process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID} ...`);
  const uids: Record<string, string> = {};
  for (const user of SEED_USERS) {
    uids[user.key] = await seedUser(user);
  }
  await seedReviews(uids);
  await seedNotifications();
  await seedRequests(uids);
  await seedCookOrders(uids);
  await seedPayments(uids);
  console.log(
    '\nDone. The password for every test account is SEED_PASSWORD in mobile/scripts/seed.ts.',
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\nSeed failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  });
