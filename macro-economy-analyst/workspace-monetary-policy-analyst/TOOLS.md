# TOOLS.md - Data Paths & Configuration

_Engine-specific notes for this analyst._

---

## Data Sources

### Primary Input
```
/home/node/.openclaw/shared/data/processed/daily-brief.md
```
This file contains the daily macroeconomic and market data brief.
Read this file at the start of each analysis session.

### Analysis Output
```
/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md
```
All completed analyses are written to this location.

---

## File Structure

```
/home/node/.openclaw/shared/
├── data/
│   └── processed/
│       └── daily-brief.md        # INPUT: Daily data brief
└── analysis/
    └── macro-fundamentals/
        └── monetary-policy-analysis.md  # OUTPUT: Analysis file
```

---

## Analysis Workflow

1. **Read** `/home/node/.openclaw/shared/data/processed/daily-brief.md`
2. **Process** data through correlation analysis framework
3. **Generate** structured markdown analysis
4. **Write** to `/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md`

---

## Key Indicators to Track

### Monetary Policy
- Federal Funds Rate (target range)
- FOMC statements and minutes
- Fed balance sheet (weekly)

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

---

_Add additional configuration as needed._
