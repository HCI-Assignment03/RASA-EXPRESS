# Functional Test Cases

ID format: `TC-<interface>-<nn>`, e.g. `TC-C5-01`. Cover every CRUD operation in `docs/TEAM_SCOPE.md`, plus at least one invalid-input case per form.

Result: Pass / Fail / Blocked. If Fail, add the defect to the issue log with a fix status.

| Test ID | Interface | Requirement | Operation (C/R/U/D) | Preconditions | Steps | Expected result | Actual result | Result | Tester | Date |
|---------|-----------|-------------|---------------------|---------------|-------|-----------------|---------------|--------|--------|------|
| TC-C1-01 | C1 | NFR02 | Create | App installed, no account | Open app, register with valid email and password | Account created, user lands on role home | | | | |
| TC-C1-02 | C1 | NFR02 | Read | Account exists | Sign in with wrong password | Clear error message, no sign-in | | | | |
