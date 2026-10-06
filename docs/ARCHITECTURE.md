# Architecture and Tech Stack

Source material for the report sections "Tech stack selection and justification" and "System/app architecture overview". Rewrite it in your own words for the report.

## 1. Tech stack and justification

| Layer | Choice | Why (traced to our requirements) |
|-------|--------|----------------------------------|
| Frontend | **React Native + Expo (TypeScript)** | NFR05 needs Android and iOS: one codebase covers both. The group already knows JavaScript from the HTML/CSS/JS prototype. Expo Go lets everyone run the app on a phone without Android Studio. TypeScript catches shape mistakes in the shared order data. |
| Navigation | **Expo Router** (file-based) | Each role gets its own route folder: `(customer)`, `(cook)`, `(rider)`. Members edit separate folders, so merge conflicts are rare. |
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
└── src/
    ├── app/                  Screens only (Expo Router). One folder per role.
    │   ├── _layout.tsx       Root: auth gate, redirect by role
    │   ├── (auth)/           C1 sign-in / register
    │   ├── (customer)/       C2 C3 C4 C5 C6 C7 C8 + customer tab layout
    │   ├── (cook)/           S1 S2 S3 S4 + cook tab layout
    │   └── (rider)/          R1 R2 + rider tab layout
    ├── components/           Shared UI: Button, Card, Badge, StarRating, Toast...
    ├── constants/            theme (colours, font sizes), static labels
    ├── context/              AuthContext, CartContext
    ├── features/             Per-member helpers (customer/, cook/, rider/)
    ├── hooks/                useOrder, useDishes, useCook...
    ├── services/             firebase.ts + one file per collection (orders.ts, dishes.ts...)
    ├── types/                Shared TypeScript types
    └── utils/                formatting, date and price helpers
```

Rules: screens call **services**; services talk to Firestore; screens never call Firestore directly. This keeps CRUD logic testable and easy to explain in the viva.

Screen to route mapping (suggested file names):

| ID | File |
|----|------|
| C1 | `src/app/(auth)/sign-in.tsx` |
| C2 | `src/app/(customer)/index.tsx` |
| C3 | `src/app/(customer)/cook/[id].tsx` |
| C4 | `src/app/(customer)/dish/[id].tsx` |
| C5 | `src/app/(customer)/checkout.tsx` |
| C6 | `src/app/(customer)/track/[orderId].tsx` |
| C7 | `src/app/(customer)/review/[orderId].tsx` |
| C8 | `src/app/(customer)/favourites.tsx` |
| S1 | `src/app/(cook)/index.tsx` |
| S2 | `src/app/(cook)/order/[id].tsx` |
| S3 | `src/app/(cook)/menu.tsx` |
| S4 | `src/app/(cook)/sales.tsx` |
| R1 | `src/app/(rider)/index.tsx` |
| R2 | `src/app/(rider)/trip/[id].tsx` |

## 3. Data model (Firestore)

Changing a field name affects teammates: tell the group first.

| Collection | Document id | Fields |
|-----------|-------------|--------|
| `users` | auth uid | `name`, `email`, `phone`, `role` (`customer`/`cook`/`rider`), `language`, `createdAt` |
| `cooks` | cook's uid | `displayName`, `bio`, `area`, `verified`, `rating`, `reviewCount`, `hygieneScore`, `acceptsPreorder`, `cutoffTime` |
| `dishes` | auto | `cookId`, `name`, `price`, `ingredients[]`, `allergens[]`, `nutrition{kcal,protein,carbs,fat}`, `available`, `portionsLeft`, `photoUrl` |
| `carts` | customer uid | `cookId`, `items[{dishId,name,price,qty,note}]` |
| `orders` | auto | `customerId`, `cookId`, `riderId` (null until accepted), `items[]`, `total`, `schedule`, `address`, `landmark`, `paymentMethod`, `paymentStatus`, `status`, `declineReason`, `riderLocation{lat,lng}`, `createdAt`, `updatedAt` |
| `orders/{id}/messages` | auto | `senderId`, `text`, `createdAt` |
| `reviews` | auto | `orderId`, `cookId`, `customerId`, `food`, `hygiene`, `delivery`, `comment`, `tags[]`, `createdAt` |
| `favourites` | `{uid}_{cookId}` | `uid`, `cookId` |
| `notifications` | auto | `uid`, `text`, `read`, `createdAt` |
| `payments` | auto | `cookId`, `orderId` (null for manual entry), `amount`, `method`, `status`, `createdAt` |

**Order status lifecycle:** `placed` → `accepted` → `preparing` → `ready` → `picked_up` → `delivered`. Also `declined` (cook) and `cancelled` (customer, only while `placed`).

**Who changes what:** customer creates and cancels; cook moves `accepted`/`preparing`/`ready`/`declined`; rider sets `riderId`, `picked_up`, `delivered` and location.

## 4. Known risks

- **Time:** deadline is 09.10.2026. Foundation first, then screens, test early (see `docs/PLAN.md`).
- **Maps in the APK** need a Google Maps key (see `docs/LEAD_SETUP.md`). Fallback: a drawn route.
- **Security rules** in `firebase/firestore.rules` let users pick their own role at sign-up. That is acceptable for coursework; state it as a limitation in the report.
- **One shared Firebase project:** everyone writes to the same data. Use clearly named test data and do not delete other people's documents.
