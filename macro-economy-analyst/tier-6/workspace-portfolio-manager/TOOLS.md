# TOOLS.md - Data Paths & Portfolio Framework

_Reference for data sources, output locations, portfolio construction rules, and historical allocation templates._

---

## Data Paths

### Input 1: Aggregated Analysis Data

```
/home/node/.openclaw/shared/analysis/aggregate/
```

Read ALL `.md` files in this directory. This is the consolidated data from tier-1 through tier-4 agents.

### Input 2: Final Thesis

```
/home/node/.openclaw/shared/thesis/final.md
```

The probability-weighted bullish/bearish/neutral thesis from the tier-5 Final Forecaster. Contains:
- Probability split (bull % / bear % / neutral %)
- Dominant scenario identification
- Key evidence chains

### Output: Portfolio Allocation

```
/home/node/.openclaw/shared/advice/final.md
```

The completed portfolio allocation (overwritten each session).

---

## File Structure

```
/home/node/.openclaw/shared/
├── analysis/
│   └── aggregate/                  # INPUT 1: Aggregated analyses from tiers 1-4
│       └── *.md
├── thesis/
│   └── final.md                    # INPUT 2: Final probability-weighted thesis
├── advice/
│   └── final.md                    # OUTPUT: Your portfolio allocation
└── data/
    └── processed/                  # Raw data (reference if needed)
```

---

## Analysis Workflow

1. **Read** all `.md` files in `/home/node/.openclaw/shared/analysis/aggregate/`
2. **Read** `/home/node/.openclaw/shared/thesis/final.md`
3. **Cross-reference** thesis probabilities against raw aggregate data
4. **Map** macro regime to historical optimal allocations
5. **Evaluate** each asset class using specialist signals
6. **Construct** portfolio — percentages sum to exactly 100%
7. **Stress-test** — risks, correlations, tail scenarios
8. **Write** to `/home/node/.openclaw/shared/advice/final.md`

---

## Portfolio Construction Rules

### Allocation Discipline

- **MUST sum to exactly 100%** — no exceptions
- **Minimum granularity** = 1% increments (no decimals)
- **Cash is always valid** — do not feel pressured to be fully invested
- **Maximum single-asset concentration** = 50% (unless overwhelmingly justified by thesis)
- **Minimum allocation for any included asset** = 2% (below this, just exclude it)

### Regime-Based Allocation Templates

Use these as starting points, then adjust based on thesis probabilities and specialist signals:

#### Risk-On / Expansion (Bullish thesis dominant)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 40-60% | Growth, cyclical, EM tilt |
| Fixed Income | 10-20% | Credit over duration |
| Commodities | 5-15% | Energy, industrial metals |
| Crypto | 5-15% | Risk-on bid |
| Cash | 0-5% | Minimal |
| Gold/Defensive | 0-5% | Optional hedge |

#### Risk-Off / Contraction (Bearish thesis dominant)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 5-15% | Defensive only or zero |
| Fixed Income | 30-50% | Duration, quality, sovereigns |
| Commodities | 0-5% | Minimal exposure |
| Crypto | 0-5% | De-risk or exit |
| Cash | 15-35% | Dry powder, capital preservation |
| Gold/Defensive | 10-20% | Safe haven bid |

#### Transition / Uncertain (Neutral or mixed signals)
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 20-35% | Balanced, barbell quality/growth |
| Fixed Income | 20-35% | Intermediate duration |
| Commodities | 5-10% | Diversifier |
| Crypto | 3-8% | Small risk position |
| Cash | 10-20% | Optionality |
| Gold/Defensive | 5-10% | Hedge |

#### Crisis / Stress
| Asset Class | Typical Range | Notes |
|---|---|---|
| Equities | 0-10% | Maximum defensive |
| Fixed Income | 30-50% | Long duration sovereigns |
| Commodities | 0-5% | Volatile, avoid |
| Crypto | 0-3% | Maximum de-risk |
| Cash | 20-40% | Survival mode |
| Gold/Defensive | 15-25% | Core safe haven |

### Thesis Probability to Portfolio Tilt

| Thesis Split | Portfolio Action |
|---|---|
| Bull > 60% | Aggressive risk-on template |
| Bull 45-60% | Moderate risk-on with hedging |
| Neutral dominant (33-40% each) | Transition template, balanced |
| Bear 45-60% | Moderate risk-off with selective exposure |
| Bear > 60% | Aggressive risk-off / defensive template |

### Cross-Asset Correlation Rules

- If equity-bond correlation is **positive** (both falling) → increase cash and gold
- If all assets are correlated > 0.7 → portfolio is not diversified, increase cash
- If crypto correlates tightly with equities → do not count it as diversification
- Gold historically uncorrelated → valuable in crisis regimes

### Volatility Regime Adjustments

- **Low VIX / Complacency (< 15):** Can take more risk, but be wary of positioning
- **Normal VIX (15-20):** Standard allocation within regime template
- **Elevated VIX (20-30):** Reduce equity and crypto exposure by ~25% from template
- **High VIX / Crisis (> 30):** Maximum defensive posture regardless of thesis

---

## Historical Tracking

After each allocation, log in `memory/YYYY-MM-DD.md`:

```
## Portfolio Allocation - YYYY-MM-DD
- Thesis: Bull XX% / Bear XX% / Neutral XX%
- Regime: [Risk-On/Risk-Off/Transition/Crisis/Recovery]
- Allocation: [asset: %, asset: %, ...]
- Conviction: [High/Medium/Low]
- Key driver: [What drove the allocation]
- Max drawdown estimate: [X]%
- Kill switch: [What would make this wrong]
```

---

## Key Portfolio Metrics to Report

- **Expected return range** — Based on historical regime returns
- **Estimated max drawdown** — Worst case in the dominant scenario failing
- **Portfolio Sharpe estimate** — Risk-adjusted return expectation
- **Concentration score** — How diversified is this portfolio?
- **Correlation risk flag** — Are positions likely to move together?

---

_Update as data sources or allocation frameworks evolve._
