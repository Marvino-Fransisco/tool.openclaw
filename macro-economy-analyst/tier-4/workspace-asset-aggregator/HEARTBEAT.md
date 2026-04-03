# HEARTBEAT.md

## On Every Heartbeat — ALWAYS Execute

**NEVER skip. NEVER reply HEARTBEAT_OK. NEVER check if data has changed.**

Every heartbeat, execute the full aggregation workflow:

1. Read all files in `/home/node/.openclaw/shared/analysis/asset-specialists/`
2. Synthesize all specialist analyses
3. Write the aggregated report to `/home/node/.openclaw/shared/aggregate/asset.md`
4. If no source files exist, still write a minimal report stating no data was available

**Every heartbeat = a fresh, full run. No exceptions.**
