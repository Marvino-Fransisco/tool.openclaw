# Moufube - High-Level Diagrams

_Generated: 2026-03-21 12:35:00 UTC_

## Executive Summary

Moufube is a YouTube-like video sharing platform built with a **microservices architecture** using a monorepo structure. The system comprises a Next.js 15 frontend, a Go-based API Gateway (modular architecture), and an Authentication Service (DDD + Clean Architecture). Inter-service communication uses gRPC with Protocol Buffers, Redis for caching/identity tokens, and PostgreSQL for persistence.

## Tech Stack

| Category | Technology | Version | Source |
|----------|------------|---------|--------|
| Frontend Framework | Next.js | 15.5.4 | `frontend/package.json` |
| Frontend UI | React | 19.1.0 | `frontend/package.json` |
| Frontend Language | TypeScript | 5.x | `frontend/package.json` |
| Frontend Build | Turbopack | - | `frontend/package.json` |
| Backend Language | Go | 1.25.4 | `README.md` |
| API Gateway Framework | Gin | - | `services/api-gateway/` |
| RPC Protocol | gRPC | - | `data/proto/` |
| API Documentation | Swagger/OpenAPI | - | `services/api-gateway/documentation/api/` |
| Database | PostgreSQL | - | `data/database/` |
| ORM | GORM | - | `services/authentication/` |
| Cache | Redis | - | `services/api-gateway/internal/infrastructure/cache/` |
| Containerization | Docker & Docker Compose | - | `deployment/docker-compose.yml` |
| CI/CD | GitHub Actions | - | `.github/workflows/ci.yml` |
| Linting (Go) | golangci-lint-v2 | - | `scripts/lint.sh` |
| Linting (JS) | ESLint + Prettier | - | `frontend/package.json` |

---

## 1. System Architecture

### Overview

Moufube follows a microservices architecture with an API Gateway pattern. The frontend (Next.js) communicates with the API Gateway via HTTP REST. The API Gateway handles cross-cutting concerns (identity verification, rate limiting, logging) and routes authentication requests to the Authentication Service via gRPC. Redis stores visitor identity tokens and rate limiting data. PostgreSQL persists user data for the Authentication Service.

### Diagram

```mermaid
flowchart TB
    subgraph "Client Layer"
        Browser[Web Browser]
    end

    subgraph "Frontend Layer"
        NextJS[Next.js 15.5.4<br/>React 19<br/>TypeScript]
    end

    subgraph "API Gateway Service"
        Gin[Gin HTTP Server<br/>:3000]
        Middleware[Middleware Stack<br/>Identity + Rate Limit]
        AuthModule[Auth Module<br/>Login/Register]
        HealthModule[Health Module]
        Swagger[Swagger Docs<br/>/swagger/*]
    end

    subgraph "Cache Layer"
        Redis[(Redis<br/>Identity Tokens<br/>Rate Limiting)]
    end

    subgraph "Authentication Service"
        GRPC[gRPC Server<br/>:1001]
        UseCases[Use Cases<br/>Register, Login]
        Domain[Domain Layer<br/>User Entity<br/>Value Objects]
    end

    subgraph "Data Layer"
        Postgres[(PostgreSQL<br/>Users Table)]
    end

    subgraph "Shared Contracts"
        Proto[Protocol Buffers<br/>authentication/v1]
    end

    Browser -->|HTTP| NextJS
    NextJS -->|HTTP REST| Gin
    Gin --> Middleware
    Middleware --> AuthModule
    Middleware --> HealthModule
    Middleware <-->|Read/Write| Redis
    AuthModule -->|gRPC| GRPC
    HealthModule --> Swagger
    GRPC --> UseCases
    UseCases --> Domain
    Domain -->|GORM| Postgres

    Proto -.->|generates| Gin
    Proto -.->|generates| GRPC
```

### Component Descriptions

