# Architecture and Tech Stack

Source material for the report sections "Tech stack selection and justification" and "System/app architecture overview". Rewrite it in your own words for the report.

## 1. Tech stack and justification

| Layer | Choice | Why (traced to our requirements) |
|-------|--------|----------------------------------|
| Frontend | **React Native + Expo (TypeScript)** | NFR05 needs Android and iOS: one codebase covers both. The group already knows JavaScript from the HTML/CSS/JS prototype. Expo Go lets everyone run the app on a phone without Android Studio. TypeScript catches shape mistakes in the shared order data. |
| Navigation | **Expo Router** (file-based) | Each role gets its own route folder: `customer/`, `cook/`, `rider/`. Members edit separate folders, so merge conflicts are rare. |
| Backend / database | **Firebase Firestore** | One order is shared by three roles. Firestore's real-time listeners (`onSnapshot`) deliver FR04, FR07 and NFR08 without writing a server. NoSQL documents fit orders and menus. Built-in offline cache helps issue U10 (poor connection). Free tier is enough. |
| Authentication | **Firebase Authentication** | NFR02: secure sign-in with hashed passwords handled by Google, not by us. Role is stored on the user document. |
| Maps / location | `react-native-maps`, `expo-location` | C6 and R2 show the rider on a map (FR04, FR09). |
| Notifications | In-app toasts driven by Firestore listeners; `expo-notifications` for local alerts | NFR08. Remote push needs a standalone build, so listeners are the main path. |
| Payments | Simulated payment flow with test data | NFR03/FR05: cash on delivery is real (83.4% preference). Card/online banking are simulated, because a live gateway is out of scope. Logged in `docs/DEVIATIONS.md`. |
| Build | EAS Build (APK) | Assignment requires an installable build. |
| Testing | Jest + `jest-expo`, manual test log, SUS/SEQ usability sessions | Functional and usability testing required by Milestone 03. |

Alternatives considered: Flutter (new language for everyone), native Android (no iOS), a custom Node + MongoDB API (needs hosting, no free real-time sync, more work than the schedule allows).

## 2. Repository and app structure

```
mobile/
├── scripts/seed.ts           Seeds test accounts, cooks and dishes (npm run seed)
├── __tests__/                Jest tests (npm test)
└── src/
    ├── app/                  Screens only (Expo Router). One folder per role.
    │   ├── _layout.tsx       Root: providers + role guard (Stack.Protected)
    │   ├── index.tsx         "/" sends the user to sign-in or the home tab of their role
    │   ├── (auth)/           C1 sign-in / register
    │   ├── customer/         C2 C3 C4 C5 C6 C7 C8
    │   │   ├── (tabs)/       Bottom tabs: home, favourites, orders, profile
    │   │   └── ...           Detail screens open above the tabs
    │   ├── cook/             S1 S2 S3 S4
    │   │   ├── (tabs)/       Bottom tabs: orders, menu, sales, more
    │   │   └── order/        S2 detail screen
    │   └── rider/            R1 R2
    │       └── (tabs)/       Bottom tabs: requests, trip, profile
    ├── components/           Shared UI: Button, Card, Badge, StarRating, TextField, Screen, Toast
    ├── constants/            theme.ts (colours, spacing, font sizes)
    ├── context/              AuthContext (CartContext to be added)
    ├── features/             Per-member helpers (customer/, cook/, rider/)
    ├── hooks/                useOrder, useDishes, useCook...
    ├── services/             firebase.ts, users.ts + one file per collection (orders.ts, dishes.ts...)
    ├── types/                Shared TypeScript types
    └── utils/                auth-errors.ts, routes.ts, formatting helpers
```

Rules: screens call **services**; services talk to Firestore; screens never call Firestore directly. This keeps CRUD logic testable and easy to explain in the viva.

**How routing works.** The root layout wraps the app in `AuthProvider` and `ToastProvider`. `Stack.Protected` only lets a signed-in user into the folder of their own role, and sends everyone else back to `/`, which redirects. The tab layouts match the bottom navigation in the Milestone 02 prototype. Every interface already has a placeholder screen file: the owner **replaces the whole file** (and drops the `PlaceholderScreen` import).

Screen to file mapping (URL in the last column):

| ID | File | URL |
|----|------|-----|
| C1 | `src/app/(auth)/sign-in.tsx` | `/sign-in` |
| C2 | `src/app/customer/(tabs)/home.tsx` | `/customer/home` |
| C3 | `src/app/customer/cook/[id].tsx` | `/customer/cook/<cookId>` |
| C4 | `src/app/customer/dish/[id].tsx` | `/customer/dish/<dishId>` |
| C5 | `src/app/customer/checkout.tsx` | `/customer/checkout` |
| C6 | `src/app/customer/(tabs)/orders.tsx` (list) and `src/app/customer/track/[orderId].tsx` | `/customer/orders`, `/customer/track/<orderId>` |
| C7 | `src/app/customer/review/[orderId].tsx` | `/customer/review/<orderId>` |
| C8 | `src/app/customer/(tabs)/favourites.tsx` | `/customer/favourites` |
| S1 | `src/app/cook/(tabs)/orders.tsx` | `/cook/orders` |
| S2 | `src/app/cook/order/[id].tsx` | `/cook/order/<orderId>` |
| S3 | `src/app/cook/(tabs)/menu.tsx` | `/cook/menu` |
| S4 | `src/app/cook/(tabs)/sales.tsx` | `/cook/sales` |
| R1 | `src/app/rider/(tabs)/requests.tsx` | `/rider/requests` |
| R2 | `src/app/rider/(tabs)/trip.tsx` | `/rider/trip` |

