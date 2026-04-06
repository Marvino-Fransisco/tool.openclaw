---
name: monetary-analyze
description: Analyze daily brief for monetary policy stance and macro/financial market correlations
output: /home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md
---

# Monetary Policy Analysis Skill

## Source Data

- **Input:** `/home/node/.openclaw/shared/data/processed/daily-brief.md`
- Contains the daily macroeconomic and market data brief
- If file is missing, write a minimal report stating no data available

## Key Indicators to Track

### Monetary Policy
- Federal Funds Rate (target range)
- FOMC statements and minutes
- Fed balance sheet (weekly)
- Forward guidance signals (hawkish/dovish/neutral)

### Macro Indicators
- GDP (quarterly)
- CPI & PCE inflation (monthly)
- Employment report (monthly)
- Retail sales (monthly)
- Industrial production (monthly)

### Market Indicators
- Treasury yields (2Y, 10Y, 30Y)
- S&P 500, Nasdaq, Dow
- VIX
- DXY (dollar index)
- Credit spreads (IG, HY)

## Analysis Framework

1. **Current Policy Stance**: Where are we in the rate cycle?
2. **Economic Context**: What does the data say?
3. **Market Positioning**: How are markets pricing future policy?
4. **Risks**: What could derail the base case?
5. **Historical Parallels**: What can past cycles teach us?

## Correlation Analysis Dimensions

### Policy-Macro Correlations
- How Fed policy affects asset prices
- Inflation dynamics and policy responses
- Employment-market feedback loops

### Policy-Market Correlations
- How markets are pricing policy expectations
- Yield curve signals and recession indicators
- Global spillover effects of US monetary policy

## Report Template

```markdown
# Monetary Policy Analysis
**Date:** [YYYY-MM-DD]
**Analyst:** Macro Analyst (Tier-1 Agent)

## Executive Summary
[2-3 sentence overview of the key insight]

## 1. Current Monetary Policy Stance
### Federal Funds Rate
- Current target: [rate]
- Recent changes: [last meeting decision]
- Forward guidance signals: [hawkish/dovish/neutral]

### Balance Sheet Policy
- QT/QE status: [active/paused/reversing]
- Recent changes: [description]

### FOMC Sentiment
- Key themes from recent minutes
- Dissent analysis (if any)

## 2. Macroeconomic Indicators
### Growth
| Indicator | Current | Previous | Trend |
|-----------|---------|----------|-------|
| GDP (QoQ) | -- | -- | -- |
| Industrial Prod. | -- | -- | -- |

### Inflation
| Indicator | Current | Target | Gap |
|-----------|---------|--------|-----|
| Headline CPI | -- | 2.0% | -- |
| Core CPI | -- | 2.0% | -- |
| PCE | -- | 2.0% | -- |

### Labor Market
| Indicator | Current | Previous | Trend |
|-----------|---------|----------|-------|
| Unemployment | -- | -- | -- |
| NFP Change | -- | -- | -- |
| Wage Growth | -- | -- | -- |

## 3. Financial Market Response
### Rates & Yields
| Instrument | Level | WoW Change | Signal |
|------------|-------|------------|--------|
| 2Y Treasury | -- | -- | -- |
| 10Y Treasury | -- | -- | -- |
| 2s10s Spread | -- | -- | -- |

### Risk Assets
| Asset | Level | WoW Change | Correlation to Policy |
|-------|-------|------------|----------------------|
| S&P 500 | -- | -- | -- |
| Nasdaq | -- | -- | -- |
| VIX | -- | -- | -- |

### Credit & Currency
| Indicator | Level | Trend | Policy Sensitivity |
|-----------|-------|-------|-------------------|
| IG Spreads | -- | -- | -- |
| HY Spreads | -- | -- | -- |
| DXY | -- | -- | -- |

## 4. Correlation Analysis
### Policy-Macro Correlations
### Policy-Market Correlations
### Key Relationships This Period

## 5. Forward-Looking Assessment
### Market Pricing
- Implied rate path: [from fed funds futures]
- Probability of next move: [cut/hike] at [meeting]

### Risk Scenarios
| Scenario | Probability | Market Impact |
|----------|-------------|---------------|
| Baseline | -- | -- |
| Hawkish Surprise | -- | -- |
| Dovish Pivot | -- | -- |
| External Shock | -- | -- |

## Key Takeaways
1. [Primary insight]
2. [Secondary insight]
3. [Risk to watch]
```

## Downstream Consumers

- Tier-2 asset specialists (equity, fixed income, commodities, crypto) read this as primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for macro context
- Tier-4 forecasters use this for scenario framing
- Tier-7 synthesizer includes this in the final report
