# Functional Test Cases

ID format: `TC-<interface>-<nn>`, e.g. `TC-C5-01`. Cover every CRUD operation in `docs/TEAM_SCOPE.md`, plus at least one invalid-input case per form.

Result: Pass / Fail / Blocked. If Fail, add the defect to the issue log with a fix status.

| Test ID | Interface | Requirement | Operation (C/R/U/D) | Preconditions | Steps | Expected result | Actual result | Result | Tester | Date |
|---------|-----------|-------------|---------------------|---------------|-------|-----------------|---------------|--------|--------|------|
| TC-C1-01 | C1 | NFR02 | Create | App installed, no account | Open app, register with valid email and password | Account created, user lands on role home | | | | |
| TC-C1-02 | C1 | NFR02 | Read | Account exists | Sign in with wrong password | Clear error message, no sign-in | | | | |
| TC-C1-03 | C1 | NFR02 | Read | Seed data loaded | Sign in as kawya.customer@rasaexpress.test, then bhanuka.cook and imasha.rider (seed password) | Each lands on their own role: customer Home, cook Orders, rider Requests | | | | |
| TC-C1-04 | C1 | NFR02 | Create (invalid) | Create account tab open | Tap Create account with every field empty | Errors: "Please enter your name.", "Enter a valid email address.", "Enter a mobile number like 77 123 4567.", "Use at least 6 characters." Nothing is created | | | | |
| TC-C1-05 | C1 | NFR02 | Create (invalid) | An account with the email exists | Register again with the same email | Red box "An account with this email already exists. Try signing in." | | | | |
| TC-C1-06 | C1 | NFR02 | Create | Create account tab open | Choose the Home cook tile, fill in valid details, tap Create account | Toast "Welcome to RASA EXPRESS", the cook Orders tab opens. The More tab says the cook page has no area yet | | | | |
| TC-C1-07 | C1 | NFR02 | Read | Signed in | Close the app fully and open it again | Still signed in, opens on the home tab of the role | | | | |
| TC-C1-08 | C1 | NFR02 | Update | Signed in | Profile, Edit profile: change the name and the mobile to 71 234 5678, choose தமிழ், tap Save changes | Toast "Profile updated", the summary shows the new name, 071 234 5678 and Language: தமிழ் | | | | |
| TC-C1-09 | C1 | NFR02 | Update (invalid) | Edit profile open | Clear the name, type 12345 as the mobile, tap Save changes | An error under each field, nothing saved | | | | |
| TC-C1-10 | C1 | NFR02 | Delete (invalid) | Delete account open | Tap Delete my account with no password, then with a wrong one | "Enter your password to confirm.", then "The email or password is wrong. Please try again." The account stays | | | | |
| TC-C1-11 | C1 | NFR02 | Delete (cancel) | Delete account open | Tap Keep my account | Back to the profile summary, nothing deleted | | | | |
| TC-C1-12 | C1 | NFR02 | Delete | A new test customer (not a seed account) with a cart and a saved cook | Delete account with the right password | Toast "Your account was deleted", back on sign-in. Signing in with that email fails | | | | |
| TC-C1-13 | C1 | NFR02 | Read | Signed in | Tap Sign out, confirm Sign out, then use the phone Back gesture | Sign-in screen. Back does not return to the role screens | | | | |
| TC-C1-14 | C1 | FR01 | Update | Signed in as a cook | More, Edit kitchen details: area Unawatuna, tags "Rice & Curry, Lunch packets", pre-orders on until 17:30, delivery 25 to 35 min, tap Save kitchen details | Toast "Kitchen details saved". The kitchen card shows Unawatuna, "25–35 min delivery" and "Pre-orders until 17:30". A customer sees the same on the cook card (C2) and the About tab (C3) | | | | |
| TC-C1-15 | C1 | FR01 | Update (invalid) | Kitchen details open | Clear the area, type 6 PM as the cut-off, set delivery 45 to 30, tap Save | Errors under area, cut-off ("Use the 24-hour clock, for example 18:00.") and delivery ("The longest time cannot be shorter than the shortest."). Nothing saved | | | | |
| TC-C1-16 | C1 | NFR01 | Read | Customer with some orders, reviews and saved cooks | Open the Profile tab | Orange header with initials, name, email and "Customer". Tiles show the right numbers of Orders, Reviews and Saved cooks. Shortcuts show orders in progress, unread alerts and the cart total | | | | |
| TC-C1-17 | C1 | NFR01 | Read | As TC-C1-16 | Tap each shortcut in turn | My orders opens the Orders tab, Favourites & alerts the Favourites tab, My cart the checkout, Find home cooks the Home tab | | | | |
| TC-C1-18 | C1 | NFR01 | Read | Signed in as bhanuka.cook (seed data) | Open the More tab | Kitchen card with rating, area, delivery time, pre-orders and badges. Tiles: Today's sales (Rs.), New orders, Dishes on sale. "Your kitchen" list matches the Orders, Menu and Sales tabs | | | | |
| TC-C1-19 | C1 | NFR01 | Read | Rider delivered two orders today | Open the Profile tab | Delivered today 2, Earned today (Rs.) equals the two trip fees, All deliveries counts every delivered trip. Shortcuts show open requests and the active trip | | | | |
| TC-C1-20 | C1 | NFR02 | Read (cancel) | Signed in | Tap Sign out, then Stay signed in | Nothing changes, still signed in | | | | |
| TC-C2-01 | C2 | FR01 | Read | Seed data loaded, signed in as a customer | Open the Home tab | "3 cooks", best rated first: Bhanuka's Kitchen 4.8, Nimali's Hoppers 4.7, Sunethra's Short Eats 4.6 | | | | |
| TC-C2-02 | C2 | FR01 | Read | Home open | Type "ambul" in the search bar | Only Bhanuka's Kitchen (the search also looks at dish names) | | | | |
| TC-C2-03 | C2 | FR01 | Read | Home open | Tap Top rated 4.7+ | Bhanuka's Kitchen and Nimali's Hoppers only | | | | |
| TC-C2-04 | C2 | FR01 | Read | Home open | Tap Pre-order (or the "Plan ahead, eat well" banner) | Bhanuka's Kitchen and Sunethra's Short Eats only | | | | |
| TC-C2-05 | C2 | FR01 | Read (no results) | Home open | Turn on Pre-order and search "hoppers" | "No cooks match" with "Remove the search text (2 cooks)" and "Remove Pre-order (1 cook)". Each button brings those cooks back | | | | |
| TC-C2-06 | C2 | FR06 | Create | Nimali's Hoppers not saved | Tap the heart on its card | The heart fills, the cook is listed in Favourites, Saved cooks | | | | |
| TC-C2-07 | C2 | FR06 | Delete | Nimali's Hoppers saved | Tap the filled heart | The heart empties, the cook leaves Saved cooks | | | | |
| TC-C2-08 | C2 | FR03 | Read | Cart holds 2 portions | Look at the Home header and tap the cart button | The cart button shows 2, Checkout opens with the cart | | | | |
| TC-C2-09 | C2 | FR03 | Read | Cart is empty | Tap the cart button | No number on it. Checkout says "Your cart is empty. Pick a cook and add a dish first." | | | | |
| TC-C2-10 | C2 | NFR08 | Read | Home open | Tap the bell | Favourites & alerts opens | | | | |
| TC-C3-01 | C3 | FR01 | Read | Home open | Tap Bhanuka's Kitchen | Cook page: name, Verified, rating 4.8, review count, distance, delivery time and hygiene badge. Menu lists the dishes with sold-out Watalappan last | | | | |
| TC-C3-02 | C3 | FR06 | Read | Cook page open | Tap Reviews | Big rating with stars and the number of ratings, then the reviews, newest first | | | | |
| TC-C3-03 | C3 | FR01 | Read | Cook page open | Tap About | Description, area, delivery time, hygiene score, "Accepted. Same-day orders close at 18:00" and Cash on delivery | | | | |
| TC-C3-04 | C3 | FR02 | Read | Cook page open | Look at Watalappan | Greyed out with "Sold out today" and no Add button | | | | |
| TC-C3-05 | C3 | FR03 | Create | Cart is empty | Tap Add on Chicken Rice & Curry | The button becomes a 1 stepper, the bar "View cart" shows 1 and Rs. 650 | | | | |
| TC-C3-06 | C3 | FR03 | Update | TC-C3-05 done | Tap + twice | Stepper 3, bar shows Rs. 1,950 | | | | |
| TC-C3-07 | C3 | FR03 | Update (invalid) | Fish Ambul Thiyal Meal has 8 portions | Tap + more than 8 times | The stepper stops at 8 | | | | |
| TC-C3-08 | C3 | FR03 | Delete | One dish in the cart, quantity 1 | Tap − | The dish leaves the cart and the View cart bar disappears | | | | |
| TC-C3-09 | C3 | FR03 | Create | Cart holds a dish from Nimali's Hoppers | On Bhanuka's Kitchen tap Add | "Start a new order?" Keep my cart changes nothing, Start new order replaces the cart | | | | |
| TC-C3-10 | C3 | FR06 | Create | Cook not saved | Tap the heart at the top right | The heart turns red, the cook is in Saved cooks | | | | |
| TC-C3-11 | C3 | FR03 | Read | Cart has items | Tap View cart | Checkout opens with the same items and total | | | | |
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
| TC-C8-13 | C8 | NFR08 | Read | Customer saved Bhanuka's Kitchen and switched its alerts on | As Bhanuka add a dish with 5 portions, then as the customer open Favourites, Alerts | New unread alert "Bhanuka's Kitchen added <dish> to the menu." and a number on the Favourites tab | | | | |
| TC-C8-14 | C8 | NFR08 | Read | As TC-C8-13, Watalappan sold out with 0 portions | As Bhanuka tap + on Watalappan | Alert "Watalappan from Bhanuka's Kitchen is back on the menu." | | | | |
| TC-C8-15 | C8 | NFR08 | Read | Cook saved but its alerts switched off | As the cook add a dish | No new alert for this customer | | | | |
| TC-C8-16 | C8 | NFR08 | Read | Alerts on | As the cook add a dish with 0 portions | No alert, because it cannot be ordered yet | | | | |
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
| TC-R1-11 | R1 | NFR08 | Read | Rider on the Profile tab | A cook marks an order Ready | A number appears on the Requests tab. Dismissing the request takes it off the count | | | | |
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
| TC-R2-14 | R2 | FR09 | Read | Rider has an active trip | Look at the Customer card | Customer name and a green call button that opens the phone dialler | | | | |
| TC-R2-15 | R2 | FR04 | Read | Customer sent "Please ring the bell" on C6 | Open Active trip | The message is in "Chat with <customer>", on the left | | | | |
| TC-R2-16 | R2 | FR04 | Create | Rider has an active trip | Type "On my way" and tap send | The message shows on the right. The customer sees it live on C6 (TC-C6-20) | | | | |
| TC-R2-17 | R2 | NFR08 | Read | Rider accepted a request | Look at the tab bar | The Active trip tab shows the number of unfinished trips | | | | |
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
| TC-S3-14 | S3 | FR08 | Create | A customer has alerts on for this cook | Add a dish with portions | Toast "Dish added to your menu". The customer gets the alert (see TC-C8-13) | | | | |
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
| TC-S1-16 | S1 | NFR08 | Read | Cook signed in, on the Menu tab | A customer places an order | A number appears on the Orders tab. It goes down when the cook accepts the order | | | | |
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
| TC-C6-20 | C6 | FR04 | Read | Rider replied on R2 (TC-R2-16) | Look at the chat on the tracking screen | The reply appears on the left without reopening the screen | | | | |
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
| TC-INT-01 | All | FR03, FR04, FR07, FR09 | C, R, U | Customer, cook and rider signed in on three phones | Customer places a cash order. Cook accepts, starts preparing, marks ready. Rider accepts, picks up, records the cash, delivers. Customer rates the order | Every step shows live on the other two phones. The cook's Sales shows the cash once. The cook rating changes | | | | |
| TC-INT-02 | All | NFR08 | Read | Customer has an order placed | Cook declines it with the reason "Out of stock" | The customer gets the alert "Your order was declined: Out of stock" and the tracking screen shows the reason | | | | |
| TC-INT-03 | All | NFR06 | Read | Any screen open | Switch on airplane mode, then switch it off | A dark strip "You are offline. Live updates are paused until you reconnect." at the top, gone once back online | | | | |
| TC-INT-04 | All | NFR05 | Read | APK installed on an Android phone | Find and open the app | Named RASA EXPRESS with the orange plate icon and an orange splash screen | | | | |
| TC-INT-05 | All | NFR05 | Read | Phone with auto-rotate on, app open on any screen | Turn the phone on its side and back | The screen turns with the phone and nothing is cut off. Text and buttons stay in a centred column, clear of the notch | | | | |
| TC-INT-06 | All | NFR05 | Read | Phone on its side, signed out | Look at the sign-in screen | The orange welcome panel and the form sit side by side | | | | |
| TC-INT-07 | C2 | NFR05 | Read | Customer on Home, phone on its side (or a tablet) | Scroll the cooks | Cook cards in two columns (three on a large tablet held sideways). On a phone held upright, one column | | | | |
| TC-INT-08 | S1 | NFR05 | Read | Cook, phone on its side | Decline an order and choose Other reason; open Sales, Add cash sale | Each pop-up stays on its side (does not turn the phone back to portrait), is centred and scrolls if it does not fit | | | | |
| TC-INT-09 | All | NFR05 | Read | Tablet (or Android split screen) | Open each tab of each role | Content stays in a readable centred column instead of stretching edge to edge; the tab labels sit beside their icons | | | | |
