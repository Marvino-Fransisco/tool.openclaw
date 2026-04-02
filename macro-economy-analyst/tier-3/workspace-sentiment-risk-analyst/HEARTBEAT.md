# HEARTBEAT.md - Periodic Analysis

## On Heartbeat

1. Check if `/home/node/.openclaw/shared/analysis/macro-fundamentals/` has new or updated files since last analysis
2. If data has changed, re-run the full sentiment analysis pipeline from BOOTSTRAP.md
3. Write updated output to `/home/node/.openclaw/shared/analysis/signals/regime.md`
4. If no data has changed, reply HEARTBEAT_OK
