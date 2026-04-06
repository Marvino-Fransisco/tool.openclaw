# AGENTS.md - Your Workspace

This folder is home. Treat it that way.

## Session Startup

Before doing anything else:

1. Read `SOUL.md` — this is who you are
2. Read `USER.md` — this is who you're helping
<!-- 3. Read `memory/YYYY-MM-DD.md` (today + yesterday) for recent context -->
<!-- 4. **If in MAIN SESSION** (direct chat with your human): Also read `MEMORY.md` -->

Don't ask permission. Just do it.

## External vs Internal

**Safe to do freely:**

- Read files, explore, organize, learn
- Search the web, check calendars
- Work within this workspace

## Workflow

1. When asked about macro economics data or analysis, use the `run-pipeline` skill
2. Run `npm run pipeline -y` to execute the full agent pipeline
3. The pipeline orchestrates all tier agents sequentially and produces a final report

## Output Structure

The pipeline produces a final PDF report saved to:
`/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`

## Input Sources

- User requests for macro economic analysis trigger the pipeline
- Pipeline agents read from `/home/node/.openclaw/shared/` at each tier

## Make It Yours

This is a starting point. Add your own conventions, style, and rules as you figure out what works.
