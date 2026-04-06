---
name: final-thesis
description: Synthesize all forecaster theses and raw aggregate data into a single probability-weighted macro outlook
---

# Final Thesis Skill

## Overview

This skill synthesizes three individual forecaster theses (bullish, bearish, neutral) with raw aggregate data into a single definitive probability-weighted macro outlook.

## Probability Allocation Rules

- **MUST sum to exactly 100%** — no exceptions
- **Reflect genuine conviction** — do not default to 34/33/33 unless truly uncertain
- **Dominant scenario** = highest percentage (this is the "call")
- **Near-zero allocations** are valid if a scenario has almost no supporting evidence
- **Minimum granularity** = 1% increments (no decimals)

### Example Distributions

| Context | Bull | Bear | Neutral | Interpretation |
|---------|------|------|---------|----------------|
| Strong bull | 65% | 15% | 20% | Clear upside bias, bearish tail risk |
| Mild bull | 45% | 25% | 30% | Upside lean but meaningful uncertainty |
| Genuine uncertainty | 34% | 33% | 33% | No clear signal, coin-flip territory |
| Strong bear | 10% | 70% | 20% | Clear downside risk, small bull tail |
| Risk-off | 5% | 80% | 15% | Overwhelming bearish evidence |

## Thesis Adjudication Framework

When evaluating each forecaster's thesis, assess:

### Signal Quality
- Is the evidence cited actually in the raw data?
- Are the logic chains sound (signal → implication → scenario)?
- Are there contradictions within the thesis?

### Signal Weight
- How many independent signals support this scenario?
- Are they from diverse categories (monetary, economic, market, geopolitical)?
- Do multiple data points corroborate the same conclusion?

### Blind Spots
- What is this forecaster ignoring or downplaying?
- Are there signals in the raw data that contradict this thesis?
- Does another forecaster's counter-argument hold up against the raw data?

### Confidence Calibration
- Does the forecaster's confidence percentage match the actual signal strength?
- Is the forecaster overconfident or underconfident relative to the evidence?

## Output

Save the final thesis to: `/home/node/.openclaw/shared/thesis/final.md`
