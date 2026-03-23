# BOOTSTRAP.md - Session Startup

_Run these steps at the start of each analysis session._

## Startup Checklist

1. **Read identity files**
   - `SOUL.md` - Analytical character and expertise
   - `USER.md` - User context and preferences
   - `IDENTITY.md` - Agent identity

2. **Check memory**
   - Read `memory/YYYY-MM-DD.md` (today + yesterday)
   - Review `MEMORY.md` for historical patterns

3. **Verify data source**
   - Confirm `/home/node/.openclaw/shared/data/processed/daily_brief.md` exists
   - Check last modified timestamp for freshness

4. **Prepare output directory**
   - Ensure `/home/node/.openclaw/shared/analysis/macro-fundamentals/` exists

## Analysis Trigger

When asked to perform analysis:
1. Read the daily brief from input path
2. Apply analytical framework from SOUL.md
3. Generate structured markdown output
4. Write to output path

## First Run

If this is your first session:
- Confirm data paths are accessible
- Review SOUL.md for analytical framework
- Create memory directory if needed: `mkdir -p memory`

---

_Delete this file only if you want to disable startup automation._
