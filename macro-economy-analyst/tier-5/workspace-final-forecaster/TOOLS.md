# TOOLS.md - Data Paths & Configuration

_Reference for data sources, output locations, and analysis workflow._

---

## Data Paths

### Input 1: Aggregated Analysis Data

```
/home/node/.openclaw/shared/analysis/aggregate/
```

Read ALL `.md` files in this directory. This is the raw aggregated data from tier-1 through tier-4 agents, including:
- Macro fundamental analyses
- Asset class specialist analyses
- Signal aggregation summaries
- Regime classification outputs
- Liquidity and flow analyses

### Input 2: Individual Forecaster Theses

```
/home/node/.openclaw/shared/thesis/
```

Read ALL `.md` files in this directory:
- `bullish.md` — Bullish forecaster's thesis (from Apollo 🐂)
- `bearish.md` — Bearish forecaster's thesis (from Bear 🐻)
- `neutral.md` — Neutral forecaster's thesis (from Neutral ⚖️)

Each file contains a structured thesis with confidence percentage and supporting evidence.

### Output: Final Thesis

```
/home/node/.openclaw/shared/thesis/final.md
```

The completed final thesis is written to this single file (overwritten each session).

### File Structure

```
/home/node/.openclaw/shared/
├── analysis/
│   └── aggregate/                  # INPUT 1: Raw aggregated analyses from tiers 1-4
│       └── *.md                    # Various aggregated analysis files
├── thesis/                         # INPUT 2 + OUTPUT
│   ├── bullish.md                  # Bullish forecaster output (READ)
│   ├── bearish.md                  # Bearish forecaster output (READ)
│   ├── neutral.md                  # Neutral forecaster output (READ)
│   └── final.md                    # THIS AGENT'S OUTPUT (WRITE)
└── data/                           # Earlier tier raw data (reference if needed)
    ├── raw/
    └── processed/
```

---

## Analysis Workflow

1. **Read** all `.md` files in `/home/node/.openclaw/shared/analysis/aggregate/`
2. **Read** all `.md` files in `/home/node/.openclaw/shared/thesis/` (bullish.md, bearish.md, neutral.md)
3. **Cross-reference** each forecaster's claims against the raw aggregate data — verify, challenge, corroborate
4. **Evaluate** the strength and internal consistency of each thesis
5. **Assign** probability percentages to bull, bear, and neutral that sum to exactly 100%
6. **Write** structured output to `/home/node/.openclaw/shared/thesis/final.md`

---

## Probability Allocation Rules

- **MUST sum to exactly 100%** — no exceptions
- **Reflect genuine conviction** — do not default to 34/33/33 unless truly uncertain
- **Dominant scenario** = highest percentage (this is the "call")
- **Residual split** = how the remaining probability is divided between the other two scenarios
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

---

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

---

## Historical Tracking

After each analysis, log the percentage allocation in `memory/YYYY-MM-DD.md` for calibration review:

```
## Final Forecast - YYYY-MM-DD
- Bull: XX% | Bear: XX% | Neutral: XX%
- Dominant scenario: [Bull/Bear/Neutral]
- Key driver: [What tipped the scales]
- Forecaster agreement: [Bull/Bear/Neutral confidence levels]
```

This allows future sessions to review calibration accuracy.

---

_Update as data sources or analysis requirements evolve._
