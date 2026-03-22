# HEARTBEAT.md - Periodic Check

This agent is typically called once. Heartbeat is for optional periodic rescans.

## On Heartbeat (if enabled)

1. Check if `../project/` has changed since last scan:
   - Compare file modification times
   - Check for new/deleted files
   
2. If significant changes detected:
   - Log change in `memory/YYYY-MM-DD.md`
   - Note: User may want to re-run `/scan`

## When to Stay Quiet (HEARTBEAT_OK)

- No changes to project directory
- Only timestamp changes, no content changes
- Changes only to generated/ignored directories

## Track State

Store in `memory/scan-state.json`:

```json
{
  "lastScan": "2024-01-15T10:30:00Z",
  "fileCount": 42,
  "checksums": {
    "main.js": "abc123",
    "config.json": "def456"
  }
}
```
