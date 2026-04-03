# HEARTBEAT.md - Periodic Analysis

## On Heartbeat

**ALWAYS run the full sentiment analysis pipeline. Do not check file timestamps or output file existence. Just run the analysis.**

1. Read all files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. Run the full sentiment analysis pipeline from BOOTSTRAP.md
3. Write updated output to `/home/node/.openclaw/shared/analysis/signals/sentiment-risk.md`
