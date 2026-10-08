# Traceability Matrix

Requirement → prototype interface (Milestone 02) → implemented screen → test cases. Fill the last column as you write test cases.

| Req | Description | Prototype interface | Implemented in (file) | Owner | Test case IDs |
|-----|-------------|--------------------|-----------------------|-------|---------------|
| FR01 | Browse verified home food sellers | C2, C3 | `customer/(tabs)/home.tsx`, `customer/cook/[id].tsx` | Kulathunga | |
| FR02 | Menus with photos, prices, ingredients, nutrition | C3, C4 | `customer/cook/[id].tsx`, `customer/dish/[id].tsx` | Kulathunga, Lowe | TC-C4-01 to TC-C4-08 |
| FR03 | Place food orders | C5 | `customer/checkout.tsx` | Fernando | |
| FR04 | Real-time order and delivery tracking | C6, R2 | `customer/track/[orderId].tsx`, `rider/(tabs)/trip.tsx` | Fernando, Lowe | TC-R2-02, 04, 05, 12 |
| FR05 | Multiple payment methods incl. COD | C5, S2, S4 | `customer/checkout.tsx`, `cook/order/[id].tsx`, `cook/(tabs)/sales.tsx` | Fernando, Manawadu | |
| FR06 | Rate and review sellers, favourites | C2, C3, C7, C8 | `customer/review/[orderId].tsx`, `customer/(tabs)/favourites.tsx` | Fernando, Lowe | TC-C8-01, 02, 09 to 12 |
| FR07 | Seller order dashboard | S1, S2 | `cook/(tabs)/orders.tsx`, `cook/order/[id].tsx` | Manawadu | |
| FR08 | Seller updates menu availability and order status | S1, S2, S3 | `cook/(tabs)/menu.tsx` | Manawadu | TC-S3-01 to TC-S3-13 |
| FR09 | Rider GPS navigation and delivery status | R1, R2 | `rider/(tabs)/requests.tsx`, `rider/(tabs)/trip.tsx` | Lowe | TC-R1-01 to TC-R1-10, TC-R2-01 to TC-R2-13 |
| FR10 | Daily sales reports | S4 | `cook/(tabs)/sales.tsx` | Manawadu | |
| NFR01 | Simple, user-friendly interface | All | All | All | (SUS) |
| NFR02 | Secure authentication | C1 | `(auth)/sign-in.tsx` | Kulathunga | |
| NFR03 | Secure online payment | C5 | `customer/checkout.tsx` | Fernando | |
| NFR04 | Reasonable response time | All | All | All | |
| NFR05 | Android and iOS | All | All | All | |
| NFR06 | High availability | Back end | Firebase | Kulathunga | |
| NFR07 | Easy to learn | C1, S1-S3 | | Kulathunga, Manawadu | (SUS) |
| NFR08 | Real-time notifications | C6, C8 | `customer/track/[orderId].tsx`, `customer/(tabs)/favourites.tsx` | Fernando, Lowe | TC-C8-03 to 08 |

Paths are relative to `mobile/src/app/`. Update the "Implemented in" column if you use different file names.
