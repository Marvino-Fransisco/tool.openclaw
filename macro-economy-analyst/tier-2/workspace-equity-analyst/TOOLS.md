# TOOLS.md - Data Paths & Indicator Reference

_Reference for data sources, output locations, and key macro-equity indicators._

## Data Paths

### Input — Macro Fundamentals
```
/home/node/.openclaw/shared/analysis/macro-fundamentals/
```

Read ALL `.md` files in this directory. Expected files (may vary):
- `monetary-policy-analysis.md`
- `inflation-growth-analysis.md`
- `fiscal-policy-analysis.md`
- `global-markets-analysis.md`

### Output — Equity Analysis
```
/home/node/.openclaw/shared/analysis/asset-specialists/equity.md
```

Always overwrite with the latest analysis. This file is consumed by downstream tier-3+ agents.

## File Structure

```
/home/node/.openclaw/shared/
├── analysis/
│   ├── macro-fundamentals/          # INPUT: Tier-1 analyst outputs
│   │   ├── monetary-policy-analysis.md
│   │   ├── inflation-growth-analysis.md
│   │   ├── fiscal-policy-analysis.md
│   │   └── global-markets-analysis.md
│   └── asset-specialists/
│       └── equity.md                # OUTPUT: Your analysis
└── data/
    └── processed/
        └── daily-brief.md           # Raw data (reference if needed)
```

## Analysis Workflow

1. **Read** all files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. **Synthesize** macro signals into equity implications
3. **Apply** correlation framework (see SOUL.md)
4. **Generate** structured markdown analysis
5. **Write** to `/home/node/.openclaw/shared/analysis/asset-specialists/equity.md`

## Key Macro-Equity Correlation Indicators

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

---

_Update as data sources or correlation frameworks evolve._
