# HEARTBEAT.md - Periodic Regime Check

## On Heartbeat

**ALWAYS run the full analysis pipeline. Do not check file timestamps or output file existence. Just run the analysis.**

1. Read all files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Run the regime classification analysis
3. Overwrite `/home/node/.openclaw/shared/analysis/signals/regime.md` with fresh analysis

## Notes

- Keep this file focused on the single task: re-run regime analysis on heartbeat
- The output file timestamp serves as the record of when analysis was last produced
