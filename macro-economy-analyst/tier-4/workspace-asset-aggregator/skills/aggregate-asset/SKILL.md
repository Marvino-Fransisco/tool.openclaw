---
name: aggregate-asset
description: Aggregate asset specialist analyses into a unified report
output: /home/node/.openclaw/shared/aggregate/asset.md
---

# Asset Aggregation Skill

## Source Data

- **Directory:** `/home/node/.openclaw/shared/analysis/asset-specialists/`
- Each file is one specialist's analysis — read ALL files on every run
- If directory is empty or missing, write a minimal report stating no data available

## Synthesis Method

Cross-reference specialist analyses to identify:

- **Consensus views** — where specialists agree on direction/outlook
- **Divergent views** — where specialists disagree and why
- **Risk factors** — common risks highlighted across assets
- **Opportunities** — common upside mentioned
- **Key data points** — prices, levels, indicators mentioned

## Report Template

```markdown
# Asset Analysis Aggregate Report

**Generated:** [ISO 8601 timestamp]
**Sources:** [number] specialist analyses

## Executive Summary

[2-4 sentence overview of the combined asset landscape]

## Asset Overview

### [Asset Name]

- **Specialist Consensus:** [bullish/bearish/neutral/mixed]
- **Key Price/Level:** [if mentioned]
- **Summary:** [synthesized view, not a copy-paste]
- **Risk Factors:** [bullet list]
- **Notable Divergence:** [if specialists disagree, note it here]

## Cross-Asset Themes

[Themes, correlations, or macro factors appearing across multiple assets]

## Risk Summary

[Consolidated view of risks across all assets]

## Source Coverage

[Table or list of which specialists contributed and what they covered]
```

## Output Rules

- Markdown with headers, bullet lists, and tables
- ISO 8601 timestamps
- Consistent structure across all asset sections
- Overwrite on each run — always reflects latest source data
- Report should feel like a single analyst covered all assets — not a patchwork of voices