| Component | File(s) | Responsibility |
|-----------|---------|----------------|
| Web Browser | - | End-user client |
| Next.js Frontend | `frontend/src/app/` | Server-side rendered UI |
| Gin HTTP Server | `services/api-gateway/internal/infrastructure/http/gin/init.go` | HTTP routing and request handling |
| Identity Middleware | `services/api-gateway/internal/bootstrap/middleware/identity.go` | Visitor token generation/validation |
| Rate Limit Middleware | `services/api-gateway/internal/bootstrap/middleware/rate_limit.go` | Redis-based request throttling |
| Auth Module | `services/api-gateway/internal/modules/authentication/` | Login/register HTTP handlers |
| gRPC Stub | `services/api-gateway/internal/infrastructure/grpc/stub/authentication.go` | gRPC client connection to auth service |
| Redis Cache | `services/api-gateway/internal/infrastructure/cache/redis.go` | Identity token and rate limit storage |
| gRPC Server | `services/authentication/internal/infrastructure/grpcserver/` | gRPC server for auth operations |
| Use Cases | `services/authentication/internal/application/usecase/user/` | Business logic for register/login |
| Domain Layer | `services/authentication/internal/domain/` | Entities, value objects, repository interfaces |
| User Repository | `services/authentication/internal/infrastructure/repository/user/` | PostgreSQL data access via GORM |

---

## 2. Component Breakdown

### Overview

The system has two main backend services with distinct architectural patterns:

**API Gateway** uses a **Modular Architecture** with 4 layers:
- Interface Layer (HTTP routes, middleware)
- Modules Layer (feature-specific controllers)
- Infrastructure Layer (Redis, gRPC, HTTP server)
- Shared Layer (responses, utilities)

**Authentication Service** uses **DDD + Clean Architecture** with 4 layers:
- Domain Layer (entities, value objects, repository interfaces)
- Application Layer (use cases, DTOs, inbound ports)
- Infrastructure Layer (database, gRPC server, logger)
- Interface Layer (gRPC controllers)

### Diagram

```mermaid
flowchart TB
    subgraph "API Gateway Service"
        subgraph "Interface Layer"
            Router[Router<br/>bootstrap/router/]
            MW[Middleware<br/>identity.go, rate_limit.go]
        end

        subgraph "Modules Layer"
            HealthMod[Health Module<br/>check/controller.go]
            AuthMod[Authentication Module<br/>login/, register/]
            IdentityMod[Identity Module<br/>handle_visitor/, handle_rate_limit/]
        end

        subgraph "Infrastructure Layer"
            HTTPServer[HTTP Server<br/>http/server/]
            GRPCStub[gRPC Stub<br/>grpc/stub/]
            RedisCache[Redis Client<br/>cache/redis.go]
            Logger[Logger<br/>logger/slog.go]
        end

        subgraph "Shared Layer"
            Response[Response Helpers<br/>appctx/response/]
            AppErr[Error Types<br/>apperr/]
        end
    end

    subgraph "Authentication Service"
        subgraph "Domain Layer"
            UserEntity[User Entity<br/>entity/user.go]
            EmailVO[Email Value Object<br/>valueobject/email.go]
            PasswordVO[PasswordHash VO<br/>valueobject/password_hash.go]
            UserFactory[User Factory<br/>factory/user.go]
            RepoInterfaces[Repository Interfaces<br/>repository/user/]
        end

        subgraph "Application Layer"
            RegisterUC[Register Use Case<br/>usecase/user/register.go]
            LoginUC[Login Use Case<br/>usecase/user/login.go]
            DTOs[DTOs<br/>dto/command/, dto/result/]
            InboundPorts[Inbound Ports<br/>port/inbound/user.go]
        end

        subgraph "Infrastructure Layer"
            UserWriter[User Writer<br/>repository/user/writer/]
            UserReader[User Reader<br/>repository/user/reader/]
            GORM[GORM Connection<br/>database/orm.go]
            GRPCServer[gRPC Server<br/>grpcserver/init.go]
        end

        subgraph "Interface Layer"
            UserCtrl[User Controller<br/>controller/user/]
        end
    end

    Router --> MW
    MW --> HealthMod
    MW --> AuthMod
    MW --> IdentityMod
    AuthMod --> GRPCStub
    IdentityMod --> RedisCache
    HTTPServer --> Router

    GRPCStub -.->|gRPC| GRPCServer
    GRPCServer --> UserCtrl
    UserCtrl --> RegisterUC
    UserCtrl --> LoginUC
    RegisterUC --> UserEntity
    LoginUC --> UserEntity
    UserEntity --> EmailVO
    UserEntity --> PasswordVO
    UserFactory --> UserEntity
    RegisterUC --> UserWriter
    LoginUC --> UserReader
    UserWriter --> GORM
    UserReader --> GORM
```

