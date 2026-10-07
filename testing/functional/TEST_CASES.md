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
