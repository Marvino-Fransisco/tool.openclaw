---
name: inflation-analyze
description: Analyze daily brief for inflation-growth dynamics and market correlations
output: /home/node/.openclaw/shared/analysis/macro-fundamentals/inflation-growth-analysis.md
---

# Inflation-Growth Analysis Skill

## Source Data

- **Input:** `/home/node/.openclaw/shared/data/processed/daily-brief.md`
- Contains daily macroeconomic data, market prices, news summaries
- If file is missing, write a minimal report stating no data available

## Key Metrics Reference

### Inflation Indicators
| Metric | Description | Typical Range |
|--------|-------------|---------------|
| CPI YoY | Consumer Price Index year-over-year | 0-5% normal |
| Core CPI YoY | CPI ex-food & energy | 1-3% target |
| PCE YoY | Personal Consumption Expenditures | Fed's preferred |
| Core PCE YoY | PCE ex-food & energy | 2% target |
| PPI YoY | Producer Price Index | Leading indicator |

### Correlation Indicators
| Indicator | Relationship |
|-----------|--------------|
| Fed Funds Rate | Policy response to inflation |
| 10Y Treasury Yield | Market inflation expectations |
| 5Y5Y Forward | Long-term inflation view |
| Breakeven Rates | Market-priced inflation |
| Real Yields | Nominal - Breakeven |

### Labor Market Linkages
| Indicator | Inflation Impact |
|-----------|------------------|
| Unemployment Rate | Phillips curve relationship |
| ECI (Employment Cost Index) | Wage inflation pressure |
| Average Hourly Earnings | Wage growth signal |
| Labor Force Participation | Structural inflation factors |

## Analytical Framework

1. **Data synthesis** — pull from daily brief, identify key signals
2. **Correlation analysis** — link inflation to market/economic indicators
3. **Trend identification** — spot emerging patterns or regime changes
4. **Risk assessment** — flag potential volatility or inflection points
5. **Actionable insight** — translate analysis into usable intelligence

## Report Template

```markdown
# Inflation-Growth Analysis Report
**Date:** YYYY-MM-DD
**Analyst:** Inflation Growth Analyst (Tier-1 Agent)

## Executive Summary
- [Key point 1]
- [Key point 2]
- [Key point 3]

## Inflation Metrics Overview
| Metric | Current | Prior | Change | Trend |
|--------|---------|-------|--------|-------|
| CPI YoY | X.X% | X.X% | +0.X | Up/Down/Flat |
| Core CPI YoY | X.X% | X.X% | +0.X | Up/Down/Flat |
| PCE YoY | X.X% | X.X% | +0.X | Up/Down/Flat |

## Correlation Analysis

### Inflation ↔ Monetary Policy
[Analysis of Fed policy stance relative to inflation]

### Inflation ↔ Labor Markets
[Analysis of wage-inflation dynamics]

### Inflation ↔ Financial Markets
[Analysis of market pricing of inflation]

## Risk Factors

### Upside Risks
- [Risk 1]
- [Risk 2]

### Downside Risks
- [Risk 1]
- [Risk 2]

## Key Watch Items
- [ ] [Item to monitor 1]
- [ ] [Item to monitor 2]
```

## Downstream Consumers

- Tier-2 asset specialists (equity, fixed income, commodities, crypto) read this as primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for macro context
- Tier-4 forecasters use this for scenario framing
- Tier-7 synthesizer includes this in the final report
