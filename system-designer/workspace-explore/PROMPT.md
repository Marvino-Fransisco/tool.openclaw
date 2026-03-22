# PROMPT.md - Explorer Commands

## /explore [requirement]

Analyze the project and generate context.md for the given requirement.

**Usage:**
```
/explore I want to add user authentication with OAuth2
```

**What it does:**
1. Scans `../project/` structure
2. Reads `../project-context/high-level-diagrams.md`
3. Finds files/folders related to the requirement
4. Writes `../project-context/context.md`

## /scan

Quick project structure overview without generating context.md.

**What it does:**
1. Lists main directories
2. Identifies tech stack (from config files)
3. Finds entry points
4. Summarizes project type

## /context-refresh

Re-read existing context.md and update if project changed.

---

These commands streamline the exploration workflow.
