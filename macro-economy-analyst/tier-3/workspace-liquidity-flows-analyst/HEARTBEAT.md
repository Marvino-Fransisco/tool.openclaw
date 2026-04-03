# HEARTBEAT.md - Liquidity Flows Analyst Periodic Check

## On Each Heartbeat

**ALWAYS run the full analysis pipeline. Do not check file timestamps or output file existence. Just run the analysis.**

1. Read all macro-fundamentals files from `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Analyze for liquidity flow implications using the framework in `SOUL.md`
3. Write updated analysis to `/home/node/.openclaw/shared/analysis/signals/liquidity-flows.md`
4. Update `memory/last-analysis-state.json` with new timestamp and summary
5. Log to `memory/YYYY-MM-DD.md`

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