### Module Details

#### API Gateway Modules

| Module | Path | Controllers | Purpose |
|--------|------|-------------|---------|
| Health | `internal/modules/health/` | `check/controller.go` | Health check endpoint |
| Authentication | `internal/modules/authentication/` | `login/controller.go`, `register/controller.go` | Login/register HTTP handlers |
| Identity | `internal/modules/identity/` | `handle_visitor/controller.go`, `handle_rate_limit/controller.go` | Visitor identity management |

#### Authentication Service Layers

| Layer | Path | Key Components |
|-------|------|----------------|
| Domain | `internal/domain/` | User entity, Email/PasswordHash VOs, UserFactory, Repository interfaces |
| Application | `internal/application/` | Register/Login use cases, DTOs, Inbound ports |
| Infrastructure | `internal/infrastructure/` | GORM repos, gRPC server, database connection |
| Interface | `internal/interface/` | gRPC controllers |

---

## 3. Data Flow

### Overview

The system handles three primary data flows:

1. **Visitor Identity Flow**: Browser → API Gateway → Redis (cookie-based identity tokens)
2. **Authentication Flow**: Browser → API Gateway → gRPC → Auth Service → PostgreSQL
3. **Rate Limiting Flow**: API Gateway → Redis (request counting per visitor)

### Diagram

```mermaid
flowchart LR
    subgraph "Request Flow"
        Browser[Browser]
        Gateway[API Gateway]
        Redis[(Redis)]
        AuthService[Auth Service]
        Postgres[(PostgreSQL)]
    end

    subgraph "1. Visitor Identity Flow"
        Browser -->|1. Request without cookie| Gateway
        Gateway -->|2. Generate visitor ID| Redis
        Redis -->|3. Store identity| Gateway
        Gateway -->|4. Set cookie| Browser
    end

    subgraph "2. Authentication Flow"
        Browser -->|POST /api/v1/authentication/login| Gateway
        Gateway -->|Validate identity| Redis
        Gateway -->|gRPC Login request| AuthService
        AuthService -->|Query user| Postgres
        Postgres -->|User data| AuthService
        AuthService -->|gRPC response| Gateway
        Gateway -->|JSON response| Browser
    end

    subgraph "3. Rate Limiting Flow"
        Browser -->|Request with visitor cookie| Gateway
        Gateway -->|Check rate limit| Redis
        Redis -->|Count/Allow| Gateway
        Gateway -->|Proceed or 429| Browser
    end
```

### Flow Descriptions

#### Visitor Identity Flow
1. Browser makes initial request without visitor cookie
2. Identity middleware generates unique visitor ID
3. Visitor ID stored in Redis with configurable expiration (default: 365 days)
4. Cookie set in browser response for subsequent requests

#### Authentication Flow (Login)
1. Browser POSTs credentials to `/api/v1/authentication/login`
2. API Gateway validates visitor identity via Redis
3. Gateway calls Auth Service via gRPC with `login.Request`
4. Auth Service queries PostgreSQL for user by email/username
5. Password hash verified against stored hash
6. Response returned through the chain to browser

#### Authentication Flow (Register)
1. Browser POSTs email/password to `/api/v1/authentication/register`
2. Gateway forwards to Auth Service via gRPC
3. Auth Service checks if email already exists
4. Password hashed using value object validation
5. New user created via User Factory
6. User persisted to PostgreSQL via GORM

---

## 4. Data Models

### Overview

The primary data model is the **User** entity in the Authentication Service. It uses value objects for email and password validation. The API Gateway uses a lightweight **Identity** model for visitor tracking stored in Redis.

### Diagram

