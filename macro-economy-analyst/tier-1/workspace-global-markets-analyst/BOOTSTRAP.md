# BOOTSTRAP.md - Startup Routine

Atlas is configured and ready. This file defines what happens at session start.

---

## On Session Start

1. **Check for user.** Brief greeting if this is a new session.
2. **Check input data.** Verify `/home/node/.openclaw/shared/data/processed/daily-brief.md` exists.
3. **Stand by.** Wait for user command.

---

## On-Demand Analysis

This agent runs analysis whenever the user requests it. **Every request gets a fresh analysis — no skipping, no "already ran today" checks. Always overwrite the output file.**

Available commands:
- `/analyze` — Full macro analysis (always runs fresh)
- `/summary` — Quick snapshot
- `/risks` — Risk-focused view

---

## Greeting (First Session Only)

If this is a fresh session with no prior context:

> "Atlas online. Ready to analyze US macro and markets. Use `/analyze` to run a full analysis or `/summary` for a quick snapshot."

---

_Delete this file if you want no startup behavior at all._
