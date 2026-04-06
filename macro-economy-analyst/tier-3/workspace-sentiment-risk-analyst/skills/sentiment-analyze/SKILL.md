---
name: sentiment-analyze
description: Analyze macro fundamentals for market sentiment and behavioral risk implications
output: /home/node/.openclaw/shared/analysis/signals/sentiment-risk.md
---

# Sentiment Analysis Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Sibling Agents (Tier 3)

- **Regime Classifier** (`workspace-regime-classifier`) — classifies market regime based on macro data
- **Liquidity Flows Analyst** (`workspace-liquidity-flows-analyst`) — analyzes liquidity conditions

## Sentiment Dimensions

Assess market sentiment along these axes:

- **Greed / Euphoria** — Extreme optimism, FOMO-driven buying, complacency, tight spreads despite deteriorating fundamentals, crowded positioning
- **Fear / Panic** — Extreme pessimism, capitulation selling, flight to safety, widening spreads, forced liquidation, credit freeze fears
- **Optimism / Confidence** — Constructive outlook, measured risk-taking, normal participation, orderly markets, balanced positioning
- **Pessimism / Caution** — Defensive posture, de-risking, hedging elevated, wait-and-see mentality, selective selling
- **Confusion / Uncertainty** — Mixed signals, whipsaw price action, narrative fatigue, low conviction, institutional paralysis

## Analytical Principles

- **Sentiment leads positioning** — how people feel determines how they allocate
- **Contrarian awareness** — extreme sentiment signals potential reversal; identify overcrowded consensus
- **Correlate macro with sentiment** — data shocks shift emotional baselines; map CPI misses to behavioral responses
- **Stated vs revealed sentiment** — surveys say one thing; flows, volatility, and positioning say another. Trust revealed behavior.
- **Timeframes are critical** — sentiment shifts in hours (panic), days (narrative rotation), weeks (trend reassessment), or months (secular mood change)
- **Catalyst-aware** — identify upcoming events (FOMC, NFP, earnings, geopolitical) as sentiment inflection points
- **Cross-asset confirmation** — equity put/call, bond fund flows, FX safe-haven demand, commodity positioning, crypto momentum all tell a story
- **Behavioral biases** — recency bias, anchoring, confirmation bias, and herding are always at play

## Report Template

```markdown
# Sentiment Risk Analysis
**As-of:** [date based on source data timestamps]
**Analyst:** Sentiment Risk Analyst (Tier-3 Agent)

## Executive Summary
## Current Sentiment Classification
## Behavioral Bias Assessment
## Positioning Analysis
## Cross-Asset Sentiment Indicators
## Catalyst Watch
## Forward Sentiment Outlook
### Near-Term (0-4 Weeks)
### Medium-Term (1-3 Months)
### Long-Term (3-12 Months)
## Sentiment-Driven Risk Assessment
## Contrarian Opportunities
## Confidence Assessment
```

## Downstream Consumers

- Tier-4 signal aggregator reads this file as a primary input
- Tier-5 forecasters use this for sentiment-driven scenario weighting
- Tier-6 portfolio manager uses this for risk positioning
- Tier-7 synthesizer includes this in the final report
