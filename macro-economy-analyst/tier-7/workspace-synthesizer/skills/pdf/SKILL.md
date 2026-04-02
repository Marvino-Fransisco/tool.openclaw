---
name: pdf
description: Generate professional PDF reports from markdown content using available system tools
---

# PDF Generation Skill

## Overview

This skill generates PDF files from markdown content. Use whatever tools are available on the system to produce clean, professional PDF documents.

## Supported Methods

### Method 1: pandoc (preferred)

If `pandoc` is installed, use it to convert markdown to PDF:

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex -V geometry:margin=1in
```

For a more styled report:

```bash
pandoc input.md -o output.pdf --pdf-engine=xelatex \
  -V geometry:margin=1in \
  -V fontsize=11pt \
  -V documentclass=article \
  --highlight-style=tango
```

### Method 2: wkhtmltopdf

If `wkhtmltopdf` is installed, convert markdown to HTML first, then to PDF:

```bash
pandoc input.md -o temp.html --standalone --metadata title="Macro Report"
wkhtmltopdf temp.html output.pdf
```

### Method 3: Python with reportlab/weasyprint

If Python is available with PDF libraries:

```bash
python generate_pdf.py
```

### Method 4: Node.js with pdfkit/puppeteer

If Node.js is available with PDF packages.

## Workflow

1. Compose the full report content as markdown
2. Write the markdown to a temporary file
3. Convert to PDF using the best available method
4. Save the final PDF to the target output path
5. Clean up temporary files

## Report Formatting Guidelines

- Use `#` for main title, `##` for sections, `###` for subsections
- Use markdown tables for data summaries
- Use `**bold**` for key metrics and emphasis
- Use bullet lists for scannable items
- Include a clear executive summary at the top
- End with a standard disclaimer section

## Pre-flight Check

Before generating, always:

1. Ensure the output directory exists: `mkdir -p /home/node/.openclaw/shared/report/`
2. Check which conversion tool is available on the system
3. Verify all input data has been read and synthesized

## Output

Save the PDF to: `/home/node/.openclaw/shared/report/macro-report-[YYYYMMDD-HHMM].pdf`

Use the current date-time in the filename for uniqueness.