```mermaid
classDiagram
    class User {
        +UUID id
        +Email email
        +PasswordHash password_hash
        +bool is_verified
        +timestamp created_at
        +timestamp updated_at
        +timestamp deleted_at
    }

    class Email {
        -string value
        +Validate() error
        +String() string
    }

    class PasswordHash {
        -string hash
        +Hash(password string) error
        +Verify(password string) bool
    }

    class Identity {
        +string ID
        +timestamp CreatedAt
    }

    class VisitorToken {
        +string visitor_id
        +timestamp expires_at
    }

    User *-- Email : contains
    User *-- PasswordHash : contains

    note for User "Stored in PostgreSQL\nusers table"
    note for Identity "Stored in Redis\nfor visitor tracking"
    note for VisitorToken "Stored in browser cookie"
```

### Entity Descriptions

| Entity | Storage | File | Key Properties | Relationships |
|--------|---------|------|----------------|---------------|
| User | PostgreSQL | `services/authentication/internal/domain/entity/user.go` | id (UUID), email, password_hash, is_verified, timestamps | Contains Email and PasswordHash VOs |
| Email | Value Object | `services/authentication/internal/domain/valueobject/email.go` | value (string) | Part of User |
| PasswordHash | Value Object | `services/authentication/internal/domain/valueobject/password_hash.go` | hash (string) | Part of User |
| Identity | Redis | `services/api-gateway/internal/modules/identity/type.go` | ID, CreatedAt | Visitor tracking |

### Database Schema

```sql
-- Users Table (PostgreSQL)
CREATE TABLE Users (
    id            UUID NOT NULL DEFAULT gen_random_uuid(),
    email         CITEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    is_verified   BOOLEAN DEFAULT FALSE,
    created_at    TIMESTAMPTZ DEFAULT NOW(),
    updated_at    TIMESTAMPTZ DEFAULT NOW(),
    deleted_at    TIMESTAMPTZ,
    CONSTRAINT PK_USERS PRIMARY KEY(id)
);
```

---

## 5. Key Interactions

### Overview

This diagram shows the critical request/response flows for the main operations: health check, user registration, and user login.

### Diagram

```mermaid
sequenceDiagram
    participant B as Browser
    participant GW as API Gateway
    participant R as Redis
    participant AS as Auth Service
    participant DB as PostgreSQL

    Note over B,DB: Health Check Flow
    B->>GW: GET /api/health/check
    GW->>GW: Check internal status
    GW-->>B: 200 OK { success: true }

    Note over B,DB: Registration Flow
    B->>GW: POST /api/v1/authentication/register
    GW->>R: Get/Store visitor identity
    R-->>GW: Identity confirmed
    GW->>GW: Rate limit check
    GW->>AS: gRPC Register(email, password)
    AS->>DB: SELECT WHERE email = ?
    DB-->>AS: No existing user
    AS->>AS: Factory.NewUser()
    AS->>AS: Hash password
    AS->>DB: INSERT INTO users
    DB-->>AS: User created
    AS-->>GW: RegisterResponse(id, email)
    GW-->>B: 200 OK { success, data: { id, email } }

    Note over B,DB: Login Flow
    B->>GW: POST /api/v1/authentication/login
    GW->>R: Get visitor identity
    R-->>GW: Identity found
    GW->>GW: Rate limit check
    GW->>AS: gRPC Login(identifier, password)
    AS->>DB: SELECT WHERE email = identifier
    DB-->>AS: User found
    AS->>AS: Verify password hash
    AS-->>GW: LoginResponse(message, user)
    GW-->>B: 200 OK { success, data: { user } }

    Note over B,DB: Error Flow (Email Already Used)
    B->>GW: POST /api/v1/authentication/register
    GW->>AS: gRPC Register(email, password)
    AS->>DB: SELECT WHERE email = ?
    DB-->>AS: User exists
    AS-->>GW: gRPC Error: EmailAlreadyUsed
    GW->>GW: Parse gRPC error
    GW-->>B: 400 Bad Request { error: "email already used" }
```

### Interaction Descriptions

