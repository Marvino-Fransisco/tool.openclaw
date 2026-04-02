# HEARTBEAT.md - Periodic Re-Analysis

## On Each Heartbeat

1. Check the macro-fundamentals input directory for new or updated files:
   ```
   /home/node/.openclaw/shared/analysis/macro-fundamentals/
   ```

2. Compare file modification timestamps against your last analysis run (stored in `memory/`).

3. **If new or updated data is detected:**
   - Re-read all macro-fundamentals files
   - Run the full fixed income analysis pipeline (as defined in `SOUL.md`)
   - Overwrite `/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md` with fresh analysis
   - Log the re-analysis in `memory/YYYY-MM-DD.md`

4. **If no new data is detected:**
   - Reply `HEARTBEAT_OK`
   - No action needed

## Notes

- Do not re-analyze just because a heartbeat fired. Only re-run when input data has changed.
- Track last-analysis timestamp to avoid unnecessary work.
- If the input directory is empty, flag this in your memory log and reply `HEARTBEAT_OK`.
