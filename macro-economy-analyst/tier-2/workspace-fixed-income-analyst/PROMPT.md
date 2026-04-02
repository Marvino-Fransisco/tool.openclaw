# PROMPT.md - Analysis Templates

_Reusable templates for fixed income macro-correlation analysis._

---

## /analyze

**Full Fixed Income Macro-Correlation Analysis**

Generate a comprehensive analysis of how current macroeconomic fundamentals correlate with fixed income market conditions and what they imply for the future.

**Output:** `/home/node/.openclaw/shared/analysis/asset-specialists/fixed-income.md`

**Structure:**
```markdown
# Fixed Income Market Analysis
**Date:** [YYYY-MM-DD]
**Analyst:** Fixed Income Analyst

---

## Executive Summary
[2-4 sentences: the single most important macro-fixed income insight right now, current regime, and forward bias]

---

## 1. Macro Environment Assessment

### Monetary Policy Stance
- **Fed Policy:** [current rate, stance, recent signals]
- **Rate Path Implied by Markets:** [OIS/fed funds futures — hikes or cuts priced in]
- **Balance Sheet:** [QT/QE status, pace, forward guidance on balance sheet]
- **Global CB Coordination:** [are ECB, BOE, BOJ aligned or diverging?]

### Inflation Dynamics
- **Headline CPI/PCE:** [latest, trend, surprises]
- **Core Inflation:** [sticky or easing, service vs. goods]
- **Market-Implied Inflation:** [breakevens, 5Y5Y forward]
- **Inflation Regime:** [reflationary / disinflationary / deflationary / stagflationary]

### Growth Outlook
- **GDP Momentum:** [accelerating / steady / decelerating]
- **Labor Market:** [employment, wage growth, tightness]
- **Leading Indicators:** [ISM, PMIs, yield curve signal]
- **Recession Probability:** [market-implied, model-based if available]

### Fiscal Dynamics
- **Deficit Trajectory:** [widening / narrowing, magnitude]
- **Treasury Supply:** [issuance calendar, net new supply]
- **Fiscal-Monetary Interaction:** [coordination or tension]

---

## 2. Yield Curve Analysis

### Current Curve Shape
| Tenor | Yield | Change (1W) | Change (1M) | Signal |
|-------|-------|-------------|-------------|--------|
| 2Y | [--] | [--] | [--] | [policy-sensitive] |
| 5Y | [--] | [--] | [--] | [growth/inflation blend] |
| 10Y | [--] | [--] | [--] | [long-term expectations] |
| 30Y | [--] | [--] | [--] | [term premium, fiscal] |

### Key Spreads
| Spread | Current | Direction | Historical Signal |
|--------|---------|-----------|-------------------|
| 2s10s | [--] | [steepening/flattening] | [recession signal?] |
| 5s30s | [--] | [--] | [duration demand?] |
| 3m10s | [--] | [--] | [Fed's recession indicator] |

### Term Premium Decomposition
- **Real Yield Component:** [level and direction]
- **Inflation Premium:** [level and direction]
- **Term Premium:** [positive/negative, direction of change]

---

## 3. Macro-Fixed Income Correlation Matrix

### Current Correlations
| Macro Factor | Current State | FI Impact | Signal Strength |
|-------------|--------------|-----------|----------------|
| Fed Policy Stance | [--] | [Bullish/Bearish/Neutral for bonds] | [Strong/Moderate/Weak] |
| Inflation Trajectory | [--] | [--] | [--] |
| Growth Momentum | [--] | [--] | [--] |
| Fiscal Supply | [--] | [--] | [--] |
| Financial Conditions | [--] | [--] | [--] |
| Dollar Direction | [--] | [--] | [--] |
| Geopolitical Risk | [--] | [--] | [--] |

### Net Macro Signal
- **Aggregate Score:** [Bullish / Neutral / Bearish for bonds] ([X/N factors bullish])
- **Signal Confidence:** [High / Medium / Low]
- **Conflicting Signals:** [list any, or "None"]

---

## 4. Fixed Income Market Interpretation

### What This Means for Treasuries
[1-2 paragraphs: How the macro backdrop specifically affects government bond yields]

### What This Means for Credit
[1-2 paragraphs: How macro affects IG, HY, and EM spreads]

### What This Means for TIPS / Real Yields
[1-2 paragraphs: Real yield direction and inflation expectations]

### Key Macro Catalysts Ahead
| Catalyst | Date | Expected FI Impact | Probability |
|----------|------|---------------------|-------------|
| [Event 1] | [--] | [--] | [--] |
| [Event 2] | [--] | [--] | [--] |
| [Event 3] | [--] | [--] | [--] |

---

## 5. Forward-Looking Scenarios

### Base Case ([X]% probability)
[1 paragraph: Most likely macro-FI path over next 1-4 weeks]

### Bull Case for Bonds — Lower Yields ([X]% probability)
[What needs to happen macro-wise for bonds to rally. Specific triggers.]

### Bear Case for Bonds — Higher Yields ([X]% probability)
[What macro risks could trigger a bond sell-off. Specific triggers.]

---

## 6. Credit Market Deep Dive

### Investment Grade
- **Spread Level:** [current OAS, percentile vs. history]
- **Direction:** [tightening / widening / stable]
- **Drivers:** [fundamental / technical / positioning]
- **Outlook:** [1-3 month view]

### High Yield
- **Spread Level:** [current OAS, percentile vs. history]
- **Default Rate Trajectory:** [rising / falling / stable]
- **Risk Appetite:** [reach-for-yield or de-risking]
- **Outlook:** [1-3 month view]

### Emerging Market Debt
- **EM Spread:** [EMBI level, direction]
- **Dollar Impact:** [supportive or challenging]
- **Country Specifics:** [key EM risks and opportunities]

---

## 7. Risk Assessment

### Top 3 Upside Risks for Bonds (Lower Yields)
1. [Risk with trigger and potential yield impact]
2. [Risk with trigger and potential yield impact]
3. [Risk with trigger and potential yield impact]

### Top 3 Downside Risks for Bonds (Higher Yields)
1. [Risk with trigger and potential yield impact]
2. [Risk with trigger and potential yield impact]
3. [Risk with trigger and potential yield impact]

### Early Warning Indicators
- [Indicator to watch with threshold]
- [Indicator to watch with threshold]

---

## Key Takeaways

1. [Primary insight — the one thing that matters most for fixed income]
2. [Secondary insight]
3. [Actionable macro-FI signal]
4. [Key risk to watch]

---

*Analysis synthesized from macro-fundamentals data*
```

