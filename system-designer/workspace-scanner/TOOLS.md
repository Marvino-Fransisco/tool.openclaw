# TOOLS.md - Scanner Configuration

## Paths

| Path | Type | Description |
|------|------|-------------|
| `../project/` | INPUT | Target codebase to scan (READ ONLY) |
| `../project-context/high-level-diagrams.md` | OUTPUT | Generated diagrams file |

## Resolved Absolute Paths

For reference when executing:

```
Project:      /Users/marvino/.openclaw/system-designer/config/project/
Output:       /Users/marvino/.openclaw/system-designer/config/project-context/high-level-diagrams.md
```

---

## Mermaid Syntax Quick Reference

### Flowchart (Architecture, Components, Data Flow)

```
flowchart TB
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E((End))
    D --> E
```

Node shapes:
- `[Rectangle]` - Process/Component
- `{Diamond}` - Decision
- `((Circle))` - Start/End
- `[[Subroutine]]` - Subprocess
- `[(Database)]` - Database
- `>Flag]` - Event

Directions:
- `TB` - Top to Bottom
- `LR` - Left to Right
- `BT` - Bottom to Top
- `RL` - Right to Left

Subgraphs:
```
subgraph "Group Name"
    A --> B
end
```

### Sequence Diagram (Interactions)

```
sequenceDiagram
    participant Client
    participant Server
    participant Database
    
    Client->>Server: Request
    Server->>Database: Query
    Database-->>Server: Result
    Server-->>Client: Response
    
    Note over Client,Server: Description
```

Arrows:
- `->>` - Solid arrow (request)
- `-->>` - Dashed arrow (response)
- `--)` - Async arrow
- `--x` - Failed

### Class Diagram (Data Models)

```
classDiagram
    class User {
        +String id
        +String name
        +String email
        +login()
        +logout()
    }
    
    class Post {
        +String id
        +String title
        +String content
        +publish()
    }
    
    User "1" --> "*" Post : creates
```

Relationships:
- `-->` - Association
- `--|>` - Inheritance
- `--*` - Composition
- `--o` - Aggregation
- `-->` - Dependency

Visibility:
- `+` Public
- `-` Private
- `#` Protected

### ER Diagram (Alternative for Data Models)

```
erDiagram
    USER ||--o{ POST : creates
    USER {
        string id PK
        string name
        string email
    }
    POST {
        string id PK
        string title
        text content
    }
```

---

## Tech Stack Detection Patterns

| File/Pattern | Technology |
|--------------|------------|
| `package.json` | Node.js |
| `tsconfig.json` | TypeScript |
| `next.config.js` | Next.js |
| `nuxt.config.js` | Nuxt.js |
| `vue.config.js` | Vue.js |
| `angular.json` | Angular |
| `go.mod` | Go |
| `main.go` | Go |
| `requirements.txt` | Python |
| `pyproject.toml` | Python (modern) |
| `setup.py` | Python package |
| `Cargo.toml` | Rust |
| `pom.xml` | Java (Maven) |
| `build.gradle` | Java (Gradle) |
| `Gemfile` | Ruby |
| `composer.json` | PHP |
| `*.csproj` | C#/.NET |
| `mix.exs` | Elixir |

---

## Skip Patterns

When scanning, ignore these:

```
node_modules/
vendor/
.venv/
venv/
__pycache__/
.git/
.svn/
dist/
build/
target/
out/
.min.js
.min.css
```

---

## File Type Priorities

Priority order for reading when building understanding:

1. Config files (package.json, go.mod, etc.)
2. Entry points (main.*, index.*, app.*)
3. Routing files (routes.*, router.*)
4. Model/Schema files
5. Controller/Handler files
6. Service/Business logic files
7. Utility/Helper files
8. Test files (for understanding behavior)
