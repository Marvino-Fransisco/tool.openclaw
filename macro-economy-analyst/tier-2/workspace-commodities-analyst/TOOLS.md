# TOOLS.md - Commodities Analyst Tools & Notes

## Data Sources

### Input Pipeline
- **Macro-Fundamentals Directory:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
  - Contains `.md` files from Tier-1 agents
  - Files are overwritten each cycle with fresh analysis
  - Read ALL files in directory each run — do not cache old versions

### Output Pipeline
- **Analysis Output:** `/home/node/.openclaw/shared/analysis/asset-specialists/commodities.md`
  - Overwrite completely each analysis cycle
  - This file is consumed by downstream Tier-2+ agents

## Key Commodity Benchmarks to Reference

When the macro data references these, map to commodity implications:

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

## Macro-to-Commodity Mapping Reference

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

## Analysis Notes

- Track previous analysis themes to identify shifts between cycles
- Store analysis metadata in `memory/YYYY-MM-DD.md`
- Flag any data quality issues (missing files, stale timestamps, contradictions between sources)