---

## /quick

**Quick Fixed Income-Macro Snapshot**

Brief summary of current macro environment and immediate fixed income implications.

**Output:** Console (no file)

**Structure:**
- Macro regime in one line
- Net macro signal for bonds (bullish/bearish/neutral)
- Yield curve status (steepening/flattening/inverted)
- Key macro catalyst in next 48h
- One non-obvious insight
- One risk to watch

---

## /curve

**Yield Curve Deep Dive**

Focused analysis on the yield curve shape, slope dynamics, and what it signals.

**Focus:**
- Current curve shape (normal, flat, inverted, humped)
- 2s10s, 5s30s, 3m10s spread analysis
- Term premium decomposition
- Historical comparison to similar curve configurations
- What the curve is pricing vs. what fundamentals suggest
- Leading indicator signal for growth and recession

---

## /credit

**Credit Market Analysis**

Deep dive into credit conditions and what they signal for fixed income.

**Focus:**
- IG and HY spread analysis (levels, direction, historical context)
- Default cycle positioning
- Financial conditions index
- Lending standards and credit availability
- Reach-for-yield vs. de-risking dynamics
- Sector-specific credit risks

---

## /risk

**Fixed Income Risk Assessment**

Focus specifically on downside and upside risks to fixed income from macro fundamentals.

**Structure:**
- Top 3 macro downside risks for bonds (yield spike scenarios)
- Top 3 macro upside surprises for bonds (rally scenarios)
- Stress test scenarios (inflation shock, growth collapse, fiscal crisis)
- Early warning indicators with specific thresholds

---
