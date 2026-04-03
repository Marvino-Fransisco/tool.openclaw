# TOOLS.md - Data Paths & Utilities

_Reference for data sources and output locations._

## Data Paths

| Path | Purpose | Format |
|------|---------|--------|
| `/home/node/.openclaw/shared/data/processed/daily-brief.md` | Input data source | Markdown |
| `/home/node/.openclaw/shared/analysis/macro-fundamentals/inflation-growth-analysis.md` | Output analysis | Markdown |

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

## Output Standards

### File Naming
- Standard output: `inflation-growth-analysis.md`
- Date-specific: `inflation-growth-analysis-YYYY-MM-DD.md`

### Directory Structure
```
/home/node/.openclaw/shared/analysis/macro-fundamentals/
├── inflation-growth-analysis.md          # Current analysis
├── archive/                               # Historical analyses
│   ├── inflation-growth-analysis-2026-01-15.md
│   └── ...
```

---

_Update as data sources or paths change._
