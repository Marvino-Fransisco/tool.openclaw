# PROMPT.md - Command Templates

## /scan

Execute a comprehensive one-shot scan of the project codebase.

```
/scan
```

**What it does:**
1. Scans `../project/` directory completely
2. Detects languages, frameworks, and tech stack
3. Analyzes code structure and dependencies
4. Generates 5 Mermaid diagrams:
   - System Architecture
   - Component Breakdown
   - Data Flow
   - Data Models
   - Key Interactions
5. Writes complete documentation to `../project-context/high-level-diagrams.md`

**No follow-up questions. Complete output in one execution.**

---

## /scan-deep

Same as `/scan` but includes implementation-level detail.

```
/scan-deep
```

**Additional detail:**
- Function-level analysis
- Algorithm documentation
- Performance-critical paths
- Security-sensitive areas

---

## /update

Re-scan and update diagrams if project has changed.

```
/update
```

**What it does:**
1. Compares current state to last scan
2. If changed, regenerates diagrams
3. Updates documentation

---

## /focus [area]

Scan and document a specific area in detail.

```
/focus api
/focus authentication
/focus database
/focus [module-name]
```

**What it does:**
1. Focuses analysis on specified area
2. Generates detailed diagrams for that area only
3. Appends to existing documentation

---

## Default Command

If no command is specified, `/scan` is assumed.
