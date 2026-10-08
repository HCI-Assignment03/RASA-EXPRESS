# Functional Test Cases

ID format: `TC-<interface>-<nn>`, e.g. `TC-C5-01`. Cover every CRUD operation in `docs/TEAM_SCOPE.md`, plus at least one invalid-input case per form.

Result: Pass / Fail / Blocked. If Fail, add the defect to the issue log with a fix status.

| Test ID | Interface | Requirement | Operation (C/R/U/D) | Preconditions | Steps | Expected result | Actual result | Result | Tester | Date |
|---------|-----------|-------------|---------------------|---------------|-------|-----------------|---------------|--------|--------|------|
| TC-C1-01 | C1 | NFR02 | Create | App installed, no account | Open app, register with valid email and password | Account created, user lands on role home | | | | |
| TC-C1-02 | C1 | NFR02 | Read | Account exists | Sign in with wrong password | Clear error message, no sign-in | | | | |
| TC-C4-01 | C4 | FR02 | Read | Signed in as customer, a cook has dishes | Open Home, open a cook, tap a dish | Dish details show name, cook, price, portions left, ingredients, allergens and nutrition | | | | |
| TC-C4-02 | C4 | FR02 | Create | Cart is empty, dish has portions left | Set quantity 2, type a note, tap Add to cart | Toast "Added to your cart", menu shows the cart bar with 2 items and the right total | | | | |
| TC-C4-03 | C4 | FR02 | Update | Dish is already in the cart (qty 2, with a note) | Open the same dish | Quantity and note are filled in, button reads Update cart | | | | |
| TC-C4-04 | C4 | FR02 | Update | As TC-C4-03 | Change quantity to 3 and edit the note, tap Update cart | Toast "Cart updated", cart bar shows 3 items, reopening the dish shows the new note | | | | |
| TC-C4-05 | C4 | FR02 | Create | Cart holds dishes from cook A | Open a dish from cook B, tap Add to cart | "Start a new order?" warning. Keep my cart changes nothing, Start new order replaces the cart | | | | |
| TC-C4-06 | C4 | FR02 | Create (invalid) | Dish has 3 portions left | Press + more than 3 times | Quantity stops at 3 | | | | |
| TC-C4-07 | C4 | FR02 | Create (invalid) | Dish is sold out | Open the dish | No quantity or note section, button is disabled and reads Sold out today | | | | |
| TC-C4-08 | C4 | FR02 | Create (invalid) | Any dish | Type more than 120 characters in the note | Input stops at 120, counter shows 120 / 120 | | | | |
| TC-C8-01 | C8 | FR06 | Read | Customer has saved two cooks | Open the Favourites tab | Saved cooks section lists both cooks with rating and delivery time | | | | |
| TC-C8-02 | C8 | FR06 | Read | No saved cooks | Open the Favourites tab | Message "No saved cooks yet" and a Find cooks button that opens Home | | | | |
| TC-C8-03 | C8 | NFR08 | Create | A saved cook has never had alerts on | Turn the alerts switch on | Toast "Alerts on for <cook>", switch stays on after leaving and returning to the tab | | | | |
| TC-C8-04 | C8 | NFR08 | Update | Alerts are on for a saved cook | Turn the switch off, then on again | Each change shows a toast and is kept after reopening the app | | | | |
| TC-C8-05 | C8 | NFR08 | Read | Seed data loaded (4 alerts, 2 unread) | Open the Alerts section | Four alerts, newest first, unread ones bold and highlighted. Tab label and Favourites tab badge show 2 | | | | |
| TC-C8-06 | C8 | NFR08 | Update | One unread alert | Tap the unread alert | It turns normal, the unread count drops by 1 | | | | |
| TC-C8-07 | C8 | NFR08 | Update | One read alert | Tap the read alert | It becomes unread again and the count rises by 1 | | | | |
| TC-C8-08 | C8 | NFR08 | Update | At least two unread alerts | Tap Mark all read | All alerts turn normal, the tab badge disappears, the button is greyed out | | | | |
| TC-C8-09 | C8 | FR06 | Delete | A saved cook with alerts off | Tap the trash button and choose Remove | Cook disappears from the list and its heart on Home is empty | | | | |
| TC-C8-10 | C8 | FR06 | Delete | A saved cook with alerts on | Tap the trash button and choose Remove | Cook and its alert preference are removed. Saving the cook again shows the switch off | | | | |
| TC-C8-11 | C8 | FR06 | Delete (cancel) | A saved cook | Tap the trash button and choose Keep | Nothing is removed | | | | |
| TC-C8-12 | C8 | FR06 | Read | A saved cook | Tap the cook's name | The cook's profile (C3) opens | | | | |
| TC-R1-01 | R1 | FR09 | Read | Signed in as rider, 3 seeded ready orders with no rider | Open the Requests tab | "3 requests waiting", each card shows item count, payment badge, cook pickup, address, landmark, distance and fee | | | | |
| TC-R1-02 | R1 | FR09 | Read | Cash order in the list | Look at the payment badge | Badge reads "Collect Rs. <total> cash". A card order reads "Paid online" | | | | |
| TC-R1-03 | R1 | FR09 | Read | No ready orders without a rider | Open the Requests tab | Message "No delivery requests right now" | | | | |
| TC-R1-04 | R1 | FR09 | Update | At least one open request | Tap Accept on a request | Toast "Request accepted", Active trip tab opens, the request is gone from the list | | | | |
| TC-R1-05 | R1 | FR09 | Update | TC-R1-04 done | Sign in as the customer and open Favourites, Alerts | A new alert says the rider accepted the delivery | | | | |
| TC-R1-06 | R1 | FR09 | Delete | At least one open request | Tap Dismiss on a request | Request disappears, toast "Request hidden", count drops by 1 | | | | |
| TC-R1-07 | R1 | FR09 | Delete | One request dismissed | Tap Show hidden requests | The request is back and the link disappears | | | | |
| TC-R1-08 | R1 | FR09 | Read | A request is dismissed by rider A | Sign in as another rider | The request is still visible to the other rider | | | | |
| TC-R1-09 | R1 | FR09 | Update (invalid) | Two riders have the same request open | Rider A accepts, then rider B taps Accept | Rider B sees "Another rider already took this request" and is not assigned | | | | |
| TC-R1-10 | R1 | FR09 | Read | No network | Open the Requests tab | Error message with a Try again button | | | | |
| TC-R2-01 | R2 | FR09 | Read | Rider has no accepted trip | Open the Active trip tab | Message "No active trip" and a See requests button | | | | |
| TC-R2-02 | R2 | FR04, FR09 | Read | Rider accepted a request (R1) | Open the Active trip tab | Map shows pickup P, drop-off D, a dashed line and the blue rider dot. Cards show cook, address, landmark, items, notes and fee | | | | |
| TC-R2-03 | R2 | FR09 | Read | Trip is open | Tap Navigate | The phone's maps app opens with directions to the cook, and after pick up, to the customer | | | | |
| TC-R2-04 | R2 | FR04 | Update | Location permission allowed | Walk or wait on an open trip, then check the order in Firebase | `riderLocation` on the order holds the phone's latitude and longitude and changes as the rider moves | | | | |
| TC-R2-05 | R2 | FR04 | Update (invalid) | Location permission denied | Open an active trip | Warning "Location is off", the trip still works, no rider dot on the map | | | | |
| TC-R2-06 | R2 | FR09 | Update | Trip is at "Go to the cook" | Tap Mark as picked up | Toast, status badge changes to Collect the cash (cash order) or Deliver the food (online order), customer gets a picked-up alert | | | | |
| TC-R2-07 | R2 | FR09 | Create | Cash order, picked up | Tap Cash collected | Toast "Cash recorded", badge turns green, a payment `cash_<orderId>` exists with the order total, button changes to Mark as delivered | | | | |
| TC-R2-08 | R2 | FR09 | Create (invalid) | Cash order, cash not yet recorded | Look for the Mark as delivered button | It is not available until the cash is recorded | | | | |
| TC-R2-09 | R2 | FR09 | Create | Cash order, cash already recorded | Tap Cash collected twice quickly, or reopen the trip | Only one payment exists for the order | | | | |
| TC-R2-10 | R2 | FR09 | Update | Trip at the deliver step | Tap Mark as delivered, choose Not yet, then tap again and choose Delivered | Not yet changes nothing. Delivered shows the earned amount, the trip disappears, customer gets a delivered alert | | | | |
| TC-R2-11 | R2 | FR09 | Update | Order paid online | Mark as picked up, then look at the buttons | Goes straight to Mark as delivered with no cash step | | | | |
| TC-R2-12 | R2 | FR04 | Read | No internet | Open an active trip | Map area explains it could not load. Address, landmark and Navigate still work | | | | |
| TC-R2-13 | R2 | FR09 | Read | Rider accepted two requests | Open Active trip | The older trip is shown, with "1 more trip is waiting". After delivering it, the next one appears | | | | |
| TC-S3-01 | S3 | FR08 | Read | Signed in as a cook with dishes | Open the Menu tab | Heading shows "N dishes, M on sale today" and one card per dish, sold-out dishes last | | | | |
| TC-S3-02 | S3 | FR08 | Create | On the Menu tab | Tap Add dish, fill every field correctly, tap Save dish | Toast "Dish added", the dish appears in the list and on the customer's cook page | | | | |
| TC-S3-03 | S3 | FR08 | Create (invalid) | Add dish form open | Tap Save dish with the form empty | Errors under name, price, portions and ingredients, nothing saved | | | | |
| TC-S3-04 | S3 | FR08 | Create (invalid) | Add dish form open | Enter price 12.5, portions 2.5 and nutrition "abc" | Each field shows its own error, nothing saved | | | | |
| TC-S3-05 | S3 | FR08 | Update | A dish is on sale | Turn the On sale today switch off | Dish shows Sold out, customers see it as sold out | | | | |
| TC-S3-06 | S3 | FR08 | Update | A dish with portions | Press + and − on the portion stepper | The number changes each press and customers see the same count | | | | |
| TC-S3-07 | S3 | FR08 | Update | A dish with 1 portion | Press − to reach 0 | Dish becomes Sold out and its switch turns off. Pressing + puts it back on sale | | | | |
| TC-S3-08 | S3 | FR08 | Update (invalid) | A dish with 0 portions | Turn its switch on | Message "Add some portions first", the switch stays off | | | | |
| TC-S3-09 | S3 | FR08 | Update | A dish on the menu | Tap Edit, change the price, save | The new price shows on the card and for customers | | | | |
| TC-S3-10 | S3 | FR08 | Update | A dish switched off by the cook, with portions | Tap Edit, change the name, save | The dish stays switched off | | | | |
| TC-S3-11 | S3 | FR08 | Delete | A dish on the menu | Tap Delete, choose Delete | Dish removed from the list and from the customer's view | | | | |
| TC-S3-12 | S3 | FR08 | Delete (cancel) | A dish on the menu | Tap Delete, choose Keep | Nothing is removed | | | | |
| TC-S3-13 | S3 | FR08 | Read | A cook with no dishes | Open the Menu tab | Message "You have no dishes yet" with the Add dish button | | | | |
| TC-S1-01 | S1 | FR07 | Read | Cook has orders in several statuses (seed data) | Open the Orders tab and look at each tab | Tabs New, Preparing, Ready, Past show the right orders with counts, newest first | | | | |
| TC-S1-02 | S1 | FR07 | Read | A new order exists | Look at an order card | Order number, status badge, time, items, address with landmark, payment line and total are shown | | | | |
| TC-S1-03 | S1 | FR07 | Read | A customer places a new order (or one is seeded) | Keep the Orders tab open | The order appears under New without refreshing | | | | |
| TC-S1-04 | S1 | FR07 | Read | A tab has no orders | Open that tab | A message explains the tab is empty | | | | |
| TC-S1-05 | S1 | FR08 | Update | A new order | Tap Accept order | The order moves to Preparing, the dish portions drop by the quantity ordered, the customer gets an alert | | | | |
| TC-S1-06 | S1 | FR08 | Update | An accepted order | Tap Start preparing | The badge changes to Preparing and the customer gets an alert | | | | |
| TC-S1-07 | S1 | FR08 | Update | A preparing order | Tap Mark as ready | The order moves to the Ready tab, appears in the rider requests, customer gets an alert | | | | |
| TC-S1-08 | S1 | FR08 | Update | A dish with few portions left | Accept orders until the dish reaches 0 portions | The dish is marked sold out on the Menu tab and for customers | | | | |
| TC-S1-09 | S1 | FR07 | Delete | A new order | Tap Decline, choose Sold out, confirm | The order moves to Past as Declined with the reason, customer gets an alert | | | | |
| TC-S1-10 | S1 | FR07 | Delete (invalid) | Decline form open | Choose Other reason and tap Decline with nothing typed | Error asks for a reason, nothing declined | | | | |
| TC-S1-11 | S1 | FR07 | Delete | An accepted order | Decline it with a reason | Portions taken at accept are put back on the menu | | | | |
| TC-S1-12 | S1 | FR07 | Delete (cancel) | Decline form open | Tap Keep order | The order is unchanged | | | | |
| TC-S1-13 | S1 | FR07 | Update (invalid) | A preparing order | Look at the card | No Decline button, only Mark as ready | | | | |
| TC-S1-14 | S1 | FR07 | Update (invalid) | An order shown as New on the cook phone | The customer cancels it, then the cook taps Accept order | Message "This order has changed", the order is not accepted | | | | |
| TC-S1-15 | S1 | FR07 | Read | An order card | Tap the card | The order detail screen (S2) opens | | | | |
