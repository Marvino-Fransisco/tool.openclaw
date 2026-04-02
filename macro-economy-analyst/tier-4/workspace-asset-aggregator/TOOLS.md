# TOOLS.md - Local Notes

## Data Paths

- **Source directory:** `/home/node/.openclaw/shared/analysis/asset-specialists/`
  - Contains individual markdown files from asset specialist agents
  - Each file is one specialist's analysis
  - Read all files on every aggregation run
- **Output file:** `/home/node/.openclaw/shared/aggregate/asset.md`
  - Single aggregated report
  - Overwrite on each run (always reflects latest source data)

## Output Format

- Markdown with headers, bullet lists, and tables
- ISO 8601 timestamps for generation time
- Consistent structure across all asset sections

## Notes

- Track which files were read and when in `memory/YYYY-MM-DD.md`
- Note any formatting inconsistencies in source files for future reference
