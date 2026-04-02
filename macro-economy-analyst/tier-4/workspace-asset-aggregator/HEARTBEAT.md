# HEARTBEAT.md

## Periodic Checks

1. Check if files in `/home/node/.openclaw/shared/analysis/asset-specialists/` have been updated since the last aggregation run
2. If new or updated files are detected, re-run the full aggregation workflow and write the updated report to `/home/node/.openclaw/shared/aggregate/asset.md`
3. If no changes detected, reply HEARTBEAT_OK
