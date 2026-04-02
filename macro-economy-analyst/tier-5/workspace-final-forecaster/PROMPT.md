# PROMPT.md - Final Thesis Template

_Reusable template for the final probability-weighted macro outlook._

---

## /analyze

**Full Final Thesis Generation**

Synthesize raw aggregate data and all three forecaster theses into a single probability-weighted outlook.

**Output:** `/home/node/.openclaw/shared/thesis/final.md`

**Structure:**
```markdown
# Final Macro Outlook
**Date:** [YYYY-MM-DD]
**Analyst:** Oracle (Final Forecaster)
**Dominant Scenario:** [Bull / Bear / Neutral]

---

## Probability Distribution

| Scenario | Probability | Direction |
|----------|-------------|-----------|
| 🐂 Bull  | [XX]%       | Upside    |
| 🐻 Bear  | [XX]%       | Downside  |
| ⚖️ Neutral | [XX]%    | Sidelines |
| **Total** | **100%**   |           |

---

## Executive Summary

[3-5 sentences: The definitive macro call. Which scenario dominates and why. What the key drivers are. What the probability split means for positioning. This is the single source of truth for the downstream portfolio manager and synthesizer.]

---

## Scenario Analysis

### Bull Case (XX%)

**Thesis:** [One clear sentence summarizing the bullish scenario]

**Key Drivers:**
- [Driver 1 — supported by specific data point from aggregate analysis]
- [Driver 2 — supported by specific data point]
- [Driver 3 — supported by specific data point]

**Why this percentage:** [Explain the specific reasoning for this probability weight. What evidence supports it? What limits it from being higher?]

**Forecaster agreement:** [How does this compare to the bullish forecaster's confidence? Did you agree, upgrade, or downgrade? Why?]

---

### Bear Case (XX%)

**Thesis:** [One clear sentence summarizing the bearish scenario]

**Key Drivers:**
- [Driver 1 — supported by specific data point from aggregate analysis]
- [Driver 2 — supported by specific data point]
- [Driver 3 — supported by specific data point]

**Why this percentage:** [Explain the specific reasoning for this probability weight. What evidence supports it? What limits it from being higher?]

**Forecaster agreement:** [How does this compare to the bearish forecaster's confidence? Did you agree, upgrade, or downgrade? Why?]

---

### Neutral Case (XX%)

**Thesis:** [One clear sentence summarizing the neutral/base case scenario]

**Key Drivers:**
- [Driver 1 — supported by specific data point from aggregate analysis]
- [Driver 2 — supported by specific data point]
- [Driver 3 — supported by specific data point]

**Why this percentage:** [Explain the specific reasoning for this probability weight. What evidence supports it? What limits it from being higher?]

**Forecaster agreement:** [How does this compare to the neutral forecaster's confidence? Did you agree, upgrade, or downgrade? Why?]

---

## Adjudication Notes

### Where Forecasters Agreed
[If all three or two forecasters pointed to the same signals, note the convergence]

### Where Forecasters Disagreed
[If forecasters clashed on interpretation, explain who had the stronger argument and why]

### Raw Data vs. Forecaster Divergences
[Did you find cases where forecaster claims did not match the raw aggregate data? Note any corrections or upgrades/downgrades you made]

### Blind Spots Identified
[Did all three forecasters miss something visible in the raw data?]

---

## Key Triggers for Scenario Shifts

| Trigger | Current Status | Would Shift Toward | Threshold |
|---------|---------------|-------------------|-----------|
| [Trigger 1] | [--] | [Bull/Bear/Neutral] | [--] |
| [Trigger 2] | [--] | [Bull/Bear/Neutral] | [--] |
| [Trigger 3] | [--] | [Bull/Bear/Neutral] | [--] |

---

## Confidence Assessment

- **Overall Conviction:** [High / Medium / Low] — how confident are you in the dominant scenario?
- **Probability Certainty:** [High / Medium / Low] — how confident are you in the exact percentage split?
- **Data Quality:** [Strong / Moderate / Weak] — how complete and reliable was the input data?
- **Forecaster Reliability:** [Assessment of whether the three forecasters produced consistent, data-backed theses]

---

## What Would Change the Outlook

**Shift toward Bull:**
- [Specific trigger or data point]

**Shift toward Bear:**
- [Specific trigger or data point]

**Shift toward Neutral:**
- [Specific trigger or data point]

---

*Final thesis synthesized from aggregate data in /home/node/.openclaw/shared/analysis/aggregate/ and forecaster outputs in /home/node/.openclaw/shared/thesis/*
```

---

## /quick

**Quick Probability Snapshot**

Rapid assessment of the current macro probability split.

**Output:** Console (no file)

**Structure:**
- One-line probability split: Bull XX% / Bear XX% / Neutral XX%
- Dominant scenario and key driver in one sentence
- Biggest disagreement between forecasters
- One trigger that could shift the outlook in the next 48h

---

## /calibration

**Calibration Review**

Review historical probability allocations against what actually happened.

**Focus:**
- Read past `memory/` entries for previous percentage splits
- Assess accuracy: did the dominant scenario play out?
- Identify systematic biases (always too bullish? always too bearish?)
- Suggest calibration adjustments for future analyses

---
