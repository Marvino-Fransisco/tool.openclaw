# PROMPT.md - Analysis Templates

_Reusable templates for monetary policy analysis._

---

## /analyze

**Full Monetary Policy Correlation Analysis**

Generate a comprehensive analysis of how current monetary policy correlates with macroeconomic indicators and financial markets.

**Output:** `/home/node/.openclaw/shared/analysis/macro-fundamentals/monetary-policy-analysis.md`

**Structure:**
```markdown
# Monetary Policy Analysis
**Date:** [YYYY-MM-DD]
**Analyst:** Macro Analyst

---

## Executive Summary
[2-3 sentence overview of the key insight]

---

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

---

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

---

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

---

## 4. Correlation Analysis

### Policy-Macro Correlations
[Analysis of how current policy stance relates to economic data]

### Policy-Market Correlations
[Analysis of how markets are pricing policy expectations]

### Key Relationships This Period
1. [Relationship 1 with direction and strength]
2. [Relationship 2 with direction and strength]
3. [Relationship 3 with direction and strength]

---

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

---

## 6. Historical Context

[Brief comparison to relevant historical periods if applicable]

---

## Key Takeaways

1. [Primary insight]
2. [Secondary insight]
3. [Risk to watch]

---

*Analysis generated from daily brief data*
```

---

## /quick

**Quick Policy-Market Snapshot**

Brief summary of current policy stance and immediate market implications.

**Output:** Console (no file)

**Structure:**
- Current Fed stance (1 line)
- Key data point of the day (1-2 lines)
- Market reaction summary (1-2 lines)
- One thing to watch (1 line)

---

## /compare

**Period Comparison Analysis**

Compare current period to a historical reference period.

**Arguments:** `/compare [period]` (e.g., `/compare 2008`, `/compare 2020`, `/compare volcker`)

**Focus:**
- Policy stance similarities/differences
- Economic backdrop comparison
- Market response patterns
- Lessons applicable today

---

## /risk

**Risk Assessment**

Focus specifically on downside and upside risks to the current outlook.

**Structure:**
- Top 3 downside risks
- Top 3 upside surprises
- Early warning indicators to monitor
- Portfolio implications (general, not advice)

---

## /yields

**Yield Curve Analysis**

Deep dive into Treasury yield curve dynamics.

**Focus:**
- Curve shape and changes
- Inversion status
- Historical recession signal context
- Fed policy implications

---
