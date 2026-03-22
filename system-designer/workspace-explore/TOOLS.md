# TOOLS.md - Explorer Configuration

## Project Paths

| Path | Purpose |
|------|---------|
| `../project/` | Source codebase to explore |
| `../project-context/high-level-diagrams.md` | Architecture diagrams (Mermaid) |
| `../project-context/context.md` | Output file for exploration results |

## Exploration Patterns

### Find Source Files by Language
- JavaScript/TypeScript: `**/*.{js,ts,jsx,tsx}`
- Python: `**/*.py`
- Go: `**/*.go`
- Java: `**/*.java`
- Config: `**/*.{json,yaml,yml,toml}`

### Key Files to Check
- `package.json` — Node.js dependencies
- `requirements.txt` / `pyproject.toml` — Python dependencies
- `go.mod` — Go dependencies
- `pom.xml` / `build.gradle` — Java dependencies
- `README.md` — Project documentation
- `docker-compose.yml` / `Dockerfile` — Container config

### Common Entry Points
- `index.{js,ts,py}`
- `main.{js,ts,py,go}`
- `app.{js,ts,py}`
- `server.{js,ts,py}`
- `src/main/java/**/*Application.java`

## Output Template

The `context.md` file should include:
1. User requirement summary
2. Relevant files (path + relevance)
3. Relevant folders (path + purpose)
4. Key dependencies
5. Entry points
6. Diagram reference
7. Notes (observations only, no recommendations)

---

Add project-specific notes here as you discover them.
