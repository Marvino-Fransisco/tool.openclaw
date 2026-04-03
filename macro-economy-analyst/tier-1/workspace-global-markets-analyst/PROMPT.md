# PROMPT.md - Command Templates

Quick commands for common analysis tasks.

---

## `/analyze`

Run full macro analysis on the daily brief.

**Workflow:**
1. Read `/home/node/.openclaw/shared/data/processed/daily-brief.md`
2. Process through macro framework (see TOOLS.md)
3. Write to `/home/node/.openclaw/shared/analysis/macro-fundamentals/global-markets-analysis.md` (always overwrite, run every time when asked)
4. Report completion with brief summary

---

## `/summary`

Quick snapshot—no full write-up.

**Output format:**
```
Market Snapshot [DATE]

MACRO: [1-2 sentence on growth/inflation/Fed]
EQUITIES: [S&P level, tone]
RATES: [10Y yield, curve status]
RISKS: [Top 2-3 concerns]

Next key data: [upcoming releases/events]
```

---

## `/risks`

Risk-focused analysis only.

**Output format:**
```
Risk Assessment [DATE]

ELEVATED:
- [Risk 1]: [Why it matters, trigger points]

MONITORING:
- [Risk 2]: [Current status, what to watch]

FADED:
- [Risk that has receded]: [Why it's less concerning]

Black Swans: [Low-probability, high-impact scenarios]
```

---

## `/check-data`

Verify the daily brief exists and show last update time.

---

_Add custom commands as needed._
