# Signal Aggregation Report

**As-of:** 2026-04-07T03:19Z
**Aggregator:** Signal Aggregator (Tier-4 Agent)

## ⚠️ Data Availability Warning

Only 2 of 3 expected Tier-3 signals are available. `liquidity-flows.md` is missing. Macro-fundamental pipeline (Tier-1/Tier-2) is not feeding data upstream — `regime.md` reports UNDETERMINED with 0% confidence. Analysis below is based on limited inputs.

---

## Signal Consensus Dashboard

| Signal Source | Direction | Conviction | Status |
|---|---|---|---|
| Regime Classifier | ⬜ UNDETERMINED | 0% | No upstream data |
| Sentiment-Risk | 🔴 Extreme Fear | High | Fully operational |
| Liquidity Flows | ⬜ MISSING | — | Not received |

**Aggregate Direction:** Indeterminate — insufficient signal coverage
**Aggregate Conviction:** Low — only 1 of 3 signals operational

---

## Regime Signal Summary

Regime classifier is non-functional due to empty macro-fundamentals directory (`/shared/analysis/macro-fundamentals/` is empty). Classification: **UNDETERMINED**, 0% confidence. No regime transition forecast can be made. All required inputs (GDP, inflation, labor, central bank policy, yield curve, money supply, PMIs, trade, fiscal, currency) are missing.

**Impact on aggregation:** This is a critical gap. Without regime context, sentiment and liquidity signals cannot be properly framed (e.g., is extreme fear occurring within a growth regime or a recession regime?).

---

## Sentiment Signal Summary

**Dominant state:** Extreme Fear (CNN F&G: 22.6, score 2.3/10)
**Conviction:** High
**Key drivers:**
- US-Iran conflict with Strait of Hormuz deadline (Trump: Tue 8PM ET / Apr 7 ~00:00 UTC)
- Sustained sub-25 fear reading for 6+ weeks
- 4-day equity rally on ceasefire hopes creating price/sentiment divergence

**Critical divergence:** Crowd sentiment (extreme fear) vs. price action (4 consecutive up days). Markets pricing ~60-70% ceasefire probability. Binary event risk is extreme — resolution sends F&G to 40-50; escalation sends it to sub-10 with VIX >40.

**Contrarian signal:** Extended fear regime (6+ weeks) + equity bottom-fishing = potential "wall of worry" setup if ceasefire materializes. However, relief rally trap risk noted (3-5% pop then sold into).

---

## Liquidity Signal Summary

**No data available.** `liquidity-flows.md` not present in signals directory.

---

## Cross-Signal Analysis

With only one functional signal (sentiment), cross-signal analysis is limited. Key themes from the single available signal:

- **Geopolitical binary risk** dominates all sentiment sub-indicators
- **Oil supply disruption** is the transmission mechanism to broader macro
- **Sentiment/price divergence** is the most notable analytical feature
- **Extended fear duration** (6+ weeks sub-25) is historically unusual and sets up for mean-reversion

No regime or liquidity cross-referencing possible.

---

## Areas of Agreement

Insufficient signal coverage to identify areas of multi-analyst agreement. Only sentiment-risk analyst is operational.

---

## Areas of Divergence

**Within sentiment signal (internal divergence):**
- Stated preference (fear surveys, VIX-adjacent indicators) vs. revealed preference (4-day equity rally, buying into geopolitical hope)
- Analyst notes this is "relief buying, not genuine risk appetite" but also acknowledges "revealed preference for risk"

**Cross-signal divergence:** Cannot assess — only 1 of 3 signals available.

---

## Unified Signal Assessment

| Dimension | Signal | Weight | Notes |
|---|---|---|---|
| Regime | None | 0% | Pipeline broken |
| Sentiment | Extreme Fear | 100% | Only active signal |
| Liquidity | None | 0% | Not received |
| **Unified** | **Cautionary / Event-Dependent** | **Low conviction** | |

**Bottom line:** The single available signal says extreme fear with a binary geopolitical catalyst imminent (hours away). Without regime or liquidity context, the aggregate signal cannot provide directional conviction. The assessment is fundamentally **event-dependent** — the Iran/Trump deadline within ~21 hours will determine the next regime.

---

## Forward Outlook

### Near-Term (hours to 5 days)
- **Binary catalyst:** Trump's Hormuz deadline (Tue ~00:00 UTC, Apr 7-8). Resolution → sharp sentiment snap toward neutral/greed. Escalation → panic, VIX >40, F&G sub-10.
- **Most probable:** Ceasefire or extension (~60-70% per market pricing) → relief rally of 3-5% S&P, sentiment normalizes over 2-4 weeks.

### Short-Term (1-4 weeks)
Post-deadline sentiment normalization expected if geopolitics stabilize. Structural fear damage (6+ weeks sub-25) means recovery is gradual, not V-shaped.

### Medium-Term (1-3 months)
Dependent on: (1) geopolitical resolution durability, (2) economic damage from conflict period, (3) oil-driven inflation resurgence. Extended fear historically sets up mean-reversion, but snap-back can be sold into.

---

## Key Risks and Watchpoints

| Risk | Severity | Probability | Timeframe |
|---|---|---|---|
| Iran deadline escalation / military strikes | 🔴 Critical | 30-40% | Hours |
| Relief rally trap (rally sold into) | 🟡 Moderate | 40-50% | Days |
| Oil-driven inflation resurgence | 🟡 Moderate | 30% | Weeks-Months |
| Regional escalation (Saudi/Israel involvement) | 🔴 Critical | Tail risk | Months |
| Upstream pipeline failure (no macro data) | 🟡 Moderate | 100% (current) | Ongoing |

**Data gaps compromising this report:**
- No macro-fundamental data from Tier-1/Tier-2
- No liquidity-flows signal from Tier-3
- VIX, put/call, fund flows, cross-asset prices not captured by sentiment analyst
- Brave Search API unconfigured, limiting real-time research

---

*Signal Aggregator — Tier-4 Agent — Macro Economy Analyst System*
*Next update: when new signal data arrives*
