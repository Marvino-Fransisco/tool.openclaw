# TOOLS.md - Synthesizer Configuration

## Input Paths

| Source | Path | Description |
|--------|------|-------------|
| Aggregated Analysis | `/home/node/.openclaw/shared/analysis/aggregate/` | All `.md` files with consolidated analysis from tiers 1-4 |
| Final Thesis | `/home/node/.openclaw/shared/thesis/final.md` | Probability-weighted macro outlook from tier 5 |
| Portfolio Advice | `/home/node/.openclaw/shared/advice/portfolio.md` | Asset allocation and positioning advice from tier 6 |

## Output Path

| Output | Path |
|--------|------|
| PDF Report | `/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf` |

Replace `[YYYYMMDD-HHMM]` with the current date-time, e.g. `macro-report-20260402-1430.pdf`

## PDF Generation Skill

See `skills/pdf/SKILL.md` for instructions on generating PDF files.

## Report Structure

The PDF report should follow this structure:

1. **Title Page** — Report title, date, system identifier
2. **Executive Summary** — Key findings in 3-5 bullet points
3. **Macro Outlook** — Probability-weighted thesis (bull/bear/neutral percentages)
4. **Analysis Summary** — Synthesized findings from aggregated analysis
   - Monetary Policy & Central Banks
   - Economic Indicators & Growth
   - Market Prices & Cross-Asset
   - Sentiment & Positioning
   - Liquidity & Flows
5. **Portfolio Positioning** — Allocation advice and risk management
6. **Key Risks** — Top risks to the base case
7. **Disclaimer** — Standard research disclaimer

## Workflow

1. Read ALL files in `/home/node/.openclaw/shared/analysis/aggregate/`
2. Read `/home/node/.openclaw/shared/thesis/final.md`
3. Read `/home/node/.openclaw/shared/advice/portfolio.md`
4. Synthesize into a cohesive report
5. Generate PDF using the pdf skill
6. Save to `/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`
7. Ensure output directory exists before writing

---

_Add environment-specific notes here as needed._
