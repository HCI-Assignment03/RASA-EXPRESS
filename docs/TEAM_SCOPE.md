# Team Scope and Workload Division

Assignment rule: each member implements the interfaces in their own workload, with **at least 2 working CRUD operations per interface**. Each member must demonstrate and explain their own interfaces in the viva.

> The Milestone 02 split gave Lowe only R1–R2 (2 interfaces) while others had 4. This split rebalances to 3 / 3 / 4 / 4 so the viva load is fair. If the group prefers the Milestone 02 split, change this file and the README table together.

## 1. Who builds what

| Member | Student ID | Interfaces | Route folder (owner) |
|--------|-----------|------------|----------------------|
| Kulathunga V N (lead) | IT23561298 | C1 Welcome & sign-in, C2 Discover cooks, C3 Cook profile & menu + **foundation** (below) | `src/app/(auth)`, `src/app/(customer)` C2/C3 files |
| Fernando W M N | IT23569386 | C5 Checkout & payment, C6 Live order tracking, C7 Rate & review | `src/app/(customer)` C5/C6/C7 files |
| Manawadu D G | IT23565876 | S1 Orders dashboard, S2 Order detail, S3 Menu manager, S4 Sales & payments | `src/app/(cook)` |
| Lowe W G N | IT23562592 | R1 Delivery requests, R2 Active trip & navigation, C4 Dish details, C8 Favourites & alerts | `src/app/(rider)`, `src/app/(customer)` C4/C8 files |

**Foundation (lead, done first, everyone depends on it):** Firebase init, auth context and role routing, theme (orange #F26B1D, cream background), shared UI components, TypeScript types, seed data, role bottom-tab shells.

## 2. CRUD matrix (at least 2 per interface)

Cart items and favourites are Firestore documents, so those operations count as real CRUD, not local state.

| ID | Interface | Create | Read | Update | Delete |
|----|-----------|--------|------|--------|--------|
| C1 | Welcome & sign-in | Register account | Sign in / load profile | Edit name, phone, language | Delete account |
| C2 | Discover cooks | Add favourite (heart) | List, search, filter cooks | | Remove favourite |
| C3 | Cook profile & menu | Add dish to cart | Menu, hygiene, reviews | Change cart quantity | Remove cart item |
| C4 | Dish details | Add to cart with note to cook | Ingredients, allergens, nutrition | Edit note / quantity | |
| C5 | Checkout & payment | Place order | Cart summary | Change schedule, landmark, payment method | Remove item / clear cart |
| C6 | Live order tracking | Send chat message to rider | Live status, ETA, rider | Cancel order (while "placed") | |
| C7 | Rate & review | Submit review (food, hygiene, delivery) | Own past reviews | Edit review | Delete review |
| C8 | Favourites & alerts | Create alert preference | Saved cooks, alerts | Mark alert read / toggle alert | Remove saved cook |
| S1 | Orders dashboard | | Orders by status tab | Accept, move to Preparing / Ready | Decline order |
| S2 | Order detail | | Customer, items, payment | Update status, mark payment received | Decline with reason |
| S3 | Menu manager | Add dish | List dishes | Toggle sold out, set portions left | Delete dish |
| S4 | Sales & payments | Record manual cash sale | Today's total, 7-day chart | Mark pending payment received | Delete mistaken manual entry |
| R1 | Delivery requests | | Open requests (fee, distance) | Accept request (assign rider) | Dismiss request |
| R2 | Active trip & navigation | Record cash collected | Address, landmark, map | Mark picked up / delivered, update location | |

Each member: keep this table true. If you change an operation, edit it here and tell the group (the report's traceability matrix uses it).

## 3. Requirement coverage check

Every functional requirement from Milestone 01 has an owner:

| Req | Interfaces | Owner(s) |
|-----|-----------|----------|
| FR01 Browse verified sellers | C2, C3 | Kulathunga |
| FR02 Menus with photos, prices, ingredients, nutrition | C3, C4 | Kulathunga, Lowe |
| FR03 Place orders | C5 | Fernando |
| FR04 Real-time tracking | C6, R2 | Fernando, Lowe |
| FR05 Multiple payment methods | C5, S2, S4 | Fernando, Manawadu |
| FR06 Rate and review | C2, C3, C7, C8 | Kulathunga, Fernando, Lowe |
| FR07 Seller order dashboard | S1, S2 | Manawadu |
| FR08 Menu availability and order status | S1, S2, S3 | Manawadu |
| FR09 Rider navigation and status | R1, R2 | Lowe |
| FR10 Daily sales report | S4 | Manawadu |
| NFR02 Secure authentication | C1 | Kulathunga |
| NFR08 Real-time notifications | C6, C8 | Fernando, Lowe |

## 4. Integration points (talk to each other here)

The order is shared by three roles. These hand-offs break easily:

1. **C5 → S1:** Fernando creates an order with `status: "placed"`. Manawadu's dashboard must see it live.
2. **S1/S2 → C6:** Manawadu changes `status`. Fernando's tracker must update live.
3. **S2 "ready" → R1:** When status is `ready` and `riderId` is empty, Lowe's request list shows it.
4. **R1 → C6:** Lowe sets `riderId`. Fernando shows the rider name and ETA.
5. **R2 → C6 and S1:** Lowe sets `picked_up` / `delivered`. Both update live.
6. **C7:** Fernando's review screen opens when status becomes `delivered`.
7. **C3/C4 → C5:** Cart document `carts/{uid}` is written by Kulathunga/Lowe and read by Fernando. The shape is in `docs/ARCHITECTURE.md` and must not change without telling the group.

## 5. Rules to avoid conflicts

- Only edit files in your own route folder. Need a change in someone else's file? Ask them or open a small PR and tag them.
- Shared code (`mobile/src/components`, `src/types`, `src/services`, `src/constants`) is the lead's. Request changes in the group chat or via PR.
- Put your own helpers in `src/features/<your-area>/` so you never collide.
- Never rename a Firestore field without telling everyone.
- You must be able to explain every line in the viva. Using AI help is allowed, but do not paste its output unchanged. The report is checked for AI content (must be under 50%).
