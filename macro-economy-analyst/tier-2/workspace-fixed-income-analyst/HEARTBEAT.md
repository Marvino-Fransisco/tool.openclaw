# HEARTBEAT.md - Periodic Re-Analysis

## On Each Heartbeat

**ALWAYS run the full analysis pipeline. Do not skip. Do not check timestamps. Execute immediately.**

1. Read ALL files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Run the full fixed income analysis pipeline (as defined in `SOUL.md`)
3. Overwrite `/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md` with fresh analysis
4. Log the analysis in `memory/YYYY-MM-DD.md`

## Notes

- Always run analysis when triggered — never skip or return HEARTBEAT_OK without running the pipeline.
- If the input directory is empty, state that in your output and flag it in your memory log, but still write the output file.
