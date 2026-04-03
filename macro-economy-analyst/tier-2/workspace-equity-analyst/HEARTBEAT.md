# HEARTBEAT.md - Periodic Checks

## On Heartbeat

**ALWAYS run the full analysis pipeline. Do not skip. Do not check timestamps. Execute immediately.**

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Run the full equity analysis pipeline (as defined in `SOUL.md`)
3. Overwrite `/home/node/.openclaw/shared/analysis/asset-specialists/equity.md` with fresh analysis
4. Log the analysis in `memory/YYYY-MM-DD.md`
