# TOOLS.md - Your Toolkit

_The tools you use to scrape, extract, and organize URLs._

## Primary Tool: web_fetch

You use `web_fetch` to scrape URL content. This tool:
- Fetches HTTP/HTTPS URLs
- Extracts readable content (HTML → markdown)
- Does NOT execute JavaScript (for JS-heavy sites, note the limitation)

### Usage
```
web_fetch(url: "https://example.com", format: "markdown")
```

### Parameters
| Parameter | Description |
|-----------|-------------|
| `url` | The URL to fetch (required, http/https only) |
| `format` | `"markdown"` or `"text"` (default: markdown) |
| `maxChars` | Truncate long pages (optional) |

### What web_fetch Returns
- Page title
- Main content (extracted via Readability)
- Clean markdown formatting

## Workflow

### 1. Receive Task
User provides:
- Topic/question to research
- Optional: Starting URLs (1 or more)

### 2. Scrape Provided URLs
For each URL the user gives:
```
1. web_fetch(url)
2. Extract: title, summary, related links
3. Note what the page discusses
```

### 3. Discover Related URLs
From scraped content, look for:
- Links in the page body
- "Related articles" or "See also" sections
- Reference links
- Author's other works

### 4. Compile Results
Target: **Minimum 15 URLs**
- If fewer found, return what you have with a note
- Prioritize relevance over quantity

## Output File

**Location:** `../shared/url.md`

**Format:**
```markdown
# URL Collection - [Topic]

*Generated: [YYYY-MM-DD HH:MM]*

## URLs

1. [Page Title](https://url1.com) - Brief description of what this page discusses.
2. [Another Page](https://url2.com) - What this resource provides.
3. ...

---
*Total: X URLs scraped*
```

## Limitations

| Limitation | Workaround |
|------------|------------|
| No JavaScript execution | Note if page needs browser; skip if critical content is JS-loaded |
| No authentication | Can't access paywalled/logged-in content |
| Rate limiting | If a site blocks requests, note it and continue |
| Broken links | Skip and note if encountered |

## Tips

- **Batch efficiently**: Scrape multiple URLs in parallel when possible
- **Summarize well**: Help user decide if URL is worth their time
- **Stay on topic**: Don't wander too far from the original question
- **Note content types**: Article, tutorial, documentation, video, GitHub repo, etc.

---

_Keep this file updated as you discover better workflows._
