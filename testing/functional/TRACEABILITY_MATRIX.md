# Traceability Matrix

Requirement → prototype interface (Milestone 02) → implemented screen → test cases. Fill the last column as you write test cases.

| Req | Description | Prototype interface | Implemented in (file) | Owner | Test case IDs |
|-----|-------------|--------------------|-----------------------|-------|---------------|
| FR01 | Browse verified home food sellers | C2, C3 | `customer/(tabs)/home.tsx`, `customer/cook/[id].tsx`, `cook/(tabs)/more.tsx` (kitchen details) | Kulathunga | TC-C1-14, 15, TC-C2-01 to 05, TC-C3-01, 03 |
| FR02 | Menus with photos, prices, ingredients, nutrition | C3, C4 | `customer/cook/[id].tsx`, `customer/dish/[id].tsx` | Kulathunga, Lowe | TC-C3-04, TC-C4-01 to TC-C4-08 |
| FR03 | Place food orders | C5 | `customer/checkout.tsx` | Fernando | TC-C2-08, 09, TC-C3-05 to 09, 11, TC-C5-01 to 11, 13, 14, 16 to 18, TC-INT-01 |
| FR04 | Real-time order and delivery tracking | C6, R2 | `customer/track/[orderId].tsx`, `rider/(tabs)/trip.tsx` | Fernando, Lowe | TC-C6-01 to 17, 19, 20, TC-R2-02, 04, 05, 12, 15, 16, TC-INT-01 |
| FR05 | Multiple payment methods incl. COD | C5, S2, S4 | `customer/checkout.tsx`, `cook/order/[id].tsx`, `cook/(tabs)/sales.tsx` | Fernando, Manawadu | TC-C5-12, 15, TC-S2-05 to 08, TC-S4-08, 09 |
| FR06 | Rate and review sellers, favourites | C2, C3, C7, C8 | `customer/review/[orderId].tsx`, `customer/(tabs)/favourites.tsx` | Fernando, Lowe | TC-C2-06, 07, TC-C3-02, 10, TC-C7-01 to 16, TC-C8-01, 02, 09 to 12 |
| FR07 | Seller order dashboard | S1, S2 | `cook/(tabs)/orders.tsx`, `cook/order/[id].tsx` | Manawadu | TC-S1-01 to 04, 09 to 13, 15, TC-S2-01 to 04, 11 to 15, TC-INT-01 |
| FR08 | Seller updates menu availability and order status | S1, S2, S3 | `cook/(tabs)/menu.tsx`, `cook/(tabs)/orders.tsx`, `cook/order/[id].tsx` | Manawadu | TC-S1-05 to 08, 14, TC-S2-09, 10, TC-S3-01 to TC-S3-14 |
| FR09 | Rider GPS navigation and delivery status | R1, R2 | `rider/(tabs)/requests.tsx`, `rider/(tabs)/trip.tsx` | Lowe | TC-R1-01 to TC-R1-10, TC-R2-01 to TC-R2-14, TC-INT-01 |
| FR10 | Daily sales reports | S4 | `cook/(tabs)/sales.tsx` | Manawadu | TC-S4-01 to 07, 10 to 13 |
| NFR01 | Simple, user-friendly interface | All | All | All | (SUS) |
| NFR02 | Secure authentication | C1 | `(auth)/sign-in.tsx` | Kulathunga | TC-C1-01 to 13 |
| NFR03 | Secure online payment | C5 | `customer/checkout.tsx` | Fernando | |
| NFR04 | Reasonable response time | All | All | All | |
| NFR05 | Android and iOS | All | All | All | TC-INT-04 (APK), Expo Go on iPhone and Android |
| NFR06 | High availability | Back end | Firebase | Kulathunga | TC-INT-03 (offline banner) |
| NFR07 | Easy to learn | C1, S1-S3 | | Kulathunga, Manawadu | (SUS) |
| NFR08 | Real-time notifications | C6, C8 | `customer/track/[orderId].tsx`, `customer/(tabs)/favourites.tsx`, the tab bars of all three roles | Fernando, Lowe | TC-C2-10, TC-C6-04, TC-C8-03 to 08, 13 to 16, TC-S1-16, TC-R1-11, TC-R2-17, TC-INT-02 |

Paths are relative to `mobile/src/app/`. Update the "Implemented in" column if you use different file names.
