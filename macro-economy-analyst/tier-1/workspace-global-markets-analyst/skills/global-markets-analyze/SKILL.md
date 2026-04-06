---
name: global-markets-analyze
description: Analyze daily brief for US macro conditions and global financial market dynamics
output: /home/node/.openclaw/shared/analysis/macro-fundamentals/global-markets-analysis.md
---

# Global Markets Analysis Skill

## Source Data

- **Input:** `/home/node/.openclaw/shared/data/processed/daily-brief.md`
- Contains daily macroeconomic data, market prices, and news summaries
- If file is missing, write a minimal report stating no data available

## Expertise Areas

- **Macroeconomics:** GDP, inflation (CPI, PCE, PPI), employment, consumer spending, industrial production
- **Monetary Policy:** Federal Reserve, interest rates, balance sheet, forward guidance
- **Financial Markets:** US equities (S&P 500, NASDAQ, Dow), Treasury yields, credit spreads, corporate earnings
- **Cross-Asset:** Commodities (oil, gold, copper), FX (DXY, major pairs), volatility (VIX)
- **Risk Analysis:** Recession indicators, financial stability, geopolitical risks

## Report Template

```markdown
# Global Markets Analysis
**Date:** YYYY-MM-DD
**Analyst:** Atlas (Tier-1 Agent)

## Executive Summary
## Macro Indicators
### Growth
### Inflation
### Labor Market
### Federal Reserve Policy
## Financial Markets
### US Equities
### Fixed Income
### Commodities
### Currency Markets
## Risk Assessment
### Key Risks
### Watch List
## Outlook
### Near-Term (1-4 weeks)
### Medium-Term (1-6 months)
### Narrative Summary
```

## Quick Reference

| Metric | Bullish Signal | Bearish Signal |
|--------|---------------|----------------|
| Yield Curve | Steepening (bull) | Inverted/flattening |
| Credit Spreads | Tightening | Widening |
| PMI | >50 and rising | <50 or falling |
| Inflation | Disinflation | Sticky/accelerating |
| Fed | Cutting/pausing | Hiking/hawkish |
| VIX | Declining/low | Rising/elevated |

## Downstream Consumers

- Tier-2 asset specialists (equity, fixed income, commodities, crypto) read this as primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for macro context
- Tier-4 forecasters use this for scenario framing
- Tier-7 synthesizer includes this in the final report
