# Prompt Templates

## /design [requirement]

Run the full system design pipeline: scrap project → explore → design.

**Usage:**
```
/design I want to add user authentication with OAuth2
```

**What it does:**
1. Generates project tree (`project-tree.md`)
2. Explorer agent analyzes codebase and writes `context.md`
3. Designer agent creates system design in `design.md`

**Manual execution:**
```bash
npx tsx /home/node/.openclaw/workspace/scripts/run-task.ts "<requirement>"
```

---

## /scan

Scan the codebase and generate architecture diagrams.

**Usage:**
```
/scan
```

**What it does:**
1. Scans `../project/` directory completely
2. Detects languages, frameworks, and tech stack
3. Generates 5 Mermaid diagrams:
   - System Architecture
   - Component Breakdown
   - Data Flow
   - Data Models
   - Key Interactions
4. Writes to `../project-context/high-level-diagrams.md`

**Manual execution:**
```bash
openclaw agent --agent scanner --message "/scan" --timeout 600
```

---

## /scan-deep

Same as `/scan` but includes implementation-level detail.

**Usage:**
```
/scan-deep
```

**Additional detail:**
- Function-level analysis
- Algorithm documentation
- Performance-critical paths
- Security-sensitive areas

---

## /focus [area]

Scan and document a specific area in detail.

**Usage:**
```
/focus api
/focus authentication
/focus database
```

**Manual execution:**
```bash
openclaw agent --agent scanner --message "/focus api" --timeout 600
```
