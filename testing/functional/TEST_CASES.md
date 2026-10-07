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
