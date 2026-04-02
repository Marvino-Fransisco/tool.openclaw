# PROMPT.md - Bearish Thesis Template

_Reusable template for bearish case analysis._

---

## /analyze

**Full Bearish Thesis Generation**

Generate the strongest possible bearish case from current aggregate data.

**Output:** `/home/node/.openclaw/shared/thesis/bearish.md`

**Structure:**
```markdown
# Bearish Case Thesis
**Date:** [YYYY-MM-DD]
**Analyst:** Bear (Bearish Forecaster)
**Confidence:** [0-100]%

---

## Executive Summary

[2-4 sentences: The core bearish argument in plain language. If confidence is 0%, write "No bearish case — the current data does not support a downside thesis" and skip remaining sections.]

---

## Bearish Thesis

### Primary Bearish Argument
[The single strongest reason markets could decline. One paragraph.]

### Supporting Evidence

#### Signal 1: [Title]
- **Source:** [Which aggregate analysis contributed this signal]
- **Signal:** [What the data shows]
- **Bearish Implication:** [Why this supports downside]
- **Strength:** [Strong / Moderate / Weak]

#### Signal 2: [Title]
- **Source:** [--]
- **Signal:** [--]
- **Bearish Implication:** [--]
- **Strength:** [--]

#### Signal 3: [Title]
- **Source:** [--]
- **Signal:** [--]
- **Bearish Implication:** [--]
- **Strength:** [--]

[Add more signals as warranted by the data]

---

## Cascade Scenario

If the bearish thesis plays out, what is the most likely cascade of events?

1. [First domino — the initial trigger]
2. [Second-order effect]
3. [Third-order effect — broader market impact]
4. [Full bearish scenario manifestation]

---

## Key Triggers to Watch

| Trigger | Current Status | Threshold for Activation | Potential Impact |
|---------|---------------|------------------------|------------------|
| [Trigger 1] | [--] | [--] | [--] |
| [Trigger 2] | [--] | [--] | [--] |
| [Trigger 3] | [--] | [--] | [--] |

---

## Counter-Arguments (Why the Bearish Case Could Be Wrong)

[Honest assessment of what breaks your bearish thesis]

1. [Counter-argument 1]
2. [Counter-argument 2]
3. [Counter-argument 3]

---

## Confidence Assessment

- **Overall Confidence:** [0-100]%
- **Signal Quality:** [Strong / Moderate / Weak]
- **Signal Quantity:** [Many / Few / None]
- **Conflicting Data:** [List major bullish signals that contradict the bearish case]
- **Confidence Rationale:** [Why this specific percentage? What would raise or lower it?]

---

## What Would Increase Confidence

- [Specific event or data point that would make the bearish case stronger]

## What Would Decrease Confidence

- [Specific event or data point that would weaken the bearish case]

---

*Thesis generated from aggregate data in /home/node/.openclaw/shared/aggregate/*
```

---

## /quick

**Quick Bearish Signal Scan**

Rapid assessment of whether any immediate bearish signals exist in the data.

**Output:** Console (no file)

**Structure:**
- Bearish signal count and strongest signal in one line
- Confidence level (0-100%)
- One-sentence bearish thesis or "No bearish case"
- Key trigger to watch in next 48h

---

## /stress-test

**Stress Test Scenario Analysis**

Given current data, what happens under specific stress scenarios?

**Focus:**
- Rate shock scenario (+100bps unexpected)
- Liquidity crisis scenario
- Geopolitical escalation scenario
- Credit event / default cascade scenario
- Dollar surge scenario (DXY +5%)

For each: probability, trigger, expected market impact, and whether current data supports it.

---
