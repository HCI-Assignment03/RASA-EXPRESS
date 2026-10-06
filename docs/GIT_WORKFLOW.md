# Git Workflow

Short project, four people, so keep it simple.

## Branches

- `main` is always runnable. Nobody pushes to it directly. Everything arrives by Pull Request.
- Work on short-lived branches named `feature/<name>-<screen>` or `fix/<name>-<issue>`.
  Examples: `feature/fernando-checkout`, `fix/lowe-trip-crash`.
- Delete the branch after it is merged.

## Rhythm

1. `git checkout main && git pull`
2. `git checkout -b feature/<name>-<screen>`
3. Commit small and often.
4. Before opening a PR: `git pull origin main` into your branch and make sure the app still runs.
5. `git push -u origin <branch>`, open a PR using the template, ask one teammate to review.
6. Reviewer opens the branch in Expo Go if it touches UI, then approves. Squash and merge.
7. Merge to `main` at least once a day to keep conflicts small.

## Commit messages

Start with the interface or area, then what changed, in the present tense.

```
C5: add order summary card
S3: toggle sold out writes to Firestore
core: add auth context
docs: update CRUD matrix
```

## Conflicts

Stay in your own route folder (see `docs/TEAM_SCOPE.md`) and conflicts will be rare. If one happens:

1. `git pull origin main` into your branch.
2. Git marks the clash with `<<<<<<<`, `=======`, `>>>>>>>`. Open the file in VS Code and use **Accept Current / Incoming / Both**.
3. Run the app, then `git add .` and `git commit`.
4. Unsure? Ask the lead before pushing.

## Never commit

- `mobile/.env` or any Firebase keys/service-account files
- `node_modules/`, `.expo/`, APK/AAB files (share the APK as a link or a GitHub Release instead)

## Lead settings on GitHub (one-time)

See `docs/LEAD_SETUP.md`, step "Protect main".
