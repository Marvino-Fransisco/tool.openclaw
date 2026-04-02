# TOOLS.md - Fixed Income Analyst Tools & Notes

## Data Sources

### Input Pipeline
- **Macro-Fundamentals Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
  - Contains `.md` files from Tier-1 agents
  - Files are overwritten each cycle with fresh analysis
  - Read ALL files in directory each run — do not cache old versions

### Output Pipeline
- **Analysis Output:** `/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md`
  - Overwrite completely each analysis cycle
  - This file is consumed by downstream Tier-2+ agents

## Key Fixed Income Benchmarks to Reference

When the macro data references these, map to fixed income implications:

### Government Bonds (Rates)
- **US Treasuries (2Y, 5Y, 10Y, 30Y)** — Benchmark risk-free rates; driven by Fed policy, inflation, growth
- **German Bunds** — European benchmark; ECB policy, eurozone growth
- **UK Gilts** — BOE policy, UK inflation dynamics
- **Japanese JGBs** — YCC policy, BoJ normalization path

### Yield Curve Indicators
- **2s10s spread** — Recession signal when inverted; growth expectations proxy
- **5s30s spread** — Duration demand and inflation expectations
- **3m10s spread** — Fed's preferred recession indicator
- **Yield curve steepening/flattening** — Regime change signal

### Credit Markets
- **Investment Grade (IG) spreads** — CDX IG, US IG OAS; risk appetite, fundamental credit health
- **High Yield (HY) spreads** — CDX HY, US HY OAS; default cycle positioning, economic sensitivity
- **Emerging Market (EM) debt spreads** — EMBI Global; dollar strength, risk appetite, country fundamentals
- **Commercial Mortgage-Backed Securities (CMBS)** — Real estate stress, credit tightening

### Inflation-Linked
- **TIPS (US)** — Real yields, breakeven inflation
- **10Y breakeven inflation rate** — Market-implied inflation expectations
- **5Y5Y forward inflation** — Medium-term inflation anchor

### Money Markets & Short End
- **Fed Funds Rate / SOFR** — Policy rate anchor
- **Eurodollar / SOFR futures** — Market-implied rate path
- **2Y Treasury yield** — Most policy-rate sensitive tenor

## Macro-to-Fixed-Income Mapping Reference

| Macro Signal | Fixed Income Impact |
|---|---|
| Hawkish Fed / rate hikes | Bearish short end, flattening curve, wider credit spreads |
| Dovish Fed / rate cuts | Bullish across curve, steepening, tighter credit spreads |
| Rising inflation expectations | Bearish nominal bonds, bullish TIPS, higher breakevens |
| Disinflation / deflation fears | Bullish nominal bonds, bearish TIPS, flight to quality |
| Strong GDP growth | Bearish long end (higher yields), steepening, tighter spreads |
| Recession fears | Bullish bonds (lower yields), flattening/inversion, wider spreads |
| Large fiscal deficits | Bearish long end (supply), higher term premium |
| Tightening financial conditions | Flight to quality (bonds rally), wider credit spreads |
| Loosening financial conditions | Bearish duration, tighter credit spreads, reach for yield |
| Strong dollar | Bearish EM debt, tighter US IG (foreign demand) |
| Weak dollar | Bullish EM debt, potential inflation passthrough to nominal yields |
| Credit cycle deterioration | Wider IG/HY spreads, flight to quality, MBS underperformance |
| Geopolitical risk escalation | Flight to quality (Treasuries rally), wider credit/EM spreads |
| QT / balance sheet reduction | Bearish term premium, higher long-end yields |
| QE / balance sheet expansion | Bullish term premium compression, lower long-end yields |

## Key Analytical Relationships

### Duration and Rate Sensitivity
- Short end (2Y): Driven primarily by Fed policy expectations
- Belly (5Y): Blend of policy and growth expectations
- Long end (10Y, 30Y): Driven by growth, inflation, term premium, and fiscal dynamics

### Credit Spread Drivers
- Economic growth cycle (fundamental default risk)
- Financial conditions (ease of refinancing)
- Investor positioning and reach-for-yield behavior
- Sector-specific risks (energy, real estate, financials)

### Cross-Asset Links
- Equity-bond correlation: Positive (inflation-driven regime) or negative (growth-driven regime)
- Dollar-Treasury relationship: Strong dollar can attract foreign Treasury demand
- Commodity-bond link: Rising commodities = inflationary pressure = bearish nominal bonds

## Analysis Notes

- Track previous analysis themes to identify shifts between cycles
- Store analysis metadata in `memory/YYYY-MM-DD.md`
- Flag any data quality issues (missing files, stale timestamps, contradictions between sources)
