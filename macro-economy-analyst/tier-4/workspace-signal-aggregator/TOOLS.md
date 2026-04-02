# TOOLS.md - Local Notes

## Pipeline Role

This agent is **Tier-4** in the macro-economy-analyst pipeline. It consumes Tier-3 analyst signals and produces an aggregated signal report for downstream Tier-5 forecasters and Tier-6 portfolio managers.

## Input Sources

All source signal files are located at:
```
/home/node/.openclaw/shared/analysis/signals/
```

Expected signal files from Tier-3 analysts:

- `regime.md` — Regime classification and transition forecasts (from Regime Classifier)
- `sentiment-risk.md` — Sentiment analysis and behavioral risk assessment (from Sentiment Risk Analyst)
- `liquidity-flows.md` — Global liquidity analysis and flow forecasts (from Liquidity Flows Analyst)

Additional `.md` files may appear in the signals directory. Read ALL markdown files present — do not skip unknown files.

## Output

Single aggregated file written to:
```
/home/node/.openclaw/shared/aggregate/signal.md
```

## Downstream Consumers

- Tier-5 forecasters (bullish, neutral, final) read this file as their primary signal input
- Tier-6 portfolio manager uses this for positioning context
- Tier-7 synthesizer uses this as part of the final report

## Output Structure

```markdown
# Signal Aggregation Report
**As-of:** [date based on source data timestamps]
**Aggregator:** Signal Aggregator (Tier-4 Agent)

## Signal Consensus Dashboard
## Regime Signal Summary
## Sentiment Signal Summary
## Liquidity Signal Summary
## Cross-Signal Analysis
## Areas of Agreement
## Areas of Divergence
## Unified Signal Assessment
## Forward Outlook
## Key Risks and Watchpoints
```

---

_This file documents your operational context. Keep it updated as the pipeline evolves._
