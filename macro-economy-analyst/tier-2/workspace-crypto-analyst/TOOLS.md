# TOOLS.md - Data Paths & Configuration

_Reference for data sources, output locations, and crypto-specific metrics._

---

## Data Paths

### Input Sources (Tier-1 Macro Analyses)

```
/home/node/.openclaw/shared/analysis/macro-fundamentals/
```

Read ALL `.md` files in this directory. Expected files include:

| File | Source Agent | Content |
|------|-------------|---------|
| `monetary-policy-analysis.md` | Monetary Policy Analyst | Fed stance, rate outlook, balance sheet |
| `inflation-growth-analysis.md` | Inflation Growth Analyst | CPI, PCE, inflation trends |
| Additional files | Other tier-1 agents | As produced |

### Output Target

```
/home/node/.openclaw/shared/analysis/asset-specialists/crypto.md
```

All completed crypto analyses are written to this single file (overwritten each session).

### File Structure

```
/home/node/.openclaw/shared/
├── analysis/
│   ├── macro-fundamentals/          # INPUT: Tier-1 analyses
│   │   ├── monetary-policy-analysis.md
│   │   ├── inflation-growth-analysis.md
│   │   └── ...
│   └── asset-specialists/           # OUTPUT: Asset-class analyses
│       └── crypto.md                # THIS AGENT'S OUTPUT
└── data/
    └── processed/
        └── daily-brief.md           # Raw daily data (supplementary)
```

---

## Analysis Workflow

1. **Read** all `.md` files in `/home/node/.openclaw/shared/analysis/macro-fundamentals/`
2. **Synthesize** macro signals relevant to crypto markets
3. **Apply** macro-crypto correlation framework (see SOUL.md)
4. **Generate** structured markdown analysis using templates in PROMPT.md
5. **Write** to `/home/node/.openclaw/shared/analysis/asset-specialists/crypto.md`

---

## Key Macro-Crypto Correlations to Track

### Monetary Policy → Crypto
| Macro Signal | Expected Crypto Impact | Strength |
|-------------|----------------------|----------|
| Rate cuts / dovish pivot | Bullish (cheaper capital, risk-on) | Strong |
| Rate hikes / hawkish | Bearish (de-risking, dollar strength) | Strong |
| QT slowdown / QE | Bullish (liquidity expansion) | Strong |
| Balance sheet expansion | Very bullish (liquidity flooding) | Very Strong |

### Dollar & Rates → Crypto
| Macro Signal | Expected Crypto Impact | Strength |
|-------------|----------------------|----------|
| DXY rising | Bearish (inverse correlation) | Moderate-Strong |
| Real yields rising | Bearish (opportunity cost) | Moderate |
| Yield curve steepening | Mixed (growth vs inflation) | Moderate |
| Yield curve inversion | Initially bearish, then bullish (cut expectations) | Moderate |

### Risk Sentiment → Crypto
| Macro Signal | Expected Crypto Impact | Strength |
|-------------|----------------------|----------|
| VIX spiking | Bearish (de-risking, liquidations) | Strong |
| Credit spreads widening | Bearish (risk-off contagion) | Moderate |
| Equity bull market | Bullish (positive correlation to risk assets) | Moderate |
| Gold outperforming | Mixed (safe haven vs inflation narrative) | Weak-Moderate |

### Inflation → Crypto
| Macro Signal | Expected Crypto Impact | Strength |
|-------------|----------------------|----------|
| Rising inflation surprise | Initially bullish (hedge narrative), then bearish (rate hike fears) | Moderate |
| Disinflation | Bullish (cut expectations) | Moderate |
| Deflation fears | Bearish (risk-off, liquidity crisis) | Strong |

---

## Crypto-Native Context (from macro-fundamentals data)

### Indicators to Extract from Macro Analyses
- **Liquidity conditions**: M2 growth, global liquidity, Fed balance sheet
- **Risk appetite**: VIX, credit spreads, equity breadth
- **Dollar dynamics**: DXY level and trend
- **Rate expectations**: Fed funds futures, OIS curves
- **Geopolitical risk premium**: Relevant for safe-haven crypto narratives

---

_Update as data sources or correlation patterns evolve._
