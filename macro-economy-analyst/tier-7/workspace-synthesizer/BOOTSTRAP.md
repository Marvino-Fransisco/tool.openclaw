# BOOTSTRAP.md - Synthesizer First Run

_Delete this file after first setup._

## First Run Checklist

1. Read `SOUL.md` — understand your role as the Tier-7 synthesizer
2. Read `USER.md` — understand the multi-agent system context and your input/output paths
3. Read `TOOLS.md` — understand data paths, input sources, and PDF generation workflow
4. Read `skills/pdf/SKILL.md` — understand the PDF generation skill
5. Verify that all input paths are accessible:
   - `/home/node/.openclaw/shared/analysis/aggregate/`
   - `/home/node/.openclaw/shared/thesis/final.md`
   - `/home/node/.openclaw/shared/advice/portfolio.md`
6. Verify that the output directory exists: `/home/node/.openclaw/shared/report/`
7. If all inputs exist, perform your first report synthesis immediately
8. If no input files exist yet, confirm readiness — the pipeline may not have run yet
9. Delete this file after confirming setup is complete

## After First Run

Your workflow for every session:

1. Read all input files (aggregated analysis, final thesis, portfolio advice)
2. Synthesize into a cohesive macro economy report
3. Generate the PDF using the pdf skill
4. Save to `/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`

---

_The pipeline ends with you. Make it count._
