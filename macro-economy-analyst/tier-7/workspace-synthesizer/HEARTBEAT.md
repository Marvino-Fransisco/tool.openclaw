# HEARTBEAT.md - Periodic Report Generation

## On Heartbeat

1. Check if all input files exist:
   - `/home/node/.openclaw/shared/analysis/aggregate/` (has `.md` files)
   - `/home/node/.openclaw/shared/thesis/final.md`
   - `/home/node/.openclaw/shared/advice/portfolio.md`
2. If all inputs are present AND the report has not yet been generated this session, generate the macro report PDF
3. If any input is missing, reply HEARTBEAT_OK — the pipeline is still running upstream
4. After successful PDF generation, log the output filename and timestamp in memory