The Profile / More tabs (`customer/(tabs)/profile.tsx`, `cook/(tabs)/more.tsx`, `rider/(tabs)/profile.tsx`) show `AccountPanel` with Sign out. C1's owner extends it (edit profile, delete account).

Navigate with `router.push('/customer/cook/abc')` (import `router` from `expo-router`). Route paths are type-checked using types that `npx expo start` generates, so start the dev server once before running `npx tsc --noEmit`.

## 3. Data model (Firestore)

Changing a field name affects teammates: tell the group first.

| Collection | Document id | Fields |
|-----------|-------------|--------|
| `users` | auth uid | `name`, `email`, `phone`, `role` (`customer`/`cook`/`rider`), `language`, `createdAt` |
| `cooks` | cook's uid | `displayName`, `bio`, `area`, `verified`, `rating`, `reviewCount`, `hygieneScore`, `acceptsPreorder`, `cutoffTime`, `tags[]`, `etaMin`, `etaMax`, `distanceKm` |
| `dishes` | auto | `cookId`, `name`, `price`, `ingredients[]`, `allergens[]`, `nutrition{kcal,protein,carbs,fat}`, `available`, `portionsLeft`, `photoUrl` |
| `carts` | customer uid | `cookId`, `items[{dishId,name,price,qty,note}]` |
| `orders` | auto | `customerId`, `cookId`, `riderId` (null until accepted), `items[]`, `total`, `schedule`, `address`, `landmark`, `paymentMethod`, `paymentStatus`, `status`, `declineReason`, `riderLocation{lat,lng}`, `createdAt`, `updatedAt` |
| `orders/{id}/messages` | auto | `senderId`, `text`, `createdAt` |
| `reviews` | auto | `orderId`, `cookId`, `customerId`, `food`, `hygiene`, `delivery`, `comment`, `tags[]`, `createdAt` |
| `favourites` | `{uid}_{cookId}` | `uid`, `cookId` |
| `alertPrefs` | `{uid}_{cookId}` | `uid`, `cookId`, `enabled` |
| `dismissedRequests` | `{riderUid}_{orderId}` | `uid`, `orderId` |
| `notifications` | auto | `uid`, `text`, `read`, `createdAt` |
| `payments` | auto | `cookId`, `orderId` (null for manual entry), `amount`, `method`, `status`, `createdAt` |

**Order status lifecycle:** `placed` → `accepted` → `preparing` → `ready` → `picked_up` → `delivered`. Also `declined` (cook) and `cancelled` (customer, only while `placed`).

**Who changes what:** customer creates and cancels; cook moves `accepted`/`preparing`/`ready`/`declined`; rider sets `riderId`, `picked_up`, `delivered` and location.

## 4. Known risks

- **Time:** deadline is 09.10.2026. Foundation first, then screens, test early (see `docs/PLAN.md`).
- **Maps in the APK** need a Google Maps key (see `docs/LEAD_SETUP.md`). Fallback: a drawn route.
- **Security rules** in `firebase/firestore.rules` let users pick their own role at sign-up. That is acceptable for coursework; state it as a limitation in the report.
- **One shared Firebase project:** everyone writes to the same data. Use clearly named test data and do not delete other people's documents.

## 5. Shared hooks and helpers (use these, do not rebuild them)

| You need | Use | Where |
|----------|-----|-------|
| Who is signed in, their role, sign out | `useAuth()` | `src/context/AuthContext.tsx` |
| The cart: items, count, total, add, set quantity, set note, clear | `useCart()` | `src/hooks/use-cart.ts` |
| Pure cart rules (cap at portions left, one cook per cart) | `addDish`, `setQuantity`, `setNote`, `cartTotal` | `src/utils/cart.ts` |
| All cooks, or one cook, live | `useCooks()`, `useCook(id)` | `src/hooks/use-cooks.ts` |
| Dishes of one cook (or all with `null`), live | `useDishes(cookId)` | `src/hooks/use-dishes.ts` |
| Saved cooks, with a toggle | `useFavourites()` | `src/hooks/use-favourites.ts` |
| Saved-cook alert switches | `useAlertPrefs()` | `src/hooks/use-alert-prefs.ts` |
| The customer's alerts, unread count, mark read | `useNotifications()` | `src/hooks/use-notifications.ts` |
| Delivery requests for a rider (open, dismiss, accept) | `useOpenRequests()` | `src/hooks/use-open-requests.ts` |
| Rider fee and distance text | `riderFee(km)`, `formatDistance(km)` | `src/utils/delivery.ts` |
| Send an alert to a customer (cook or rider side) | `createNotification(uid, text)` | `src/services/notifications.ts` |
| A cook's reviews, newest first | `useCookReviews(cookId)` | `src/hooks/use-reviews.ts` |
| Sold-out check, menu order | `isSoldOut(dish)`, `sortMenu(dishes)` | `src/utils/dish.ts` |
| Money, dates, mobile numbers | `formatPrice`, `formatDate`, `formatMobile` | `src/utils/format.ts` |
| Toast messages | `useToast().show(text, 'success' \| 'error' \| 'info')` | `src/components/toast.tsx` |
| Quantity - 2 + control | `QuantityStepper` | `src/components/quantity-stepper.tsx` |
| Drawn plate instead of a photo | `FoodPlate` | `src/components/food-plate.tsx` |

Rules for the cart: `carts/{uid}` holds one cook's dishes. `useCart().add()` replaces the cart when the dish is from a different cook, so ask the customer first (C3 shows how). Placing an order (C5) should copy the items into the order and then call `clear()`.
