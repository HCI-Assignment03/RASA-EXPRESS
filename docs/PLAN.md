# Schedule to Deadline (09.10.2026)

Assignment published 28.09.2026, due **09.10.2026**. This plan assumes work started 06.10.2026. It is very tight, so the foundation and the end-to-end order flow come first and polish comes last. Edit it as the team agrees; the final version feeds the Gantt chart in the report.

| Date | Lead (Kulathunga) | Fernando | Manawadu | Lowe |
|------|-------------------|----------|----------|------|
| **Tue 06.10** | Repo, Firebase, Expo scaffold, push | Setup (docs/SETUP.md), read prototype C5-C7 | Setup, read prototype S1-S4 | Setup, read prototype R1-R2, C4, C8 |
| **Wed 07.10** | Foundation: auth, role routing, theme, shared components, seed data. Then C1, C2 | Static C5/C6/C7 UI using shared theme | Static S1-S4 UI | Static R1/R2/C4/C8 UI |
| **Thu 08.10 (AM)** | C3, support integration | C5 place order, C6 live status | S1/S2 live orders, S3 menu CRUD | R1 accept, R2 status updates |
| **Thu 08.10 (PM)** | Integration test of the full order flow with all roles | C7, deviation log | S4, deviation log | C4, C8, deviation log |
| **Fri 09.10 (AM)** | Build APK, README check | Functional tests of own screens | Functional tests of own screens | Functional tests of own screens |
| **Fri 09.10 (PM)** | Report assembly, submit | Usability sessions (5+ users) and write-up | Usability issue log | Screenshots, viva prep |

## Honest warning

Three days for 14 interfaces, usability testing with 5+ participants, a 35-page report and an APK is not realistic at full scope. Agree now on a cut-down order:

1. **Must work end to end:** C1, C2, C3, C5, C6, S1, S2, R1, R2 (the shared order flow).
2. **Next:** S3, S4, C7, C4, C8.
3. **Last:** polish, language switch, offline banner.

Each interface still needs at least 2 real CRUD operations. If the deadline cannot move, tell the coordinator early, since the assignment allows the coordinator to adjust a stack that is infeasible in the timeframe.

## Daily check-in

15 minutes each morning: what I finished, what I am doing, what blocks me. Post screenshots in the group chat after every merged PR (they go into the report).
