# RASA EXPRESS

Home-cooked meal delivery app connecting local cooks with customers.
IT3060 Human Computer Interaction, Milestone 03 (Mobile App Implementation & Final Evaluation), Group WE_15.

One app, three roles: **Customer**, **Home Cook**, **Delivery Rider**. They share one live order.

## Tech stack

| Layer | Choice |
|-------|--------|
| Mobile app | React Native + Expo (TypeScript), Expo Router |
| Backend / database | Firebase Firestore (real-time listeners) |
| Authentication | Firebase Authentication (email + password) |
| Build / install | Expo Go for development, EAS Build for the Android APK |

Reasons for each choice are in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Quick start (team members)

Full step-by-step guide: **[docs/SETUP.md](docs/SETUP.md)**

```bash
git clone https://github.com/vehan0911-spec/RASA-EXPRESS.git
cd RASA-EXPRESS/mobile
npm install
# copy config/env.example to mobile/.env and fill in the values the lead gave you
npx expo start
```

Then scan the QR code with **Expo Go** on your phone (same Wi-Fi as your PC).

## Repository layout

```
RASA-EXPRESS/
├── mobile/        Expo app (all source code)
├── firebase/      Firestore security rules
├── config/        env.example (copy to mobile/.env)
├── docs/          Setup, team scope, architecture, git workflow, plan, deviations
├── testing/       Functional test cases, traceability matrix, usability testing
├── report/        Consolidated report drafts and screenshots
└── scripts/       Helper scripts
```

## Documentation

| Document | Who reads it |
|----------|--------------|
| [docs/SETUP.md](docs/SETUP.md) | Every member: set up your machine |
| [docs/TEAM_SCOPE.md](docs/TEAM_SCOPE.md) | Every member: who builds which interfaces + CRUD matrix |
| [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) | Every member: branches, commits, pull requests |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Tech stack justification, folder structure, data model |
| [docs/PLAN.md](docs/PLAN.md) | Schedule to the 09.10.2026 deadline |
| [docs/DEVIATIONS.md](docs/DEVIATIONS.md) | Log every difference from the Milestone 02 prototype |
| [docs/LEAD_SETUP.md](docs/LEAD_SETUP.md) | Project lead only: one-time project creation |

## Team

| Student ID | Name | Interfaces |
|------------|------|------------|
| IT23561298 | Kulathunga V N (lead) | C1, C2, C3 + foundation |
| IT23569386 | Fernando W M N | C5, C6, C7 |
| IT23565876 | Manawadu D G | S1, S2, S3, S4 |
| IT23562592 | Lowe W G N | R1, R2, C4, C8 |

## Build an APK

See the "Build the APK" section in [docs/LEAD_SETUP.md](docs/LEAD_SETUP.md).
