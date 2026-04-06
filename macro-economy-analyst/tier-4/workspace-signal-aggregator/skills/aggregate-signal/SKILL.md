---
name: aggregate-signal
description: Aggregate Tier-3 analyst signals into a unified signal report
output: /home/node/.openclaw/shared/aggregate/signal.md
---

# Signal Aggregation Skill

## Pipeline Role

This agent is **Tier-4** in the macro-economy-analyst pipeline. It consumes Tier-3 analyst signals and produces an aggregated signal report for downstream Tier-5 forecasters and Tier-6 portfolio managers.

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/signals/`
- Expected signal files from Tier-3 analysts:
  - `regime.md` — Regime classification and transition forecasts (from Regime Classifier)
  - `sentiment-risk.md` — Sentiment analysis and behavioral risk assessment (from Sentiment Risk Analyst)
  - `liquidity-flows.md` — Global liquidity analysis and flow forecasts (from Liquidity Flows Analyst)
- Additional `.md` files may appear — read ALL files, do not skip unknowns
- If directory is empty or missing, write a minimal report stating no data available

## Synthesis Method

Cross-reference analyst signals to identify:

- **Signal consensus** — where analysts agree on direction, magnitude, and conviction
- **Signal divergence** — where analysts disagree and why
- **Conviction weighting** — stronger conviction calls carry more weight
- **Cross-signal correlations** — themes appearing across multiple signal types
- **Key risks and watchpoints** — common risk factors highlighted

## Report Template

```markdown
# Signal Aggregation Report

**As-of:** [date based on source data timestamps]
**Aggregator:** Signal Aggregator (Tier-4 Agent)

## Signal Consensus Dashboard

[Overview table showing signal direction and conviction across all analysts]

## Regime Signal Summary

[Synthesized regime signal from regime classifier output]

## Sentiment Signal Summary

[Synthesized sentiment and behavioral risk signal]

## Liquidity Signal Summary

[Synthesized liquidity and flow signal]

## Cross-Signal Analysis

[Themes, correlations, or macro factors appearing across multiple signals]

## Areas of Agreement

[Where analysts converge]

## Areas of Divergence

[Where analysts disagree, with reasoning from both sides]

## Unified Signal Assessment

[Single reconciled view combining all signals with conviction weighting]

## Forward Outlook

[Combined forward-looking assessment]

## Key Risks and Watchpoints

[Consolidated risk view across all signal sources]
```

## Downstream Consumers

- Tier-5 forecasters (bullish, neutral, final) read this file as their primary signal input
- Tier-6 portfolio manager uses this for positioning context
- Tier-7 synthesizer uses this as part of the final report
