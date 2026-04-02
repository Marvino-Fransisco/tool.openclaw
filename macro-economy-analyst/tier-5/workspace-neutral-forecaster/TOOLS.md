# TOOLS.md - Data Paths & Configuration

_Reference for data sources, output locations, and analysis workflow._

---

## Data Paths

### Input: Aggregated Analysis Data

```
/home/node/.openclaw/shared/aggregate/
```

Read ALL `.md` files in this directory. This directory contains aggregated outputs from tier-1 through tier-4 agents, including:
- Macro fundamental analyses
- Asset class specialist analyses
- Signal aggregation summaries
- Regime classification outputs
- Liquidity and flow analyses

### Output: Neutral Thesis

```
/home/node/.openclaw/shared/thesis/neutral.md
```

All completed neutral thesis analyses are written to this single file (overwritten each session).

### File Structure

```
/home/node/.openclaw/shared/
├── aggregate/                    # INPUT: Aggregated analyses from tiers 1-4
│   ├── *.md                      # Various aggregated analysis files
├── thesis/                       # OUTPUT: Forecast theses
│   ├── bearish.md                # Bearish forecaster output
│   ├── bullish.md                # Bullish forecaster output
│   └── neutral.md                # THIS AGENT'S OUTPUT
└── analysis/                     # Earlier tier outputs (also readable)
    ├── macro-fundamentals/
    └── asset-specialists/
```

---

## Analysis Workflow

1. **Read** all `.md` files in `/home/node/.openclaw/shared/aggregate/`
2. **Extract** signals that support a neutral / base case macro outlook
3. **Evaluate** the weight of neutral evidence vs. bullish/bearish evidence
4. **Construct** the strongest neutral thesis possible from available data
5. **Assign** confidence percentage (0-100%) based on signal strength and quantity
6. **Write** structured output to `/home/node/.openclaw/shared/thesis/neutral.md`

---

## Confidence Scale

| Range | Meaning |
|-------|---------|
| 0% | No neutral case — data overwhelmingly supports a directional (bull or bear) outcome |
| 1-25% | Weak neutral case — signals are mixed but lean directional |
| 26-50% | Moderate neutral case — meaningful balance but with identifiable skew |
| 51-75% | Strong neutral case — base case is clearly the highest-probability outcome |
| 76-100% | Very strong neutral case — overwhelming evidence that the middle path is correct |

---

## Neutral Signal Categories

When scanning aggregate data, look for signals in these categories:

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

---

_Update as data sources or analysis requirements evolve._
