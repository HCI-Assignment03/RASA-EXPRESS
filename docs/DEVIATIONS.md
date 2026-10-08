# Deviations from the Milestone 02 High-Fidelity Prototype

The assignment requires every difference between the app and the prototype to be **documented and justified** in the report. Add a row the moment you make a change. Do not wait until the report.

| # | Interface | Prototype (M02) | Implemented app | Reason | Added by | Date |
|---|-----------|-----------------|-----------------|--------|----------|------|
| D01 | C5 | Four payment methods shown | Card payment is a simulated form (no real gateway); online banking is a "mark as pending" flow | No live payment gateway in a student project; keeps NFR03 testable with test data | | |
| D02 | C1 | Mobile number with a 4-digit SMS code, no password | Email and password (Firebase Auth). The mobile number is stored on the profile only | SMS sign-in needs a paid phone-auth plan and a native build; it does not run in Expo Go | | |
| D03 | C1 | Language switch (Sinhala/Tamil/English) is a mock-up | The choice is saved on the profile at sign-up (`language`). Screen text stays English | Translating every screen does not fit the schedule; the stored preference keeps the data model ready | Kulathunga | 07.10.2026 |
| D04 | R2 | Map with moving rider | Real map: Leaflet on OpenStreetMap in a WebView, with pickup, drop-off, a straight dashed line and the rider's live GPS dot. No turn-by-turn route line | No Google Maps API key or billing account needed, and the map looks the same in Expo Go and the APK. Turn-by-turn directions open in the phone's maps app (Navigate button) | Lowe | 08.10.2026 |
| D05 | C2, C3 | Distance and delivery time on cook cards | Fixed values stored on each cook (`distanceKm`, `etaMin`, `etaMax`) | No live geolocation or routing service | | |
| D06 | C6 | Order tracking shown inside the tab bar (Orders highlighted) | Orders tab lists orders; tracking opens as a detail screen above the tabs | Expo Router stack above tabs is simpler; same information | | |
| D07 | C2 | "Deliver to Galle Fort" with a dropdown, a "Map" link and a fourth "More" filter chip | Fixed "Galle Fort" label, no map link, three filter chips (Verified only, Top rated 4.7+, Pre-order) | No address book or map screen in scope; the Milestone 02 sketch review already rejected a map-first design | Kulathunga | 07.10.2026 |
| D08 | R1 | "Dismiss request" removes the request | Dismiss hides the request for this rider only (a record in `dismissedRequests`). A "Show dismissed" button brings them back | Other riders must still be able to take the order, so it cannot be deleted | Lowe | 08.10.2026 |

Delete or edit the example rows as the team decides.
