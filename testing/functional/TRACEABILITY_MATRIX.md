# Traceability Matrix

Requirement → prototype interface (Milestone 02) → implemented screen → test cases. Fill the last column as you write test cases.

| Req | Description | Prototype interface | Implemented in (file) | Owner | Test case IDs |
|-----|-------------|--------------------|-----------------------|-------|---------------|
| FR01 | Browse verified home food sellers | C2, C3 | `src/app/(customer)/index.tsx`, `cook/[id].tsx` | Kulathunga | |
| FR02 | Menus with photos, prices, ingredients, nutrition | C3, C4 | `cook/[id].tsx`, `dish/[id].tsx` | Kulathunga, Lowe | |
| FR03 | Place food orders | C5 | `checkout.tsx` | Fernando | |
| FR04 | Real-time order and delivery tracking | C6, R2 | `track/[orderId].tsx`, `trip/[id].tsx` | Fernando, Lowe | |
| FR05 | Multiple payment methods incl. COD | C5, S2, S4 | `checkout.tsx`, `order/[id].tsx`, `sales.tsx` | Fernando, Manawadu | |
| FR06 | Rate and review sellers, favourites | C2, C3, C7, C8 | `review/[orderId].tsx`, `favourites.tsx` | Fernando, Lowe | |
| FR07 | Seller order dashboard | S1, S2 | `(cook)/index.tsx`, `order/[id].tsx` | Manawadu | |
| FR08 | Seller updates menu availability and order status | S1, S2, S3 | `(cook)/menu.tsx` | Manawadu | |
| FR09 | Rider GPS navigation and delivery status | R1, R2 | `(rider)/index.tsx`, `trip/[id].tsx` | Lowe | |
| FR10 | Daily sales reports | S4 | `(cook)/sales.tsx` | Manawadu | |
| NFR01 | Simple, user-friendly interface | All | All | All | (SUS) |
| NFR02 | Secure authentication | C1 | `(auth)/sign-in.tsx` | Kulathunga | |
| NFR03 | Secure online payment | C5 | `checkout.tsx` | Fernando | |
| NFR04 | Reasonable response time | All | All | All | |
| NFR05 | Android and iOS | All | All | All | |
| NFR06 | High availability | Back end | Firebase | Kulathunga | |
| NFR07 | Easy to learn | C1, S1-S3 | | Kulathunga, Manawadu | (SUS) |
| NFR08 | Real-time notifications | C6, C8 | | Fernando, Lowe | |

Update the "Implemented in" column if you use different file names.
