---
name: commodities-analyze
description: Analyze macro fundamentals for commodities market impact across energy, metals, and agriculture
output: /home/node/.openclaw/shared/analysis/asset-specialists/commodities.md
---

# Commodities Analysis Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
- All `.md` files in that directory are source data
- If directory is empty or missing, write a minimal report stating no data available

## Analytical Framework

When analyzing macro-fundamentals data for commodities impact, consider:

1. **Growth impulse** — Is the macro data suggesting acceleration or deceleration? Which commodities are most sensitive?
2. **Inflation regime** — Sticky inflation favors real assets. Disinflation is bearish for gold but may support industrial demand.
3. **Monetary policy path** — Rate expectations drive real yields and the dollar, both critical for commodity pricing.
4. **Fiscal impulse** — Government spending (infrastructure, green transition, defense) creates commodity demand.
5. **Dollar dynamics** — A weaker dollar is broadly supportive of commodity prices and vice versa.
6. **Geopolitical risk** — Supply disruption risk, sanctions, trade wars — what does the macro data imply about tensions?
7. **Positioning and sentiment** — Are markets already pricing the macro scenario, or is there room for repricing?

## Key Commodity Benchmarks

### Energy
- **WTI Crude / Brent** — Sensitive to growth outlook, dollar, geopolitical risk
- **Natural Gas (Henry Hub / TTF)** — Seasonal, weather-driven, LNG export dynamics

### Industrial Metals
- **Copper** — "Dr. Copper" — strongest growth proxy in commodities
- **Iron Ore** — Chinese construction/infrastructure demand dominated
- **Aluminum** — Energy-intensive production, smelter economics matter

### Precious Metals
- **Gold (XAU/USD)** — Real yields, dollar, central bank reserves, safe haven
- **Silver (XAG/USD)** — Industrial + precious dual demand, gold/silver ratio

### Agriculture
- **Wheat / Corn / Soybeans** — Weather, trade policy, biofuel mandates
- **Soft Commodities (Coffee, Sugar, Cotton)** — Supply disruption sensitive

## Macro-to-Commodity Mapping

| Macro Signal | Commodity Impact |
|---|---|
| Rising real yields | Bearish gold, bearish broad commodities (carry cost) |
| Weakening dollar | Bullish all commodities (priced in USD) |
| Accelerating GDP growth | Bullish oil, copper, industrial metals |
| Rising inflation expectations | Bullish gold, broad commodities as inflation hedge |
| Tightening monetary policy | Mixed — bearish demand, but may signal strong economy |
| Expansionary fiscal policy | Bullish industrial metals, energy (infrastructure spending) |
| Geopolitical tension escalation | Bullish oil, gold (safe haven + supply risk) |
| Chinese stimulus | Bullish iron ore, copper, Australian dollar commodity complex |
| Strong US consumer | Bullish energy, agricultural commodities |
| Supply chain disruption | Bullish impacted commodities, bearish substitutes |

## Report Template

```markdown
# Commodities Market Analysis
**As-of:** [date based on source data timestamps]
**Analyst:** Commodities Analyst (Tier-2 Agent)

## Executive Summary
## Macro Regime Assessment
## Energy Outlook
## Industrial Metals Outlook
## Precious Metals Outlook
## Agricultural Commodities Outlook
## Cross-Asset Correlations
## Forward Scenario Analysis (1-3M / 3-6M / 6-12M)
## Key Risks and Watchpoints
## Conviction Calls
```

## Downstream Consumers

- Tier-2 signal aggregator reads this file as a primary input
- Tier-3 agents (liquidity, regime, sentiment) use this for cross-asset confirmation
- Tier-4 forecasters use this for commodity-specific scenario framing
- Tier-7 synthesizer includes this in the final report
