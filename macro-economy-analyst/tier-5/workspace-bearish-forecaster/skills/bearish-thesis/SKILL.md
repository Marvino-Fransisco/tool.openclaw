---
name: bearish-thesis
description: Construct the strongest possible bearish case thesis from aggregated macro analysis
---

# Bearish Thesis Skill

## Overview

This skill constructs bearish macro theses by scanning aggregated analysis for downside signals, evaluating their strength, and producing a structured thesis with confidence assessment.

## Confidence Scale

| Range | Meaning |
|-------|---------|
| 0% | No bearish case — data strongly contradicts downside thesis |
| 1-25% | Weak bearish case — minor downside signals, easily overwhelmed by positives |
| 26-50% | Moderate bearish case — meaningful downside risks but not the dominant scenario |
| 51-75% | Strong bearish case — downside signals clearly outweigh positives |
| 76-100% | Very strong bearish case — overwhelming evidence of impending downside |

## Bearish Signal Categories

When scanning aggregate data, look for signals in these categories:

### Monetary Policy Signals
- Hawkish Fed stance / rate hike expectations
- QT acceleration / balance sheet contraction
- Tightening financial conditions

### Economic Weakness Signals
- Rising unemployment / labor market deterioration
- Declining PMIs / economic activity contraction
- Consumer spending weakness / savings rate decline
- Corporate earnings decline / margin compression

### Market Stress Signals
- Credit spreads widening
- Yield curve inversion deepening
- VIX elevation / volatility regime shift
- Liquidity deterioration

### Geopolitical / Exogenous Risks
- Escalating geopolitical tensions
- Supply chain disruption
- Energy price spikes
- Sovereign debt stress

### Positioning / Sentiment Signals
- Extreme bullish positioning (contrarian bearish)
- Complacency indicators
- Crowded trades vulnerable to unwinds

## Output

Save the thesis to: `/home/node/.openclaw/shared/thesis/bearish.md`
