# Lead Setup (one-time, project lead only)

Do this once, before the other members start. Teammates then follow `docs/SETUP.md`.
Allow about 1 hour. Nothing here needs coding.

## 1. Install the tools

Same as Step 1 of `docs/SETUP.md`: Git, Node.js LTS (v22+), VS Code. Verify with `node -v`.

## 2. Create the Firebase project (the shared backend)

1. Go to https://console.firebase.google.com and sign in with a Google account.
2. **Create a project** named `rasa-express`. Turn **Google Analytics off**.
3. **Authentication**: Build > Authentication > Get started > Sign-in method > **Email/Password** > Enable > Save.
4. **Firestore**: Build > Firestore Database > Create database.
   - Location: `asia-south1` (Mumbai) is the closest to Sri Lanka. This cannot be changed later.
   - Start in **production mode**.
5. **Security rules**: Firestore > Rules tab > replace everything with the contents of `firebase/firestore.rules` from this repo > **Publish**.
6. **Web app config**: Project settings (gear icon) > General > Your apps > click the **web `</>`** icon > nickname `rasa-express-mobile` > Register (skip hosting). Copy the `firebaseConfig` values.
7. Keep these six values open (or paste them into a Notepad file outside the repo). You create `mobile/.env` later in **step 7**, because the `mobile/` folder does not exist until step 4. The mapping is:

   | env variable | firebaseConfig key |
   |--------------|--------------------|
   | `EXPO_PUBLIC_FIREBASE_API_KEY` | `apiKey` |
   | `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | `projectId` |
   | `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `EXPO_PUBLIC_FIREBASE_APP_ID` | `appId` |

8. **Add teammates**: Project settings > Users and permissions > Add member > each teammate's Google email > role **Editor**. This lets them view data in the console.
9. Send each teammate the `.env` values privately.

## 3. GitHub settings

1. Repo > Settings > Collaborators > **Add people**: the three teammates' GitHub usernames.
2. **Protect main**: Settings > Rules > Rulesets > New branch ruleset > target `main` > enable **Require a pull request before merging** (1 approval) > Create.

## 4. Create the Expo app

Run from the repo root. The folder `mobile/` must not exist yet.

```bash
npx create-expo-app@latest mobile
cd mobile
npm run reset-project
```

`reset-project` asks: *"Do you want to move existing files to /example instead of deleting them? (Y/n)"*. Type **`n`** and press Enter. It deletes the demo screens and leaves a blank Expo Router app: screens live in `mobile/src/app/` (only `index.tsx` and `_layout.tsx` for now). Everything else that is not a screen goes in other folders under `mobile/src/`.

Note: the Expo SDK 57 template keeps screens in `src/app`, not `app`. All docs use this path.

Check it runs: `npx expo start`, scan the QR in Expo Go.

## 5. Install the project libraries

Still in `mobile/`:

```bash
npm install firebase
npx expo install @react-native-async-storage/async-storage expo-location expo-notifications react-native-maps expo-image-picker
npm install --save-dev prettier
npx expo install jest-expo jest @types/jest @testing-library/react-native -- --save-dev
```

What each is for: `firebase` = Auth + Firestore; `async-storage` = keeps users signed in; `expo-location` = rider position; `expo-notifications` = order alerts; `react-native-maps` = tracking map (C6, R2); `expo-image-picker` = dish photos (S3); `jest-expo` = tests.

Add these scripts to `mobile/package.json` under `"scripts"`:

```json
"format": "prettier --write .",
"test": "jest"
```

and this block at the top level of `mobile/package.json`:

```json
"jest": { "preset": "jest-expo" }
```

## 6. Create the folder structure

From the repo root (PowerShell):

```powershell
./scripts/create-structure.ps1
```

It creates the route folders per role and the `src/` folders, each with a `.gitkeep` so Git keeps them. See `docs/ARCHITECTURE.md` for what goes where.

## 7. Create `mobile/.env` and check the app still runs

Run from the repo root (this only works after step 4 has created `mobile/`):

```bash
copy config\env.example mobile\.env
```

Open `mobile/.env` in VS Code and paste the six Firebase values from step 2.7 after each `=`. The file starts with a dot, so it may be hidden in File Explorer; use VS Code's file tree instead. Then `cd mobile && npx expo start`. Run `git status` and confirm `.env` is **not** listed.

## 8. Push

Review with `git status` (no `node_modules`, no `.env`), then commit and push in your own words. Tell the team to follow `docs/SETUP.md`.

## 9. Then build the foundation (before others start their screens)

Teammates need these on `main` to build on. Suggested order, aim to finish within a day:

1. `src/services/firebase.ts`: initialise Firebase with the env values
2. `src/types/`: TypeScript types matching the data model in `docs/ARCHITECTURE.md`
3. `src/context/AuthContext`: sign-in state and user role
4. Root `src/app/_layout.tsx`: redirect by role to `(customer)`, `(cook)` or `(rider)`
5. Role tab layouts (bottom navigation per role)
6. `src/constants/theme.ts` and the basic shared components (Button, Card, Badge, Toast)
7. A seed data script or manual Firestore entries: 3 cooks, ~8 dishes, 3 test accounts (1 per role)

## Build the APK (later, when the app works)

APK builds use Expo's cloud service (free tier), so no Android Studio is needed.

1. Create an account at https://expo.dev
2. In `mobile/`:

```bash
npm install -g eas-cli
eas login
eas build:configure
```

3. In the generated `mobile/eas.json`, make the `preview` profile produce an APK:

```json
"preview": { "distribution": "internal", "android": { "buildType": "apk" } }
```

4. Build: `eas build -p android --profile preview`. When it finishes (about 15 minutes), you get a download link. Install on an Android phone to test, and put the link in the report.
5. `react-native-maps` on a standalone Android build needs a Google Maps API key in `app.json` (`android.config.googleMaps.apiKey`). Decide early whether to use a real map or a simulated route (log it in `docs/DEVIATIONS.md`).
6. iOS builds need a paid Apple developer account. For iOS the group demonstrates in Expo Go and notes this limit in the report.
