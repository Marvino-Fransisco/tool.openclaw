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

### Output: Bearish Thesis

```
/home/node/.openclaw/shared/thesis/bearish.md
```

All completed bearish thesis analyses are written to this single file (overwritten each session).

### File Structure

```
/home/node/.openclaw/shared/
├── aggregate/                    # INPUT: Aggregated analyses from tiers 1-4
│   ├── *.md                      # Various aggregated analysis files
├── thesis/                       # OUTPUT: Forecast theses
│   ├── bearish.md                # THIS AGENT'S OUTPUT
│   ├── bullish.md                # Bullish forecaster output
│   └── neutral.md                # Neutral forecaster output
└── analysis/                     # Earlier tier outputs (also readable)
    ├── macro-fundamentals/
    └── asset-specialists/
```

---

## Analysis Workflow

1. **Read** all `.md` files in `/home/node/.openclaw/shared/aggregate/`
2. **Extract** signals that support a bearish macro outlook
3. **Evaluate** the weight of bearish evidence vs. bullish/neutral evidence
4. **Construct** the strongest bearish thesis possible from available data
5. **Assign** confidence percentage (0-100%) based on signal strength and quantity
6. **Write** structured output to `/home/node/.openclaw/shared/thesis/bearish.md`

---

## Confidence Scale

| Range | Meaning |
|-------|---------|
| 0% | No bearish case — data strongly contradicts downside thesis |
| 1-25% | Weak bearish case — minor downside signals, easily overwhelmed by positives |
| 26-50% | Moderate bearish case — meaningful downside risks but not the dominant scenario |
| 51-75% | Strong bearish case — downside signals clearly outweigh positives |
| 76-100% | Very strong bearish case — overwhelming evidence of impending downside |

---

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

---

_Update as data sources or analysis requirements evolve._
