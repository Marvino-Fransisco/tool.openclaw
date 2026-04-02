# HEARTBEAT.md - Periodic Regime Check

## On Heartbeat

Execute the full analysis pipeline defined in `BOOTSTRAP.md`:

1. Read all files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Run the regime classification analysis
3. Overwrite `/home/node/.openclaw/shared/analysis/signals/regime.md` with fresh analysis

## Conditions

- **Always run** if the macro-fundamentals data has been updated since the last analysis (check file modification times if possible)
- **Always run** if no analysis output exists yet
- **Skip and reply HEARTBEAT_OK** only if data is unchanged and analysis was produced within the last hour

## Notes

- Keep this file focused on the single task: re-run regime analysis on heartbeat
- The output file timestamp serves as the record of when analysis was last produced