| Flow | Steps | Error Handling |
|------|-------|----------------|
| Health Check | Direct response from gateway | None - always returns success |
| Registration | Identity validation → Rate limit → gRPC call → DB check → User creation | Email already used, invalid email format, weak password |
| Login | Identity validation → Rate limit → gRPC call → DB lookup → Password verification | User not found, invalid credentials |
| Rate Limited | Identity validation → Rate limit exceeded | Returns 429 Too Many Requests |

---

## Appendix A: File Structure

```
project/
├── .github/
│   └── workflows/
│       └── ci.yml                    # GitHub Actions CI pipeline
├── .opencode/
│   ├── agents/                       # AI agent configurations
│   │   ├── architect.md
│   │   ├── backend-engineer.md
│   │   ├── code-reviewer.md
│   │   ├── frontend-engineer.md
│   │   └── ...
│   └── plan/                         # Development plans
│       └── 20260214_185528_implement-jwt-authentication-cookie.md
├── data/
│   ├── database/
│   │   └── authentication/
│   │       └── query/table/
│   │           └── users.sql         # User table schema
│   ├── pb/                           # Generated Go protobuf files
│   │   └── authentication/v1/
│   └── proto/                        # Protobuf source files
│       └── authentication/v1/
│           ├── service.proto         # gRPC service definition
│           ├── login/
│           ├── register/
│           └── token/
├── deployment/
│   └── docker-compose.yml            # Docker orchestration
├── frontend/
│   ├── src/
│   │   └── app/
│   │       ├── globals.css
│   │       ├── layout.tsx            # Root layout
│   │       ├── page.module.css
│   │       └── page.tsx              # Home page
│   ├── next.config.ts
│   ├── package.json
│   └── tsconfig.json
├── scripts/
│   ├── compile-proto.sh              # Protobuf compilation
│   ├── lint.sh                       # Run linters
│   └── stop-all-service.sh
├── services/
│   ├── api-gateway/
│   │   ├── cmd/app/main.go           # Entry point
│   │   ├── documentation/
│   │   │   ├── api/                  # Swagger files
│   │   │   └── architecture.md
│   │   ├── internal/
│   │   │   ├── appctx/               # Shared utilities
│   │   │   ├── apperr/               # Error types
│   │   │   ├── bootstrap/            # App initialization
│   │   │   │   ├── middleware/
│   │   │   │   ├── module/
│   │   │   │   └── router/
│   │   │   ├── config/
│   │   │   ├── generated/pb/         # Generated protobuf
│   │   │   ├── infrastructure/
│   │   │   │   ├── cache/
│   │   │   │   ├── grpc/
│   │   │   │   ├── http/
│   │   │   │   ├── logger/
│   │   │   │   └── repository/
│   │   │   └── modules/
│   │   │       ├── authentication/
│   │   │       ├── health/
│   │   │       └── identity/
│   │   ├── go.mod
│   │   └── README.md
│   └── authentication/
│       ├── cmd/app/main.go           # Entry point
│       ├── internal/
│       │   ├── appctx/
│       │   ├── application/          # Application layer (DDD)
│       │   │   ├── apperr/
│       │   │   ├── dto/
│       │   │   ├── port/
│       │   │   └── usecase/
│       │   ├── bootstrap/
│       │   ├── config/
│       │   ├── domain/               # Domain layer (DDD)
│       │   │   ├── entity/
│       │   │   ├── factory/
│       │   │   ├── repository/
│       │   │   └── valueobject/
│       │   ├── generated/pb/
│       │   ├── infrastructure/       # Infrastructure layer
│       │   │   ├── database/
│       │   │   ├── grpcserver/
│       │   │   ├── logger/
│       │   │   └── repository/
│       │   └── interface/            # Interface layer
│       │       └── controller/
│       ├── go.mod
│       └── README.md
├── tools/
│   ├── lint.Dockerfile
│   └── proto-compiler.Dockerfile
├── AGENTS.md                         # Agent documentation
├── README.md                         # Project documentation
└── .ignore
```

---

## Appendix B: Entry Points

