---
name: fi-analyze
description: Analyze macro fundamentals for fixed income market impact across rates, credit, and real yields
output: /home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md
---

# Fixed Income Analysis Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Analytical Framework

When analyzing macro-fundamentals data for fixed income impact, consider:

1. **Central bank policy trajectory** — The single most important driver. Rate expectations, balance sheet policy, and forward guidance directly set the short end and influence the whole curve.
2. **Inflation regime** — Sticky inflation is bearish for nominal bonds but bullish for TIPS. Disinflation drives duration outperformance. Deflation fears trigger flight-to-quality rallies.
3. **Growth impulse** — Strong growth steepens the curve (higher long end); recession fears flatten or invert it.
4. **Fiscal dynamics** — Large deficits increase Treasury supply, pushing yields higher. Fiscal-monetary coordination (or lack thereof) shapes the term premium.
5. **Real yields and term premium** — Decompose nominal yields into real yields + breakeven inflation + term premium.
6. **Credit conditions** — Tightening financial conditions widen credit spreads; loose conditions compress them.
7. **Global flows and positioning** — Foreign demand for Treasuries, duration hedging flows, ETF fund flows, and dealer positioning.

## Key Fixed Income Benchmarks

### Government Bonds (Rates)
- **US Treasuries (2Y, 5Y, 10Y, 30Y)** — Benchmark risk-free rates
- **German Bunds** — European benchmark; ECB policy
- **UK Gilts** — BOE policy, UK inflation dynamics
- **Japanese JGBs** — YCC policy, BoJ normalization path

### Yield Curve Indicators
- **2s10s spread** — Recession signal when inverted
- **5s30s spread** — Duration demand and inflation expectations
- **3m10s spread** — Fed's preferred recession indicator
- **Yield curve steepening/flattening** — Regime change signal

### Credit Markets
- **Investment Grade (IG) spreads** — CDX IG, US IG OAS
- **High Yield (HY) spreads** — CDX HY, US HY OAS
- **Emerging Market (EM) debt spreads** — EMBI Global
- **CMBS** — Real estate stress, credit tightening

### Inflation-Linked
- **TIPS (US)** — Real yields, breakeven inflation
- **10Y breakeven inflation rate** — Market-implied inflation expectations
- **5Y5Y forward inflation** — Medium-term inflation anchor

### Money Markets & Short End
- **Fed Funds Rate / SOFR** — Policy rate anchor
- **Eurodollar / SOFR futures** — Market-implied rate path
- **2Y Treasury yield** — Most policy-rate sensitive tenor

## Macro-to-Fixed-Income Mapping

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

## Report Template

```markdown
# Fixed Income Market Analysis
**As-of:** [date based on source data timestamps]
**Analyst:** Fixed Income Analyst (Tier-2 Agent)

## Executive Summary
## 1. Macro Environment Assessment
### Monetary Policy Stance
### Inflation Dynamics
### Growth Outlook
### Fiscal Dynamics
## 2. Yield Curve Analysis
### Current Curve Shape
### Key Spreads
### Term Premium Decomposition
## 3. Macro-Fixed Income Correlation Matrix
### Current Correlations
### Net Macro Signal
## 4. Fixed Income Market Interpretation
### What This Means for Treasuries
### What This Means for Credit
### What This Means for TIPS / Real Yields
### Key Macro Catalysts Ahead
## 5. Forward-Looking Scenarios
### Base Case ([X]% probability)
### Bull Case for Bonds — Lower Yields ([X]% probability)
### Bear Case for Bonds — Higher Yields ([X]% probability)
## 6. Credit Market Deep Dive
### Investment Grade
### High Yield
### Emerging Market Debt
## 7. Risk Assessment
### Top 3 Upside Risks for Bonds (Lower Yields)
### Top 3 Downside Risks for Bonds (Higher Yields)
### Early Warning Indicators
## Key Takeaways
```

## Downstream Consumers

- Tier-2 signal aggregator reads this file as a primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for cross-asset confirmation
- Tier-4 forecasters use this for FI-specific scenario framing
- Tier-7 synthesizer includes this in the final report
