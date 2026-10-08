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
| TC-S2-01 | S2 | FR07 | Read | Cook has orders | On the Orders tab, tap an order card | Detail screen opens with the order number, status badge and how long ago it was ordered | | | | |
| TC-S2-02 | S2 | FR07 | Read | Order detail open | Look at the Customer card | Customer name and phone number are shown | | | | |
| TC-S2-03 | S2 | FR07 | Read | Customer card shown | Tap the phone number | The phone dialler opens with that number | | | | |
| TC-S2-04 | S2 | FR07 | Read | An order with items and a note | Look at the Items and Delivery cards | Each item shows quantity, name, line price and the note. The total, address, landmark and schedule are correct | | | | |
| TC-S2-05 | S2 | FR05 | Read | A card order with pending payment | Look at the Payment card | Shows the method with "to collect" and a Pending badge | | | | |
| TC-S2-06 | S2 | FR05 | Update | A card order with pending payment | Tap Mark payment received | Toast, badge turns Paid, the button disappears, a `pay_<orderId>` payment exists in Firebase | | | | |
| TC-S2-07 | S2 | FR05 | Update (invalid) | An order already paid | Look at the Payment card | There is no Mark payment received button | | | | |
| TC-S2-08 | S2 | FR05 | Update (invalid) | A declined order with pending payment | Open it | There is no Mark payment received button | | | | |
| TC-S2-09 | S2 | FR08 | Update | A new order | Tap Accept order, then Start preparing, then Mark as ready | The badge changes live after each tap, the customer gets an alert each time | | | | |
| TC-S2-10 | S2 | FR08 | Update | A ready order | Look at the action buttons | No action buttons are shown | | | | |
| TC-S2-11 | S2 | FR07 | Delete | A new order | Tap Decline order, choose a reason, confirm | Detail shows Declined with the reason, customer gets an alert | | | | |
| TC-S2-12 | S2 | FR07 | Delete (invalid) | Decline form open | Choose Other reason, leave it empty, tap Decline | Error asks for a reason, order not declined | | | | |
| TC-S2-13 | S2 | FR09 | Read | A rider has accepted the order | Open the order | The Delivery card shows "Rider: <name>" | | | | |
| TC-S2-14 | S2 | FR07 | Read | An order id that does not exist | Open the order screen with a wrong id | Message "This order could not be found" with Go back | | | | |
| TC-S2-15 | S2 | FR07 | Read | No network | Open an order | Error message with a Try again button | | | | |
| TC-S4-01 | S4 | FR10 | Read | Cook has payments from today (seed data) | Open the Sales tab | Today shows the total of payments received today, and "Last 7 days" shows the week total | | | | |
| TC-S4-02 | S4 | FR10 | Read | Payments exist on several days | Look at the 7-day chart | Seven bars, oldest first, last one labelled Today in orange, amounts above the bars, the best day tallest | | | | |
| TC-S4-03 | S4 | FR10 | Read | No payments at all | Open the Sales tab as a new cook | Today shows Rs. 0, the bars are flat and a message explains there are no payments yet | | | | |
| TC-S4-04 | S4 | FR10 | Read | Payments exist | Look at Payments received | Newest first, each row shows the order number or the note, how it was paid and how long ago | | | | |
| TC-S4-05 | S4 | FR10 | Create | On the Sales tab | Tap Add cash sale, enter 1000 and the note Test sale, tap Save sale | Toast, today total rises by 1000, the sale is the top row of Payments received | | | | |
| TC-S4-06 | S4 | FR10 | Create (invalid) | Cash sale form open | Save with the amount empty | Error under the amount, nothing saved | | | | |
| TC-S4-07 | S4 | FR10 | Create (invalid) | Cash sale form open | Enter 0, then 12.5, then abc and save each time | Each is rejected with the same error | | | | |
| TC-S4-08 | S4 | FR05 | Update | An order with pending payment | Under Waiting for payment, tap Mark received | The card leaves the list, a payment row appears, today total rises, the order shows Paid in S2 | | | | |
| TC-S4-09 | S4 | FR05 | Update | A rider recorded the cash for an order (R2) | Open the Sales tab | The order is not listed as waiting, and its cash appears once in Payments received | | | | |
| TC-S4-10 | S4 | FR10 | Delete | A manual sale exists | Tap its trash button and choose Delete | The row disappears and today total drops by its amount | | | | |
| TC-S4-11 | S4 | FR10 | Delete (cancel) | A manual sale exists | Tap its trash button and choose Keep | Nothing is removed | | | | |
| TC-S4-12 | S4 | FR10 | Delete (invalid) | A payment for an order exists | Look at its row | It has no delete button | | | | |
| TC-S4-13 | S4 | FR10 | Read | No network | Open the Sales tab | Error message with a Try again button | | | | |
| TC-C5-01 | C5 | FR03 | Read | Cart has two dishes from one cook | Tap View cart on the cook page | Checkout shows both dishes with line prices, notes and the correct total | | | | |
| TC-C5-02 | C5 | FR03 | Read | Cart is empty | Open checkout | Message "Your cart is empty" with a Find cooks button | | | | |
| TC-C5-03 | C5 | FR03 | Update | Cart has a dish | Press + until it stops, then press − | Quantity never goes above the portions left, and the total follows | | | | |
| TC-C5-04 | C5 | FR03 | Delete | A dish with quantity 1 | Press the trash button on its stepper | The dish is removed from the cart and the total drops | | | | |
| TC-C5-05 | C5 | FR03 | Delete | Cart has dishes | Tap Clear and choose Clear | Cart is emptied and the empty message shows. Choosing Keep changes nothing | | | | |
| TC-C5-06 | C5 | FR03 | Create (invalid) | Checkout open | Tap Place order with the address empty | Address error, no order created | | | | |
| TC-C5-07 | C5 | FR03 | Create (invalid) | Checkout open | Enter a 3 character address and place the order | Address error asks for a street address | | | | |
| TC-C5-08 | C5 | FR03 | Create (invalid) | Checkout open | Choose Tomorrow, pick no time slot, place the order | Error "Pick a delivery time", no order created | | | | |
| TC-C5-09 | C5 | FR03 | Update | Cook takes pre-orders | Choose Later today or Tomorrow | Half-hour time slots from 11:00 AM to 8:00 PM appear and one can be selected | | | | |
| TC-C5-10 | C5 | FR03 | Update (invalid) | After the cook's cut-off time | Look at Later today | It is switched off with the reason "Same-day pre-orders closed at ..." | | | | |
| TC-C5-11 | C5 | FR03 | Update (invalid) | A cook who does not take pre-orders | Look at Later today and Tomorrow | Both are switched off with the reason, only ASAP can be chosen | | | | |
| TC-C5-12 | C5 | FR05 | Update | Checkout open | Choose each of Cash, Card, Bank transfer and Mobile wallet | The chosen method is highlighted and its hint is shown | | | | |
| TC-C5-13 | C5 | FR03 | Create | Valid cart, address and landmark entered | Choose ASAP and Cash, tap Place order | Toast "Order placed", the tracking screen opens, the cart is empty | | | | |
| TC-C5-14 | C5 | FR03, FR07 | Create | Order placed (TC-C5-13) | Sign in as the cook and open Orders, New | The order is there with address, landmark, items, notes, total and payment | | | | |
| TC-C5-15 | C5 | FR05 | Create | Payment method Card | Place the order, open it as the cook | Payment shows Card, to collect, and the cook can Mark payment received | | | | |
| TC-C5-16 | C5 | FR03 | Create (invalid) | Cart has 3 of a dish | The cook sets that dish to 1 portion, then the customer taps Place order | Red box "Only 1 of ... left", no order is created, the cart is kept | | | | |
| TC-C5-17 | C5 | FR03 | Create (invalid) | Cart has a dish | The cook switches the dish off, then the customer taps Place order | Red box says the dish is sold out, no order is created | | | | |
| TC-C5-18 | C5 | FR03 | Create (invalid) | No network | Tap Place order | Error toast, no order created, the cart is kept | | | | |
| TC-C6-01 | C6 | FR04 | Read | Customer has active and finished orders | Open the Orders tab | "On the way" lists active orders first, "Past orders" lists the rest, each with cook, items, time, status and total | | | | |
| TC-C6-02 | C6 | FR04 | Read | Customer has no orders | Open the Orders tab | Message "You have not ordered yet" with a Find cooks button | | | | |
| TC-C6-03 | C6 | FR04 | Read | An order exists | Tap it on the Orders tab | The tracking screen opens with the status, ETA, progress bar, items, total, payment and address | | | | |
| TC-C6-04 | C6 | FR04, NFR08 | Read | Tracking screen open, cook confirms the order | The cook taps Accept, Start preparing, Mark as ready | The status text and progress bar update live without refreshing | | | | |
| TC-C6-05 | C6 | FR04 | Read | An ASAP order | Look at the ETA line | "Arrives about <from> to <to>" using the order time and the cook's usual range | | | | |
| TC-C6-06 | C6 | FR04 | Read | A pre-order for tomorrow at 12:30 PM | Look at the ETA line | "Scheduled for Tomorrow at 12:30 PM" | | | | |
| TC-C6-07 | C6 | FR04 | Read | A rider accepts the order (R1) | Keep tracking open | The rider card with name and call button appears, and the map shows pickup, delivery address and the rider | | | | |
| TC-C6-08 | C6 | FR04 | Read | The rider is on a trip with location allowed | Watch the map while the rider moves | The blue rider dot follows the rider's position | | | | |
| TC-C6-09 | C6 | FR04 | Read | Order picked up by the rider | Look at the status | "On the way to you", progress bar at On the way | | | | |
| TC-C6-10 | C6 | FR04 | Create | A rider has accepted the order | Type a message in the chat and tap Send | The message appears as an orange bubble and is saved in the order's messages | | | | |
| TC-C6-11 | C6 | FR04 | Create (invalid) | Chat open | Tap Send with the box empty | The send button is disabled and nothing is sent | | | | |
| TC-C6-12 | C6 | FR04 | Create (invalid) | Order has no rider yet | Look for the chat | The chat is not shown until a rider accepts | | | | |
| TC-C6-13 | C6 | FR04 | Update | An order with status placed | Tap Cancel order, choose Cancel order | Toast "Order cancelled", status "You cancelled this order", the cook sees it under Past | | | | |
| TC-C6-14 | C6 | FR04 | Update (cancel) | An order with status placed | Tap Cancel order, choose Keep order | The order is unchanged | | | | |
| TC-C6-15 | C6 | FR04 | Update (invalid) | The cook has accepted the order | Look at the tracking screen | There is no Cancel order button | | | | |
| TC-C6-16 | C6 | FR04 | Update (invalid) | Tracking open on status placed, the cook accepts just before the customer confirms the cancel | Confirm the cancel | Message that the cook just confirmed it, the order stays accepted | | | | |
| TC-C6-17 | C6 | FR04 | Read | The cook declined the order | Open the order | Status "The cook could not take this order" with the reason, no progress bar | | | | |
| TC-C6-18 | C6 | FR06 | Read | The rider delivered the order | Open the order | Status "Delivered", progress bar complete, a Rate your order button is shown | | | | |
| TC-C6-19 | C6 | FR04 | Read | No network | Open an order | Error message with a Try again button | | | | |
| TC-C7-01 | C7 | FR06 | Read | An order is delivered | Open it from the Orders tab | The tracking screen shows a Rate your order button | | | | |
| TC-C7-02 | C7 | FR06 | Read | A delivered order not yet rated | Look at it on the Orders tab | It says "Tap to rate this order" | | | | |
| TC-C7-03 | C7 | FR06 | Create (invalid) | Review form open | Tap Submit review without choosing any stars | An error under each of Food, Hygiene and Delivery, nothing saved | | | | |
| TC-C7-04 | C7 | FR06 | Create (invalid) | Review form open | Rate Food and Hygiene but not Delivery, then submit | Only the Delivery row shows an error | | | | |
| TC-C7-05 | C7 | FR06 | Create | Review form open | Give 5, 4, 5 stars, tap two tags, write a comment, tap Submit review | Toast "Thank you for your review!", back to the previous screen | | | | |
| TC-C7-06 | C7 | FR06 | Create | TC-C7-05 done | Open the cook page, Reviews tab | The new review is at the top and the cook's rating and review count have risen by one review | | | | |
| TC-C7-07 | C7 | FR06 | Read | A rated order | Look at it on the Orders tab | It says "You rated 4.7 stars" (the average of the three ratings) | | | | |
| TC-C7-08 | C7 | FR06 | Read | A rated order | Open the order and tap Edit your review | The screen is titled Your review with the stars, tags and comment filled in | | | | |
| TC-C7-09 | C7 | FR06 | Update | A rated order | Change Delivery to 2 and tap Save changes | Toast "Review updated", the cook's rating changes to match, the review keeps its date | | | | |
| TC-C7-10 | C7 | FR06 | Update | Review form open | Type more than 300 characters in the comment | Input stops at 300 and the counter shows 300 / 300 | | | | |
| TC-C7-11 | C7 | FR06 | Delete | A rated order | Tap Delete review and choose Delete | Toast "Review deleted", the review is gone from the cook page and the rating is back to how it was | | | | |
| TC-C7-12 | C7 | FR06 | Delete (cancel) | A rated order | Tap Delete review and choose Keep | The review is unchanged | | | | |
| TC-C7-13 | C7 | FR06 | Delete | TC-C7-11 done | Look at the order on the Orders tab | It says "Tap to rate this order" again and a new review can be written | | | | |
| TC-C7-14 | C7 | FR06 | Create (invalid) | An order that is not delivered | Open its review screen by a direct link (the app has no button for it) | Message "You can rate an order once it has been delivered" | | | | |
| TC-C7-15 | C7 | FR06 | Create | One order | Submit a review, then open the same order's review again and submit | The second submit edits the same review. There is only one review per order | | | | |
| TC-C7-16 | C7 | FR06 | Create (invalid) | No network | Tap Submit review | Error toast, nothing saved, the form keeps what was typed | | | | |
