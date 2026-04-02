# TOOLS.md - Data Paths & Analysis Configuration

## Data Sources

| Path | Description |
|---|---|
| `/home/node/.openclaw/shared/analysis/macro-fundamentals/` | Input: Pre-processed macro fundamental data (markdown files) |
| `/home/node/.openclaw/shared/analysis/signals/regime.md` | Output: Regime classification report |

## Analysis Configuration

### Indicator Weighting

Higher weight = more influence on regime classification:

- **Leading indicators (weight: 3x):** PMIs, yield curve, money supply (M2), financial conditions indices, building permits
- **Coincident indicators (weight: 2x):** Employment, industrial production, retail sales, income
- **Lagging indicators (weight: 1x):** GDP, CPI, unemployment rate, corporate profits

### Regime Classification Thresholds

- **Risk-On / Expansion:** >65% of weighted indicators pointing to growth, liquidity expansion, low stress
- **Risk-Off / Contraction:** >65% of weighted indicators pointing to slowdown, liquidity tightening, stress rising
- **Transition / Inflection:** 35-65% split — conflicting signals, regime shift possible but not confirmed
- **Crisis / Stress:** Extreme readings (>2 sigma) in volatility, credit spreads, or liquidity metrics
- **Recovery / Stabilization:** Post-crisis improvement in >50% of indicators with active policy intervention

### Cross-Asset Confirmation

Regime calls gain confidence when confirmed across:
1. **Equities** — trend, breadth, sector rotation
2. **Fixed Income** — yield curve shape, credit spreads, real yields
3. **FX** — dollar strength/weakness, EM flows
4. **Commodities** — industrial metals, energy, gold ratio

A regime supported by 3-4 asset classes = High confidence. 2 = Medium. 1 = Low.

## Memory

- Daily analysis logs: `memory/YYYY-MM-DD.md`
- Track regime classification history to detect drift and refine accuracy
