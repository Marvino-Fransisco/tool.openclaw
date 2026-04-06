---
name: allocate
description: Construct a percentage-weighted portfolio allocation based on macro regime, thesis probabilities, and aggregated analysis
---

# Portfolio Allocation Skill

## Overview

This skill constructs portfolio allocations by mapping macro regimes and thesis probabilities to asset class weights. It provides the rules, templates, and constraints for building a disciplined portfolio.

## Allocation Discipline

- **MUST sum to exactly 100%** — no exceptions
- **Minimum granularity** = 1% increments (no decimals)
- **Cash is always valid** — do not feel pressured to be fully invested
- **Maximum single-asset concentration** = 50% (unless overwhelmingly justified by thesis)
- **Minimum allocation for any included asset** = 2% (below this, just exclude it)

## Asset Classes

- **Equities** — S&P 500, Nasdaq, International, EM
- **Fixed Income** — Sovereign bonds, corporate credit, TIPS
- **Commodities** — Energy, precious metals, industrial metals, agriculture
- **Crypto / Digital Assets** — BTC, ETH, major altcoins
- **Cash & Equivalents** — T-bills, money markets, stablecoins
- **Alternative / Defensive** — Gold, volatility, inverse positions (if applicable)

## Regime-Based Allocation Templates

Use these as starting points, then adjust based on thesis probabilities and specialist signals:

### Risk-On / Expansion (Bullish thesis dominant)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 40-60% | Growth, cyclical, EM tilt |
| Fixed Income | 10-20% | Credit over duration |
| Commodities | 5-15% | Energy, industrial metals |
| Crypto | 5-15% | Risk-on bid |
| Cash | 0-5% | Minimal |
| Gold/Defensive | 0-5% | Optional hedge |

### Risk-Off / Contraction (Bearish thesis dominant)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 5-15% | Defensive only or zero |
| Fixed Income | 30-50% | Duration, quality, sovereigns |
| Commodities | 0-5% | Minimal exposure |
| Crypto | 0-5% | De-risk or exit |
| Cash | 15-35% | Dry powder, capital preservation |
| Gold/Defensive | 10-20% | Safe haven bid |

### Transition / Uncertain (Neutral or mixed signals)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 20-35% | Balanced, barbell quality/growth |
| Fixed Income | 20-35% | Intermediate duration |
| Commodities | 5-10% | Diversifier |
| Crypto | 3-8% | Small risk position |
| Cash | 10-20% | Optionality |
| Gold/Defensive | 5-10% | Hedge |

### Crisis / Stress
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 0-10% | Maximum defensive |
| Fixed Income | 30-50% | Long duration sovereigns |
| Commodities | 0-5% | Volatile, avoid |
| Crypto | 0-3% | Maximum de-risk |
| Cash | 20-40% | Survival mode |
| Gold/Defensive | 15-25% | Core safe haven |

## Thesis Probability to Portfolio Tilt

| Thesis Split | Portfolio Action |
|---|---|
| Bull > 60% | Aggressive risk-on template |
| Bull 45-60% | Moderate risk-on with hedging |
| Neutral dominant (33-40% each) | Transition template, balanced |
| Bear 45-60% | Moderate risk-off with selective exposure |
| Bear > 60% | Aggressive risk-off / defensive template |

## Cross-Asset Correlation Rules

- If equity-bond correlation is **positive** (both falling) → increase cash and gold
- If all assets are correlated > 0.7 → portfolio is not diversified, increase cash
- If crypto correlates tightly with equities → do not count it as diversification
- Gold historically uncorrelated → valuable in crisis regimes

## Volatility Regime Adjustments

- **Low VIX / Complacency (< 15):** Can take more risk, but be wary of positioning
- **Normal VIX (15-20):** Standard allocation within regime template
- **Elevated VIX (20-30):** Reduce equity and crypto exposure by ~25% from template
- **High VIX / Crisis (> 30):** Maximum defensive posture regardless of thesis

## Analysis Framework

When constructing the portfolio, systematically evaluate:

1. **Final Thesis Probability Split** — What is the bullish/bearish/neutral probability?
2. **Regime Classification** — What regime are we in?
3. **Macro Fundamental Strength** — How strong is the macro backdrop for each asset class?
4. **Asset Specialist Signals** — What does each specialist recommend?
5. **Liquidity & Flow Environment** — Is liquidity supportive or restrictive?
6. **Sentiment & Positioning** — Is the crowd already positioned where we want to be?
7. **Cross-Asset Correlations** — Are correlations elevated?
8. **Volatility Regime** — Is volatility low or high?

## Output

Save the allocation to: `/home/node/.openclaw/shared/advice/portfolio.md`