| Service | File | Type | Port | Description |
|---------|------|------|------|-------------|
| API Gateway | `services/api-gateway/cmd/app/main.go` | HTTP | 3000 | Main entry point, initializes bootstrap and starts HTTP server |
| Authentication | `services/authentication/cmd/app/main.go` | gRPC | 1001 | gRPC server entry point, registers authentication service |
| Frontend | `frontend/src/app/page.tsx` | SSR | 3000 | Next.js App Router entry (development) |

### Bootstrap Flow

**API Gateway:**
```
main.go → bootstrap.Init() → config.Load() → infrastructure.Init() → module.Init() → router.Register() → server.Start()
```

**Authentication:**
```
main.go → bootstrap.InitApp() → config.Load() → database.Connect() → repository.Init() → usecase.Init() → controller.Init() → grpc.Serve()
```

---

## Appendix C: External Dependencies

| Dependency | Type | Purpose | Used In |
|------------|------|---------|---------|
| Redis | Cache | Identity tokens, rate limiting | `api-gateway/internal/infrastructure/cache/redis.go` |
| PostgreSQL | Database | User persistence | `authentication/internal/infrastructure/database/` |
| gRPC | RPC | Inter-service communication | `api-gateway/internal/infrastructure/grpc/`, `authentication/internal/infrastructure/grpcserver/` |
| Gin | HTTP Framework | API Gateway HTTP server | `api-gateway/internal/infrastructure/http/gin/` |
| GORM | ORM | Database operations | `authentication/internal/infrastructure/database/orm.go` |
| go-redis | Redis Client | Redis connection | `api-gateway/internal/infrastructure/cache/redis.go` |
| swaggo | Swagger | API documentation | `api-gateway/documentation/api/` |
| godotenv | Config | Environment loading | Both services (autoload) |
| logrus/slog | Logging | Structured logging | Both services |

---

## Appendix D: Notes & Assumptions

### Assumptions Made

1. **Architecture Patterns** - Based on README and directory structure analysis:
   - API Gateway uses Modular Architecture (confirmed by `internal/modules/` structure)
   - Authentication Service uses DDD + Clean Architecture (confirmed by `domain/`, `application/`, `infrastructure/` layers)

2. **Database Choice** - PostgreSQL inferred from:
   - `data/database/authentication/query/table/users.sql` with PostgreSQL-specific syntax (`CITEXT`, `gen_random_uuid()`)
   - GORM usage in authentication service

3. **Redis Usage** - Inferred from:
   - `internal/infrastructure/cache/redis.go` in API Gateway
   - Identity module references to token storage
   - Rate limiting middleware references

4. **gRPC Communication** - Confirmed by:
   - Protocol buffer definitions in `data/proto/authentication/v1/`
   - Generated Go code in both services
   - gRPC stub initialization in API Gateway

### Uncertainties

1. **[?] Reverse Proxy Service** - Directory exists but appears empty/placeholder. Intended for load balancing or SSL termination but not implemented.

2. **[?] Token Management** - Protocol buffers define `Refresh`, `Logout`, and `Validate` RPCs but implementation status unclear from available files.

3. **[?] Frontend-Backend Integration** - Frontend appears minimal (basic page). Full integration with API Gateway endpoints may be in progress.

### Limitations

1. **Generated Files** - `.next/` directory and generated protobuf files were scanned but contain build artifacts, not source code.

2. **Environment Configuration** - Actual `.env` files not read (security). Configuration inferred from code references and README documentation.

3. **Test Coverage** - Test files exist (`login_test.go`) but were not analyzed in depth.

---

## Scan Summary

| Metric | Count |
|--------|-------|
| Services Analyzed | 2 (API Gateway, Authentication) |
| Go Files (API Gateway) | ~83 |
| Go Files (Authentication) | ~61 |
| TypeScript/TSX Files | 2 |
| Protocol Buffer Definitions | 10+ |
| Database Tables | 1 (Users) |
| Redis Databases Used | 1 (Identity DB) |
| gRPC Services | 1 (Authentication) |
| HTTP Endpoints | 4+ (Health, Login, Register, Swagger) |

---

**Scan completed successfully. All diagrams validated for Mermaid syntax.**
