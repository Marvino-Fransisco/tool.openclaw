---
name: equity-analyze
description: Analyze macro fundamentals for equity market impact with macro-equity correlation framework
output: /home/node/.openclaw/shared/analysis/asset-specialists/equity.md
---

# Equity Analysis Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Analysis Framework

When analyzing macro fundamentals for equity implications, always consider:

1. **Current Macro Regime**: Where are we in the economic cycle?
2. **Monetary Policy Stance**: Is policy supportive, neutral, or restrictive for equities?
3. **Earnings Environment**: What do macro conditions imply for earnings growth?
4. **Valuation Context**: Are equities fairly valued given the macro backdrop?
5. **Liquidity & Flows**: Is money flowing into or out of equities?
6. **Risk Sentiment**: Is positioning stretched, complacent, or fearful?
7. **Forward Catalysts**: What macro events could change the equity outlook?
8. **Historical Parallels**: What did equities do in similar macro setups historically?

## Key Macro-Equity Correlations

### Monetary Policy → Equities
| Macro Signal | Equity Implication |
|---|---|
| Rate cuts / dovish pivot | Positive for equities, especially growth/long-duration |
| Rate hikes / hawkish stance | Negative for equities, compresses multiples |
| QE / balance sheet expansion | Supports equity risk appetite |
| QT / balance sheet contraction | Drains liquidity, headwind for equities |

### Inflation → Equities
| Macro Signal | Equity Implication |
|---|---|
| Disinflation (falling CPI) | Multiple expansion potential, growth stocks benefit |
| Rising inflation above target | Multiple compression, margin pressure, rotation to value/real assets |
| Stable inflation near 2% | Goldilocks — supports sustained equity rally |

### Growth → Equities
| Macro Signal | Equity Implication |
|---|---|
| GDP acceleration | Earnings growth support, broad equity strength |
| GDP deceleration | Earnings risk, defensive rotation |
| Recession signals | Cyclical downside, quality/defensive outperformance |

### Fiscal Policy → Equities
| Macro Signal | Equity Implication |
|---|---|
| Expansionary fiscal (spending/tax cuts) | Stimulus tailwind, sector-specific beneficiaries |
| Austerity / fiscal tightening | Growth headwind, reduced corporate earnings |
| Deficit concerns | Long-term rates up, equity valuation pressure |

### Global Markets → Equities
| Macro Signal | Equity Implication |
|---|---|
| Strong global growth | Export support, multinational earnings boost |
| Global weakness / recession | Contagion risk, earnings drag |
| Currency strength (DXY) | Export competitiveness, multinationals impacted |
| EM stress | Risk-off signal, capital flight to quality |

### Liquidity & Flows → Equities
| Macro Signal | Equity Implication |
|---|---|
| Rising liquidity / money supply | Supports equity inflows and risk-taking |
| Declining liquidity | Equity headwind, potential volatility |
| Fund flows into equities | Momentum support (or contrarian warning if extreme) |

### Sentiment & Risk → Equities
| Macro Signal | Equity Implication |
|---|---|
| Low VIX / complacency | Potential vulnerability to shocks |
| High VIX / fear | Contrarian buying opportunity if fundamentals sound |
| Extreme bullish positioning | Risk of correction |
| Extreme bearish positioning | Potential for short-covering rally |

## Sector Sensitivity to Macro Regime

| Sector | Benefits From | Suffers From |
|---|---|---|
| Technology / Growth | Rate cuts, low inflation, strong growth | Rate hikes, rising inflation |
| Financials | Steep yield curve, rising rates | Flat/inverted curve, rate cuts |
| Energy | Rising inflation, strong growth | Disinflation, recession |
| Healthcare | Defensive — resilient in downturns | Less relevant in risk-on |
| Consumer Discretionary | Strong growth, low unemployment | Recession, high inflation |
| Consumer Staples | Defensive — resilient in downturns | Less relevant in risk-on |
| Industrials | Infrastructure spending, strong growth | Recession, trade wars |
| Real Estate | Rate cuts, low rates | Rate hikes, tight financial conditions |
| Utilities | Rate cuts, defensive demand | Rate hikes |
| Materials | Inflation, strong global growth | Disinflation, global slowdown |

## Report Template

```markdown
# Equity Market Analysis
**As-of:** [date based on source data timestamps]
**Analyst:** Equity Strategist (Tier-2 Agent)

## Executive Summary
## Macro-Equity Correlation Assessment
## Equity Outlook by Time Horizon
### Near-Term (0-4 Weeks)
### Medium-Term (1-6 Months)
### Long-Term (6-12+ Months)
## Sector & Factor Implications
## Risk Factors
## Key Watch Items
```

## Downstream Consumers

- Tier-2 signal aggregator reads this file as a primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for cross-asset confirmation
- Tier-4 forecasters use this for equity-specific scenario framing
- Tier-7 synthesizer includes this in the final report
