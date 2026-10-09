# Setup Guide for Team Members

Follow these steps in order. Allow about 45 minutes. Windows is assumed; macOS notes are marked.
**The lead must finish `docs/LEAD_SETUP.md` first**, so the `mobile/` folder and Firebase project already exist when you clone.

You will need: a laptop (Windows 10/11 or macOS), an Android phone or iPhone, Wi-Fi shared between laptop and phone, a GitHub account.

---

## Step 1. Install the tools

Install each, accepting default options.

| Tool | Get it | Check it worked (in a new terminal) |
|------|--------|-------------------------------------|
| Git | https://git-scm.com/downloads | `git --version` |
| Node.js **LTS** (v22 or newer) | https://nodejs.org (pick "LTS") | `node -v` and `npm -v` |
| VS Code | https://code.visualstudio.com | open it |

Windows shortcut (PowerShell): `winget install Git.Git OpenJS.NodeJS.LTS Microsoft.VisualStudioCode`
After installing, **close and reopen the terminal** so the new tools are found.

## Step 2. Tell Git who you are

Use the same email as your GitHub account.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

## Step 3. Get access to the repository

1. Accept the collaborator invitation the lead sent to your email (or at https://github.com/vehan0911-spec/RASA-EXPRESS/invitations).
2. Open a terminal in the folder where you keep projects, then:

```bash
git clone https://github.com/vehan0911-spec/RASA-EXPRESS.git
cd RASA-EXPRESS
code .
```

When VS Code asks to install recommended extensions (ESLint, Prettier, Expo Tools), click **Install**.

## Step 4. Install the app dependencies

```bash
cd mobile
npm install
```

Use `npm install` only. Do **not** run `npm update` or `npm audit fix --force`: they change versions and break teammates' machines. To add a new package, tell the lead first, then use `npx expo install <package>`.

## Step 5. Add the Firebase configuration

1. The lead will send you the Firebase values privately (WhatsApp/DM). **Never commit them or post them in public.**
2. Copy the template, from the repo root:

```bash
copy config\env.example mobile\.env          # Windows (cmd/PowerShell)
cp config/env.example mobile/.env            # macOS / Git Bash
```

3. Open `mobile/.env` and paste each value after its `=`. No quotes, no spaces.

## Step 6. Install Expo Go on your phone

- Android: Play Store, search **Expo Go**
- iPhone: App Store, search **Expo Go**

Connect your phone to the **same Wi-Fi** as your laptop.

## Step 7. Run the app

From the `mobile` folder:

```bash
npx expo start
```

A QR code appears in the terminal.
- Android: open Expo Go, tap **Scan QR code**.
- iPhone only: first create a free account at https://expo.dev/signup, then run `npx expo login` on your PC and sign in to the same account in Expo Go (profile icon, top right). Without this the iPhone shows "You need to be signed in to Expo Go and Expo CLI". Android users can skip this.
- iPhone: Expo Go has no scan button. Close Expo Go, open the normal **Camera** app, point it at the QR code, and tap the **"Open in Expo Go"** banner. You can also pick the running server under "Development servers" on the Expo Go home screen.

The first load takes a minute. You should see the app screen on your phone. Edit a file, save, and it reloads automatically.

## Step 8. Verify your setup (checklist)

- [ ] `git --version`, `node -v`, `npm -v` all print versions
- [ ] `mobile/.env` exists and every line has a value
- [ ] `npx expo start` shows a QR code with no red errors
- [ ] The app opens on your phone in Expo Go
- [ ] `git status` does **not** list `.env` (it is ignored). If it does, stop and tell the lead.

Send a screenshot of your running app to the group chat.

---

## Test accounts and checks

The lead runs `npm run seed` once. It creates shared test accounts and sample cooks and dishes (customer, rider and three cooks). Their emails are listed in `docs/LEAD_SETUP.md`, and the password is `SEED_PASSWORD` in `mobile/scripts/seed.ts`. Sign in with the account for your role once the sign-in screen (C1) is built. Do not delete other people's data.

Every interface already has a placeholder screen. Replace the whole file for your interface (see `docs/TEAM_SCOPE.md`) and remove the `PlaceholderScreen` import.

Before opening a pull request, run from `mobile/`:

```bash
npx tsc --noEmit    # types (run npx expo start once first so route types exist)
npm run lint        # code problems
npm run format      # tidy formatting
npm test            # automated tests
```

---

## Daily routine

```bash
git checkout main
git pull                              # get everyone's latest work
git checkout -b feature/<name>-<screen>   # e.g. feature/nimal-checkout
# ... work, then:
git add .
git commit -m "C5: add order summary"
git push -u origin feature/<name>-<screen>
```

Then open a Pull Request on GitHub. Full rules: `docs/GIT_WORKFLOW.md`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `node` or `git` "not recognized" | Close and reopen the terminal. Still failing: reinstall and make sure "Add to PATH" is ticked |
| PowerShell says "running scripts is disabled" | Run once: `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` |
| Phone cannot load the app / times out | Same Wi-Fi? Turn off VPN. Windows Firewall popup: allow Node.js on **Private** networks. Or use `npx expo start --tunnel` (slower, works across networks) |
| "The request timed out" (iPhone) or "Failed to download remote update" (Android) | Windows treats your Wi-Fi as **Public** and blocks Node.js. Fix: Settings > Network & internet > Wi-Fi > your network > Network profile type > **Private network**. Or run `npx expo start --tunnel` instead |
| iPhone: "You need to be signed in to Expo Go and Expo CLI" | Run `npx expo login` on the PC and sign in to the same Expo account in Expo Go on the phone |
| University Wi-Fi blocks connections | Use your phone hotspot for the laptop, or `--tunnel` |
| "Project is incompatible with this version of Expo Go" | Update Expo Go from the store. If still wrong, tell the lead (SDK version mismatch) |
| Red screen "Firebase: Error (auth/invalid-api-key)" | `mobile/.env` is missing or has a typo. Restart with `npx expo start -c` (clears cache) |
| Changes not showing | Shake the phone, tap **Reload**, or press `r` in the terminal |
| Strange errors after `git pull` | In `mobile`: `npm install`, then `npx expo start -c` |
| "Unable to resolve expo-network" | A package was added (09.10.2026). In `mobile`: `npm install`, then `npx expo start -c` |
| Port 8081 already in use | Answer `Y` to use another port, or close the other terminal running Expo |
| Merge conflict | Do not panic and do not delete files. Ask the lead; see `docs/GIT_WORKFLOW.md` |

Optional: an Android emulator (Android Studio) also works but is heavy. A real phone with Expo Go is the supported route.
