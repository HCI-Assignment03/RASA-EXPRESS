import type { Timestamp } from 'firebase/firestore';

// Shapes of the Firestore documents. Keep in sync with docs/ARCHITECTURE.md (section 3).
// Do not rename a field without telling the group.

/** A document as read from Firestore: its fields plus the document id. */
export type WithId<T> = T & { id: string };

export type Role = 'customer' | 'cook' | 'rider';
export type Language = 'en' | 'si' | 'ta';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  role: Role;
  language: Language;
  createdAt: Timestamp;
};

export type Cook = {
  displayName: string;
  bio: string;
  area: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  hygieneScore: number;
  acceptsPreorder: boolean;
  /** Latest time (HH:mm) a pre-order for the same day is accepted. */
  cutoffTime: string;
  /** Short labels on the discover card, e.g. "Rice & Curry", "Lunch packets". */
  tags: string[];
  /** Estimated minutes until delivery, shown as a range such as "30-40 min". */
  etaMin: number;
  etaMax: number;
  /** Fixed value (no live geolocation): see docs/DEVIATIONS.md. */
  distanceKm: number;
};

export type Nutrition = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type Dish = {
  cookId: string;
  name: string;
  price: number;
  ingredients: string[];
  allergens: string[];
  nutrition: Nutrition;
  available: boolean;
  portionsLeft: number;
  photoUrl: string;
};

export type CartItem = {
  dishId: string;
  name: string;
  price: number;
  qty: number;
  /** "Note to cook" from C4. */
  note: string;
};

/** carts/{customerUid}. A cart holds dishes from one cook only. */
export type Cart = {
  cookId: string;
  items: CartItem[];
};

export type OrderStatus =
  | 'placed'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'delivered'
  | 'declined'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'card' | 'bank' | 'wallet';
export type PaymentStatus = 'pending' | 'received';

export type OrderSchedule = {
  when: 'asap' | 'today' | 'tomorrow';
  /** Display time such as "12:30 PM". Empty for ASAP. */
  time: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type Order = {
  customerId: string;
  cookId: string;
  /** null until a rider accepts the request (R1). */
  riderId: string | null;
  items: CartItem[];
  total: number;
  schedule: OrderSchedule;
  address: string;
  landmark: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  declineReason: string;
  riderLocation: LatLng | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

/** orders/{orderId}/messages */
export type ChatMessage = {
  senderId: string;
  text: string;
  createdAt: Timestamp;
};

export type Review = {
  orderId: string;
  cookId: string;
  customerId: string;
  /** Star ratings, 1 to 5. */
  food: number;
  hygiene: number;
  delivery: number;
  comment: string;
  tags: string[];
  createdAt: Timestamp;
};

/** favourites/{uid}_{cookId} */
export type Favourite = {
  uid: string;
  cookId: string;
};

export type AppNotification = {
  uid: string;
  text: string;
  read: boolean;
  createdAt: Timestamp;
};

export type Payment = {
  cookId: string;
  /** null for a manual entry such as a walk-in cash sale (S4). */
  orderId: string | null;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  createdAt: Timestamp;
};
