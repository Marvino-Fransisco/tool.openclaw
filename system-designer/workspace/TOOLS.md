# TOOLS.md - Local Notes

## System Design Workflow

The `scripts/run-task.ts` script orchestrates the full system design pipeline.

### Script Location
```
/home/node/.openclaw/workspace/scripts/run-task.ts
```

### Usage
```bash
npx tsx /home/node/.openclaw/workspace/scripts/run-task.ts "<requirement>"
```

### What It Does
1. **Scrap Project** - Generates `project-tree.md` in `../project-context/`
2. **Explorer Agent** - Analyzes codebase, writes `context.md` in `../project-context/`
3. **Designer Agent** - Creates system design, writes `design.md` in `../project-context/`

### Example
```bash
npx tsx /home/node/.openclaw/workspace/scripts/run-task.ts "I want to add user authentication with OAuth2"
```

### Output Files
| File | Location | Description |
|------|----------|-------------|
| `project-tree.md` | `../project-context/` | Project directory structure |
| `context.md` | `../project-context/` | Relevant files & analysis from explorer |
| `design.md` | `../project-context/` | System design document from designer |

---

## Codebase Scanner

Call the scanner agent to analyze the codebase and generate architecture diagrams.

### Usage
```bash
openclaw agent --agent scanner --message "/scan" --timeout 600
```

### Available Commands
| Command | Description |
|---------|-------------|
| `/scan` | Full codebase scan with 5 Mermaid diagrams |
| `/scan-deep` | Deep scan with implementation details |
| `/focus [area]` | Focus on specific area (api, database, etc.) |

### Output
- `../project-context/high-level-diagrams.md`

### Generated Diagrams
1. System Architecture (flowchart TB)
2. Component Breakdown (subgraphs)
3. Data Flow (flowchart LR)
4. Data Models (classDiagram/erDiagram)
5. Key Interactions (sequenceDiagram)

### When to Use
- User asks to "scan the codebase"
- User wants architecture overview
- Before `/design` for better context
- Understanding a new project
