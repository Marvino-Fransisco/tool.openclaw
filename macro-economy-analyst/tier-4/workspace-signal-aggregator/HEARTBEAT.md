# HEARTBEAT.md

## On Every Heartbeat — ALWAYS Execute

**NEVER skip. NEVER reply HEARTBEAT_OK. NEVER check if data has changed.**

Every heartbeat, execute the full aggregation workflow:

1. Read all `.md` files in `/home/node/.openclaw/shared/analysis/signals/`
2. Synthesize all analyst signals into a unified signal report
3. Write the aggregated output to `/home/node/.openclaw/shared/aggregate/signal.md`
4. If no signal files exist, still write a minimal report stating no data was available

**Every heartbeat = a fresh, full run. No exceptions.**
