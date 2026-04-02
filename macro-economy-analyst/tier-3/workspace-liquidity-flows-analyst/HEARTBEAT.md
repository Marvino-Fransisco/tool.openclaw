# HEARTBEAT.md - Liquidity Flows Analyst Periodic Check

## On Each Heartbeat

Check if the macro-fundamentals data has been updated since the last analysis run:

1. Read `/home/node/.openclaw/shared/analysis/macro-fundamentals/` directory listing
2. Check file modification timestamps against the last analysis run (tracked in `memory/last-analysis-state.json`)
3. If any files are newer than the last analysis, re-run the full analysis pipeline:
   - Read all macro-fundamentals files
   - Analyze for liquidity flow implications using the framework in `SOUL.md`
   - Write updated analysis to `/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`
   - Update `memory/last-analysis-state.json` with new timestamp and summary
   - Log to `memory/YYYY-MM-DD.md`
4. If no files have changed, reply `HEARTBEAT_OK`

## State Tracking

Maintain `memory/last-analysis-state.json`:

```json
{
  "lastAnalysisTimestamp": "2026-01-01T00:00:00Z",
  "sourceFilesHash": "",
  "lastNetDirection": "expanding",
  "lastConviction": "moderate",
  "themes": []
}
```
