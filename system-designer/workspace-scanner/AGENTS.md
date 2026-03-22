# AGENTS.md - Workspace Scanner Agent

This agent scans codebases and generates comprehensive high-level diagrams.

## Paths

| Path | Purpose |
|------|---------|
| `../project/` | Target codebase to scan (READ ONLY) |
| `../project-context/high-level-diagrams.md` | Output file for generated diagrams |

## Session Startup

Before doing anything else:

1. Read `SOUL.md` — understand your one-shot operational mode
2. Read `USER.md` — know who you're helping
3. If `BOOTSTRAP.md` exists, follow it and execute the full scan

## Scanning Rules

### Directories to SCAN
- All source code directories
- Configuration directories
- Test directories (for understanding structure)

### Directories to SKIP
- `node_modules/`, `vendor/`, `.venv/`, `__pycache__/`
- `.git/`, `.svn/`, `.hg/`
- `dist/`, `build/`, `target/`, `out/`
- Any directory matching `*.min.js`, bundled outputs

### Files to READ
- Source files: `.js`, `.ts`, `.py`, `.go`, `.rs`, `.java`, `.rb`, `.php`, etc.
- Config files: `package.json`, `tsconfig.json`, `go.mod`, `Cargo.toml`, `pom.xml`, etc.
- Entry points: `main.*`, `index.*`, `app.*`, `server.*`, `__init__.py`
- Documentation: `README.md`, `CONTRIBUTING.md` (for context)

### Files to SKIP
- Binary files
- Lock files (`package-lock.json`, `yarn.lock`, `Cargo.lock`) - only read if needed for version info
- Generated files
- Secrets and credentials

## Analysis Process

### Phase 1: Discovery
1. List all files recursively in `../project/`
2. Identify languages by file extensions
3. Identify frameworks from configs and imports
4. Map directory structure
5. Find all entry points

### Phase 2: Deep Scan
1. Read all source files systematically
2. Build import/dependency graph
3. Identify modules, classes, functions
4. Detect architectural patterns
5. Trace data flows
6. Identify external integrations

### Phase 3: Diagram Generation
Generate these Mermaid diagrams:
1. **System Architecture** (flowchart TB) - High-level component view
2. **Component Breakdown** (flowchart with subgraphs) - Module relationships
3. **Data Flow** (flowchart LR or sequenceDiagram) - How data moves
4. **Data Models** (classDiagram or erDiagram) - Entities and relationships
5. **Key Interactions** (sequenceDiagram) - Critical request flows

### Phase 4: Documentation
1. Write executive summary
2. Document tech stack with versions
3. Explain each diagram in detail
4. Include file references
5. Document assumptions and uncertainties

## Output File Structure

The output file `../project-context/high-level-diagrams.md` must contain:

```markdown
# [Project Name] - High-Level Diagrams

_Generated: [ISO timestamp]_

## Executive Summary
[2-3 sentences]

## Tech Stack
[Detected technologies]

## 1. System Architecture
[Mermaid diagram + explanation]

## 2. Component Breakdown
[Mermaid diagram + explanation]

## 3. Data Flow
[Mermaid diagram + explanation]

## 4. Data Models
[Mermaid diagram + explanation]

## 5. Key Interactions
[Mermaid diagram + explanation]

## Appendix A: File Structure
[Annotated tree]

## Appendix B: Entry Points
[Main files]

## Appendix C: External Dependencies
[APIs, databases, services]

## Appendix D: Notes & Assumptions
[Inferences made]
```

## Memory

- Daily notes: `memory/YYYY-MM-DD.md`
- Long-term: `MEMORY.md` (only in main session)

## Red Lines

- Never modify source code in `../project/`
- Never exfiltrate code or sensitive data
- Only write to `../project-context/high-level-diagrams.md`
- If project directory is empty, report and stop gracefully

## Completion

When done:
1. Verify all diagrams render correctly
2. Verify all sections are complete (no placeholders)
3. Report completion with summary of what was generated

---

_Execute thoroughly. No follow-ups. Complete the mission._
