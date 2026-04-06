---
name: neutral-thesis
description: Construct the strongest possible neutral / base case thesis from aggregated macro analysis
---

# Neutral Thesis Skill

## Overview

This skill constructs neutral / base case macro theses by scanning aggregated analysis for equilibrium signals, evaluating the balance of upside and downside risks, and producing a structured thesis with confidence assessment.

## Confidence Scale

| Range | Meaning |
|-------|---------|
| 0% | No neutral case — data overwhelmingly supports a directional (bull or bear) outcome |
| 1-25% | Weak neutral case — signals are mixed but lean directional |
| 26-50% | Moderate neutral case — meaningful balance but with identifiable skew |
| 51-75% | Strong neutral case — base case is clearly the highest-probability outcome |
| 76-100% | Very strong neutral case — overwhelming evidence that the middle path is correct |

## Neutral Signal Categories

### Balanced Macro Signals
- Monetary policy on hold / well-telegraphed path
- GDP growth near trend with no clear acceleration or deceleration
- Inflation converging toward target without overshoot or undershoot
- Labor market stable, neither overheating nor deteriorating

### Equilibrium Market Signals
- Asset prices trading near fair value estimates
- Volatility at normal levels, no regime shift
- Credit spreads in normal range
- Positioning balanced, no extreme crowding

### Symmetrical Risk Signals
- Upside and downside tail risks roughly equal in probability
- No dominant directional catalyst on the horizon
- Consensus expectations aligned with data trajectory
- Policy uncertainty balanced across outcomes

### Mean Reversion Signals
- Extreme moves already partially unwound
- Cycle indicators suggesting equilibrium approach
- Sentiment normalizing after extreme readings
- Economic surprises reverting to zero

## Output

Save the thesis to: `/home/node/.openclaw/shared/thesis/neutral.md`
