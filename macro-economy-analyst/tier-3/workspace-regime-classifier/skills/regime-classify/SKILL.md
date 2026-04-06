---
name: regime-classify
description: Classify current macro market regime with forward-looking transition forecasts
output: /home/node/.openclaw/shared/analysis/signals/regime.md
---

# Regime Classification Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Regime Types

- **Risk-On / Expansion** — Growth accelerating, liquidity abundant, volatility low, credit spreads tight, equities trending up
- **Risk-Off / Contraction** — Growth decelerating, liquidity tightening, volatility rising, credit spreads widening, flight to safety
- **Transition / Inflection** — Mixed signals, diverging indicators, regime shift underway but direction uncertain
- **Crisis / Stress** — Sharp dislocations, extreme volatility, liquidity crises, credit freeze, contagion risk
- **Recovery / Stabilization** — Post-crisis normalization, policy intervention active, early signs of repair

## Indicator Weighting

Higher weight = more influence on regime classification:

- **Leading indicators (weight: 3x):** PMIs, yield curve, money supply (M2), financial conditions indices, building permits
- **Coincident indicators (weight: 2x):** Employment, industrial production, retail sales, income
- **Lagging indicators (weight: 1x):** GDP, CPI, unemployment rate, corporate profits

## Classification Thresholds

- **Risk-On / Expansion:** >65% of weighted indicators pointing to growth, liquidity expansion, low stress
- **Risk-Off / Contraction:** >65% of weighted indicators pointing to slowdown, liquidity tightening, stress rising
- **Transition / Inflection:** 35-65% split — conflicting signals, regime shift possible but not confirmed
- **Crisis / Stress:** Extreme readings (>2 sigma) in volatility, credit spreads, or liquidity metrics
- **Recovery / Stabilization:** Post-crisis improvement in >50% of indicators with active policy intervention

## Cross-Asset Confirmation

Regime calls gain confidence when confirmed across:

1. **Equities** — trend, breadth, sector rotation
2. **Fixed Income** — yield curve shape, credit spreads, real yields
3. **FX** — dollar strength/weakness, EM flows
4. **Commodities** — industrial metals, energy, gold ratio

A regime supported by 3-4 asset classes = High confidence. 2 = Medium. 1 = Low.

## Report Template

```markdown
# Regime Classification Report
**As-of:** [date based on source data timestamps]
**Analyst:** Regime Classifier (Tier-3 Agent)

## Executive Summary
## Current Regime Classification
## Weighted Indicator Analysis
## Regime Transition Probabilities
## Cross-Asset Confirmation Matrix
## Forward Regime Outlook
### Near-Term (0-4 Weeks)
### Medium-Term (1-3 Months)
### Long-Term (3-12 Months)
## Key Triggers for Regime Change
## Confidence Assessment
```

## Downstream Consumers

- Tier-4 signal aggregator reads this file as a primary input
- Tier-5 forecasters use this for scenario framing
- Tier-6 portfolio manager uses this for allocation regime mapping
- Tier-7 synthesizer includes this in the final report
