# Context Exploration: JWT Authentication with Cookie Storage

**Requirement**: Implement JWT authentication with access and refresh tokens. The JWT tokens must be set to the client's cookies via backend (HTTP-only, secure cookies). Support token refresh, logout, and validation. Integration into existing Moufube microservices architecture (API Gateway + Auth Service via gRPC).

**Date**: 2026-03-21
**Explorer**: Scout (Codebase Explorer)

---

## Executive Summary

The project requires implementing JWT-based authentication with HTTP-only cookie storage in the Moufube microservices architecture. A comprehensive architecture plan already exists with detailed specifications. The codebase uses Go backend services (API Gateway + Authentication Service) communicating via gRPC, with a Next.js frontend. Proto definitions are already updated for JWT support, but implementation code does not exist yet.

---

## User Requirement

**Request**: "Implement JWT authentication with access and refresh tokens. The JWT tokens must be set to the client's cookies via backend (HTTP-only, secure cookies). The system should support token refresh, logout, and validation. This will be integrated into the existing Moufube microservices architecture (API Gateway + Auth Service via gRPC)."

**Refined Requirements**:
- Generate JWT access tokens (15 min expiration) and refresh tokens (7 days expiration)
- Store tokens in HTTP-only cookies: `ACCESS_TOKEN` and `REFRESH_TOKEN`
- Cookies must have security attributes: `HttpOnly`, `Secure`, `SameSite=Strict`
- Implement refresh token endpoint
- Implement logout endpoint with token blacklisting
- Implement token validation for protected routes
- Integrate with existing gRPC-based microservices architecture

---

## Project Overview

### Architecture
- **Pattern**: Microservices with Monorepo structure
- **Services**:
  - **Frontend**: Next.js 15.5.4 + React 19.1.0 + TypeScript
  - **API Gateway**: Go 1.25.4 + Gin (Modular Architecture) - Port 3000
  - **Authentication Service**: Go 1.25.4 + gRPC (DDD + Clean Architecture) - Port 1001
- **Communication**: gRPC between services
- **Databases**: PostgreSQL (user data), Redis (cache/tokens/rate limiting)
- **Infrastructure**: Docker Compose, Dev Containers

### Current Authentication Flow
1. User submits login credentials to API Gateway (HTTP POST)
2. API Gateway calls Authentication Service via gRPC
3. Authentication Service validates credentials against PostgreSQL
4. Returns user data (NO JWT tokens currently)
5. No cookie setting occurs
6. No token-based authentication exists

### Current gRPC Methods
- `Register`: Create new user account
- `Login`: Authenticate user (returns user data only, no tokens)

---

## Relevant Files

### Architecture Documentation
| File | Relevance | Status |
|------|-----------|--------|
| `.opencode/plan/20260214_185528_implement-jwt-authentication-cookie.md` | Complete architecture plan for JWT with cookies (41KB) | ✅ Exists, comprehensive |
| `.opencode/ticket/created/20260214_185528_implement-jwt-authentication-cookie.md` | Requirements and acceptance criteria | ✅ Exists, detailed |
| `services/api-gateway/documentation/api-requirement/authentication/login.md` | Login API specification | ✅ Planned feature doc |
| `services/api-gateway/documentation/architecture.md` | API Gateway architecture | ✅ Reference |
| `services/authentication/documentation/` | Auth service architecture | ✅ Reference |

### Proto Definitions (Updated for JWT)
| File | Relevance | Status |
|------|-----------|--------|
| `data/proto/authentication/v1/login/response.proto` | Login response with `access_token`, `refresh_token` fields | ✅ Updated |
| `data/proto/authentication/v1/service.proto` | gRPC service with Refresh, Logout, Validate RPCs | ✅ Updated |
| `data/proto/authentication/v1/token/refresh_request.proto` | Refresh token request message | ✅ Exists |
| `data/proto/authentication/v1/token/refresh_response.proto` | Refresh token response message | ✅ Exists |
| `data/proto/authentication/v1/token/logout_request.proto` | Logout request message | ✅ Exists |
| `data/proto/authentication/v1/token/logout_response.proto` | Logout response message | ✅ Exists |
| `data/proto/authentication/v1/token/validate_request.proto` | Token validation request | ✅ Exists |
| `data/proto/authentication/v1/token/validate_response.proto` | Token validation response | ✅ Exists |

### Authentication Service (Backend - Go)
| File | Relevance | Status |
|------|-----------|--------|
| `services/authentication/internal/application/usecase/user/login.go` | Login use case - needs JWT generation | ⚠️ Exists, needs modification |
| `services/authentication/internal/interface/controller/user/login.go` | Login gRPC controller - needs to return tokens | ⚠️ Exists, needs modification |
| `services/authentication/internal/application/dto/result/login_response.go` | Login response DTO - needs token fields | ⚠️ Exists, needs modification |
| `services/authentication/internal/domain/service/` | Domain service directory | ❌ Does not exist, needs creation |
| `services/authentication/internal/domain/service/jwt.go` | JWT service for token generation/validation | ❌ NEW - Core component |
| `services/authentication/internal/domain/repository/token/reader.go` | Token repository reader interface | ❌ NEW |
| `services/authentication/internal/domain/repository/token/writer.go` | Token repository writer interface | ❌ NEW |
| `services/authentication/internal/infrastructure/repository/token/redis.go` | Redis token repository implementation | ❌ NEW |
| `services/authentication/internal/application/usecase/user/refresh.go` | Refresh token use case | ❌ NEW |
| `services/authentication/internal/application/usecase/user/logout.go` | Logout use case | ❌ NEW |
| `services/authentication/internal/application/usecase/user/validate.go` | Token validation use case | ❌ NEW |
| `services/authentication/internal/interface/controller/user/refresh.go` | Refresh gRPC controller | ❌ NEW |
| `services/authentication/internal/interface/controller/user/logout.go` | Logout gRPC controller | ❌ NEW |
| `services/authentication/internal/interface/controller/user/validate.go` | Validate gRPC controller | ❌ NEW |
| `services/authentication/internal/config/type.go` | Config struct - needs JWT fields | ⚠️ Needs modification |
| `services/authentication/internal/bootstrap/type.go` | App struct - needs JWT service/repositories | ⚠️ Needs modification |
| `services/authentication/internal/bootstrap/reader.go` | Bootstrap - needs token reader | ⚠️ Needs modification |
| `services/authentication/internal/bootstrap/writer.go` | Bootstrap - needs token writer | ⚠️ Needs modification |
| `services/authentication/internal/bootstrap/use_case.go` | Bootstrap - inject token repos into use cases | ⚠️ Needs modification |
| `services/authentication/internal/bootstrap/controller.go` | Bootstrap - register new controllers | ⚠️ Needs modification |

### API Gateway (Backend - Go)
| File | Relevance | Status |
|------|-----------|--------|
| `services/api-gateway/internal/modules/authentication/login/controller.go` | Login HTTP controller - needs cookie setting | ⚠️ Exists, needs modification |
| `services/api-gateway/internal/bootstrap/middleware/identity.go` | Existing middleware pattern for cookies | ✅ Reference implementation |
| `services/api-gateway/internal/bootstrap/middleware/constant/cookie.go` | Cookie constants - needs ACCESS_TOKEN, REFRESH_TOKEN | ⚠️ Exists, needs modification |
| `services/api-gateway/internal/bootstrap/middleware/jwt.go` | JWT validation middleware | ❌ NEW - Core component |
| `services/api-gateway/internal/modules/authentication/refresh/controller.go` | Refresh token HTTP controller | ❌ NEW |
| `services/api-gateway/internal/modules/authentication/refresh/service.go` | Refresh token service | ❌ NEW |
| `services/api-gateway/internal/modules/authentication/refresh/grpc_client.go` | gRPC client for refresh | ❌ NEW |
| `services/api-gateway/internal/modules/authentication/logout/controller.go` | Logout HTTP controller | ❌ NEW |
| `services/api-gateway/internal/modules/authentication/logout/service.go` | Logout service | ❌ NEW |
| `services/api-gateway/internal/modules/authentication/logout/grpc_client.go` | gRPC client for logout | ❌ NEW |
| `services/api-gateway/internal/bootstrap/module/authentication/bootstrap.go` | Auth module bootstrap | ⚠️ Needs modification |
| `services/api-gateway/internal/bootstrap/module/authentication/refresh.go` | Refresh module bootstrap | ❌ NEW |
| `services/api-gateway/internal/bootstrap/module/authentication/logout.go` | Logout module bootstrap | ❌ NEW |
| `services/api-gateway/internal/bootstrap/router/v1/authentication.go` | Auth routes - needs refresh/logout routes | ⚠️ Needs modification |
| `services/api-gateway/internal/config/type.go` | Config struct - needs Redis token DB | ⚠️ Needs modification |

### Frontend (Next.js + TypeScript)
| File | Relevance | Status |
|------|-----------|--------|
| `frontend/src/app/layout.tsx` | Root layout - potential auth provider location | ✅ Exists |
| `frontend/src/app/page.tsx` | Home page | ✅ Exists |
| `frontend/package.json` | Dependencies - no additional JWT deps needed | ✅ Minimal deps currently |
| `frontend/src/app/(auth)/login/page.tsx` | Login page | ❌ NEW (optional) |
| `frontend/src/app/(auth)/register/page.tsx` | Register page | ❌ NEW (optional) |
| `frontend/src/contexts/AuthContext.tsx` | Auth context provider | ❌ NEW (optional) |

---

## Relevant Folders

### Authentication Service Structure
```
services/authentication/
├── cmd/app/main.go                           # Entry point ✅
├── internal/
│   ├── domain/                               # Domain layer (DDD)
│   │   ├── entity/                           # User entity ✅
│   │   │   └── user.go
│   │   ├── valueobject/                      # Email, PasswordHash ✅
│   │   │   ├── email.go
│   │   │   ├── password.go
│   │   │   └── password_hash.go
│   │   ├── factory/                          # User factory ✅
│   │   │   └── user.go
│   │   ├── repository/                       # Repository interfaces ✅
│   │   │   ├── user/
│   │   │   │   ├── reader.go
│   │   │   │   └── writer.go
│   │   │   └── repoerr/
│   │   │       └── user.go
│   │   └── service/                          # ❌ NEEDS CREATION
│   │       └── jwt.go                        # ❌ NEW - JWT service
│   ├── application/                          # Application layer
│   │   ├── apperr/                           # Application errors ✅
│   │   ├── port/inbound/                     # Inbound ports ✅
│   │   ├── dto/                              # DTOs ✅
│   │   │   ├── command/
│   │   │   │   ├── login_user.go            # ⚠️ Needs token generation
│   │   │   │   ├── refresh_token.go         # ❌ NEW
│   │   │   │   ├── logout.go                # ❌ NEW
│   │   │   │   └── validate_token.go        # ❌ NEW
│   │   │   └── result/
│   │   │       ├── login_response.go        # ⚠️ Needs token fields
│   │   │       ├── refresh_token.go         # ❌ NEW
│   │   │       ├── logout.go                # ❌ NEW
│   │   │       └── validate_token.go        # ❌ NEW
│   │   └── usecase/user/                     # Use cases ✅
│   │       ├── login.go                      # ⚠️ Needs JWT generation
│   │       ├── register.go                   # ✅ No changes
│   │       ├── refresh.go                    # ❌ NEW
│   │       ├── logout.go                     # ❌ NEW
│   │       └── validate.go                   # ❌ NEW
│   ├── infrastructure/                       # Infrastructure layer
│   │   ├── database/                         # PostgreSQL connection ✅
│   │   │   ├── connection.go
│   │   │   └── orm.go
│   │   ├── grpcserver/                       # gRPC server ✅
│   │   ├── logger/                           # Logging ✅
│   │   └── repository/                       # Repository implementations ✅
│   │       ├── user/                         # User repos ✅
│   │       │   ├── reader/
│   │       │   └── writer/
│   │       └── token/                        # ❌ NEEDS CREATION
│   │           └── redis.go                  # ❌ NEW - Redis blacklist
│   ├── interface/                            # Interface layer
│   │   └── controller/user/                  # gRPC controllers ✅
│   │       ├── init.go
│   │       ├── type.go
│   │       ├── register.go                   # ✅ No changes
│   │       ├── login.go                      # ⚠️ Needs modification
│   │       ├── refresh.go                    # ❌ NEW
│   │       ├── logout.go                     # ❌ NEW
│   │       └── validate.go                   # ❌ NEW
│   ├── bootstrap/                            # Bootstrap/wiring ✅
│   │   ├── init.go
│   │   ├── type.go                           # ⚠️ Needs JWT fields
│   │   ├── reader.go                         # ⚠️ Needs token reader
│   │   ├── writer.go                         # ⚠️ Needs token writer
│   │   ├── use_case.go                       # ⚠️ Needs injection
│   │   └── controller.go                     # ⚠️ Needs new controllers
│   ├── config/                               # Configuration ✅
│   │   ├── type.go                           # ⚠️ Needs JWT config
│   │   └── load.go
│   └── generated/pb/                         # Generated protobuf ✅
│       └── authentication/v1/
├── go.mod                                    # Dependencies ✅
└── .env.example                              # Environment config ✅
```

### API Gateway Structure
```
services/api-gateway/
├── cmd/app/main.go                           # Entry point ✅
├── internal/
│   ├── bootstrap/
│   │   ├── middleware/
│   │   │   ├── init.go
│   │   │   ├── identity.go                   # ✅ Cookie pattern reference
│   │   │   ├── rate_limit.go
│   │   │   ├── jwt.go                        # ❌ NEW - JWT middleware
│   │   │   └── constant/
│   │   │       ├── cookie.go                 # ⚠️ Needs token constants
│   │   │       ├── key.go
│   │   │       └── error_message.go
│   │   ├── module/
│   │   │   ├── bootstrap.go
│   │   │   ├── identity/
│   │   │   └── authentication/
│   │   │       ├── bootstrap.go              # ⚠️ Needs new modules
│   │   │       ├── register.go               # ✅ No changes
│   │   │       ├── login.go                  # ⚠️ Needs cookie logic
│   │   │       ├── refresh.go                # ❌ NEW
│   │   │       └── logout.go                 # ❌ NEW
│   │   └── grpc/
│   │       └── stub/                         # gRPC stubs ✅
│   ├── modules/                              # Feature modules
│   │   ├── health/
│   │   ├── identity/
│   │   └── authentication/
│   │       ├── register/
│   │       │   ├── controller.go
│   │       │   ├── service.go
│   │       │   ├── grpc_client.go
│   │       │   └── response.go
│   │       ├── login/
│   │       │   ├── controller.go             # ⚠️ Needs cookie setting
│   │       │   ├── service.go
│   │       │   ├── grpc_client.go
│   │       │   └── request.go
│   │       ├── refresh/                      # ❌ NEW MODULE
│   │       │   ├── controller.go
│   │       │   ├── service.go
│   │       │   ├── grpc_client.go
│   │       │   └── request.go
│   │       └── logout/                       # ❌ NEW MODULE
│   │           ├── controller.go
│   │           ├── service.go
│   │           └── grpc_client.go
│   ├── infrastructure/                       # Infrastructure layer
│   │   ├── http/                             # HTTP server ✅
│   │   │   ├── server/
│   │   │   └── gin/
│   │   └── repository/                       # Repositories ✅
│   │       └── identity/                     # Redis identity repo ✅
│   ├── shared/                               # Shared utilities ✅
│   │   ├── response/
│   │   └── apperr/
│   ├── appctx/                               # App context utilities ✅
│   └── config/                               # Configuration ✅
│       ├── type.go                           # ⚠️ Needs Redis token DB
│       └── load.go
├── go.mod                                    # Dependencies ✅
└── .env.example                              # Environment config ✅
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/                                  # Next.js App Router
│   │   ├── layout.tsx                        # Root layout ✅
│   │   ├── page.tsx                          # Home page ✅
│   │   ├── globals.css                       # Global styles ✅
│   │   └── (auth)/                           # ❌ Auth routes NOT created
│   │       ├── login/
│   │       │   └── page.tsx                  # ❌ NEW (optional)
│   │       └── register/
│   │           └── page.tsx                  # ❌ NEW (optional)
│   ├── contexts/                             # ❌ Contexts NOT created
│   │   └── AuthContext.tsx                   # ❌ NEW (optional)
│   └── lib/                                  # ❌ Utilities NOT created
│       └── api.ts                            # ❌ NEW (optional)
├── public/                                   # Static files ✅
├── package.json                              # Dependencies ✅
├── next.config.ts                            # Next.js config ✅
└── tsconfig.json                             # TypeScript config ✅
```

---

## Key Dependencies

### Backend (Go)

#### Existing Dependencies
- **gRPC**: `google.golang.org/grpc` - Service communication
- **PostgreSQL**: `gorm.io/gorm` - Database ORM
- **Redis**: `github.com/redis/go-redis/v9` - Caching layer, rate limiting
- **Gin**: `github.com/gin-gonic/gin` - HTTP framework (API Gateway)
- **UUID**: `github.com/google/uuid` - UUID generation
- **Logging**: `github.com/sirupsen/logrus` - Structured logging

#### Required New Dependencies
- **JWT**: `github.com/golang-jwt/jwt/v5` - JWT token generation/validation
  - Industry standard library
  - Supports HS256, RS256, ES256, etc.
  - Active maintenance
  - Well-documented

### Frontend (Node.js)

#### Existing Dependencies
- **Next.js**: `15.5.4` - React framework with App Router
- **React**: `19.1.0` - UI library
- **React DOM**: `19.1.0` - React DOM rendering
- **TypeScript**: `^5` - Type safety

#### Potential New Dependencies
- **No additional dependencies required** for basic JWT cookie handling
- Cookies will be HTTP-only (set by backend, not accessible to JavaScript)
- Frontend just needs to call `/login`, `/logout`, `/refresh` endpoints
- Browser automatically handles cookie transmission
- Optional: Auth context library (can use React Context API built-in)

---

## Entry Points

### Authentication Service
- **gRPC Server**: `services/authentication/cmd/app/main.go`
  - Listens on port 1001 (configurable via `GRPC_PORT`)
  - Registers `Authentication` gRPC service
  - Current RPCs: `Register`, `Login`
  - New RPCs needed: `Refresh`, `Logout`, `Validate`
  - Bootstrap in `internal/bootstrap/init.go`

### API Gateway
- **HTTP Server**: `services/api-gateway/internal/infrastructure/http/server/start.go`
  - Listens on port 3000 (configurable via `HTTP_PORT`)
  - Routes through Gin router
  - Current auth routes:
    - `/api/v1/authentication/login` (POST)
    - `/api/v1/authentication/register` (POST)
  - New routes needed:
    - `/api/v1/authentication/refresh` (POST)
    - `/api/v1/authentication/logout` (POST)
  - Bootstrap in `internal/bootstrap/init.go`

### Frontend
- **Next.js App**: `frontend/src/app/layout.tsx`
  - Root layout component
  - Potential location for auth context provider
  - Server-side rendering support
  - No current auth implementation

---

## Existing Patterns to Follow

### 1. Cookie Setting Pattern (API Gateway)
**Location**: `services/api-gateway/internal/bootstrap/middleware/identity.go`

**Current Implementation**:
```go
func Identity(cfg *config.Config, identityModule *identity.Module) gin.HandlerFunc {
    return func(c *gin.Context) {
        visitorID, _ := c.Cookie(constant.VisitorInfo)
        req := &handlevisitor.Request{VisitorID: visitorID}
        res, err := identityModule.HandleVisitor.Controller.Execute(c, req)
        if err != nil {
            response.Abort(c, http.StatusUnauthorized, constant.IdentityUnknownMessage, nil)
            return
        }

        c.SetCookieData(&http.Cookie{
            Name:     constant.VisitorInfo,
            Value:    res.Identity.ID,
            Path:     "/",
            Domain:   "",
            Expires:  time.Now().Add(time.Duration(cfg.VisitorTokenExpireDays) * 24 * time.Hour),
            Secure:   false,              // Should be true in production
            HttpOnly: true,               // ✅ Already using HttpOnly
        })

        c.Set(constant.Identity, res.Identity)
        c.Next()
    }
}
```

**Apply to JWT**: Same pattern for `ACCESS_TOKEN` and `REFRESH_TOKEN` with:
```go
// Set access token cookie (15 minutes)
c.SetCookieData(&http.Cookie{
    Name:     constant.AccessToken,
    Value:    loginResponse.AccessToken,
    Path:     "/",
    Domain:   "",
    Expires:  time.Now().Add(15 * time.Minute),
    Secure:   cfg.Environment == "production",  // True in prod, false in dev
    HttpOnly: true,
    SameSite: http.SameSiteStrictMode,
})

// Set refresh token cookie (7 days)
c.SetCookieData(&http.Cookie{
    Name:     constant.RefreshToken,
    Value:    loginResponse.RefreshToken,
    Path:     "/",
    Domain:   "",
    Expires:  time.Now().Add(7 * 24 * time.Hour),
    Secure:   cfg.Environment == "production",
    HttpOnly: true,
    SameSite: http.SameSiteStrictMode,
})
```

### 2. Middleware Pattern (API Gateway)
**Location**: `services/api-gateway/internal/bootstrap/middleware/identity.go`

**Current Implementation**:
```go
func Identity(cfg *config.Config, identityModule *identity.Module) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Read cookie
        visitorID, _ := c.Cookie(constant.VisitorInfo)

        // 2. Validate/process
        req := &handlevisitor.Request{VisitorID: visitorID}
        res, err := identityModule.HandleVisitor.Controller.Execute(c, req)

        // 3. Handle error
        if err != nil {
            response.Abort(c, http.StatusUnauthorized, constant.IdentityUnknownMessage, nil)
            return
        }

        // 4. Set context
        c.Set(constant.Identity, res.Identity)
        c.Next()
    }
}
```

**Apply to JWT**: Create `JWT()` middleware that:
```go
func JWT(cfg *config.Config, authModule *authentication.Module) gin.HandlerFunc {
    return func(c *gin.Context) {
        // 1. Read ACCESS_TOKEN from cookie
        accessToken, err := c.Cookie(constant.AccessToken)
        if err != nil {
            response.Abort(c, http.StatusUnauthorized, "Missing access token", nil)
            return
        }

        // 2. Call gRPC Validate endpoint
        req := &validate.Request{AccessToken: accessToken}
        res, err := authModule.Validate.Controller.Execute(c, req)
        if err != nil {
            response.Abort(c, http.StatusUnauthorized, "Invalid access token", nil)
            return
        }

        // 3. Set user context
        c.Set(constant.User, res.User)
        c.Next()
    }
}
```

### 3. Use Case Pattern (Authentication Service)
**Location**: `services/authentication/internal/application/usecase/user/login.go`

**Current Implementation**:
```go
func (u *UseCaseImpl) Login(ctx context.Context, command *command.LoginUser) (*result.LoginUser, error) {
    // 1. Get user by email
    fetchedUser, err := u.userReader.GetByEmail(ctx, command.Identifier)
    if err != nil {
        if errors.Is(err, repoerr.ErrUserNotFound) {
            return nil, apperr.ErrInvalidCredentials
        }
        return nil, err
    }

    // 2. Verify password
    if !fetchedUser.PasswordHash.Verify(command.Password) {
        return nil, apperr.ErrInvalidCredentials
    }

    // 3. Return result
    return &result.LoginUser{
        Message:    "Login successful",
        ID:         fetchedUser.ID.String(),
        IsVerified: fetchedUser.IsVerified,
        Email:      fetchedUser.Email.String(),
    }, nil
}
```

**Apply to JWT**: Add JWT generation after password verification:
```go
func (u *UseCaseImpl) Login(ctx context.Context, command *command.LoginUser) (*result.LoginUser, error) {
    // 1. Get user
    fetchedUser, err := u.userReader.GetByEmail(ctx, command.Identifier)
    if err != nil {
        if errors.Is(err, repoerr.ErrUserNotFound) {
            return nil, apperr.ErrInvalidCredentials
        }
        return nil, err
    }

    // 2. Verify password
    if !fetchedUser.PasswordHash.Verify(command.Password) {
        return nil, apperr.ErrInvalidCredentials
    }

    // 3. Generate access token (NEW)
    accessToken, err := u.jwtService.GenerateAccessToken(fetchedUser)
    if err != nil {
        return nil, fmt.Errorf("failed to generate access token: %w", err)
    }

    // 4. Generate refresh token (NEW)
    refreshToken, tokenID, err := u.jwtService.GenerateRefreshToken(fetchedUser)
    if err != nil {
        return nil, fmt.Errorf("failed to generate refresh token: %w", err)
    }

    // 5. Store refresh token in Redis (NEW)
    err = u.tokenWriter.StoreRefreshToken(
        ctx,
        tokenID,
        fetchedUser.ID,
        7*24*time.Hour,  // 7 days
    )
    if err != nil {
        return nil, fmt.Errorf("failed to store refresh token: %w", err)
    }

    // 6. Return result with tokens
    return &result.LoginUser{
        Message:      "Login successful",
        ID:           fetchedUser.ID.String(),
        IsVerified:   fetchedUser.IsVerified,
        Email:        fetchedUser.Email.String(),
        AccessToken:  accessToken,   // NEW
        RefreshToken: refreshToken,  // NEW
    }, nil
}
```

### 4. Repository Pattern (Authentication Service)
**Location**: `services/authentication/internal/domain/repository/user/reader.go`

**Current Implementation**:
```go
type Reader interface {
    GetByEmail(ctx context.Context, email string) (*entity.User, error)
    GetByID(ctx context.Context, id uuid.UUID) (*entity.User, error)
}
```

**Apply to Token Repository**: Create similar interfaces:
```go
// domain/repository/token/reader.go
type Reader interface {
    IsBlacklisted(ctx context.Context, tokenID string) (bool, error)
    GetRefreshToken(ctx context.Context, tokenID string) (string, error)
}

// domain/repository/token/writer.go
type Writer interface {
    StoreRefreshToken(ctx context.Context, tokenID string, userID uuid.UUID, expiration time.Duration) error
    Blacklist(ctx context.Context, tokenID string, expiration time.Duration) error
    DeleteRefreshToken(ctx context.Context, tokenID string) error
}
```

**Redis Implementation**:
```go
// infrastructure/repository/token/redis.go
type RedisRepository struct {
    client *redis.Client
    db     int
}

func (r *RedisRepository) IsBlacklisted(ctx context.Context, tokenID string) (bool, error) {
    key := fmt.Sprintf("token:blacklist:%s", tokenID)
    return r.client.Exists(ctx, key).Result()
}

func (r *RedisRepository) StoreRefreshToken(ctx context.Context, tokenID string, userID uuid.UUID, expiration time.Duration) error {
    key := fmt.Sprintf("token:refresh:%s:%s", userID.String(), tokenID)
    return r.client.Set(ctx, key, tokenID, expiration).Err()
}

func (r *RedisRepository) Blacklist(ctx context.Context, tokenID string, expiration time.Duration) error {
    key := fmt.Sprintf("token:blacklist:%s", tokenID)
    return r.client.Set(ctx, key, "1", expiration).Err()
}
```

### 5. gRPC Controller Pattern (Authentication Service)
**Location**: `services/authentication/internal/interface/controller/user/login.go`

**Current Pattern**:
1. Parse gRPC request
2. Convert to command DTO
3. Call use case
4. Convert result to gRPC response
5. Return response

**Apply to new controllers**: Create similar structure for `refresh.go`, `logout.go`, `validate.go`

### 6. Module Bootstrap Pattern (API Gateway)
**Location**: `services/api-gateway/internal/bootstrap/module/authentication/login.go`

**Current Pattern**:
1. Initialize gRPC client
2. Create service
3. Create controller
4. Return module struct

**Apply to new modules**: Create similar bootstrap files for `refresh.go` and `logout.go`

---

## Technical Specifications (from Architecture Plan)

### JWT Configuration
| Parameter | Value | Environment Variable |
|-----------|-------|---------------------|
| Access Token Secret | 256-bit secret | `JWT_ACCESS_SECRET` |
| Refresh Token Secret | 256-bit secret (different from access) | `JWT_REFRESH_SECRET` |
| Access Token Expiration | 15 minutes | `JWT_ACCESS_EXPIRATION_MINUTES` |
| Refresh Token Expiration | 7 days | `JWT_REFRESH_EXPIRATION_DAYS` |
| Signing Algorithm | HS256 (HMAC-SHA256) | N/A |
| Token ID (jti) | UUID v4 | N/A |

### Cookie Configuration
| Cookie Name | Expiration | HttpOnly | Secure | SameSite | Path |
|-------------|------------|----------|--------|----------|------|
| `ACCESS_TOKEN` | 15 minutes | true | true (prod) / false (dev) | Strict | / |
| `REFRESH_TOKEN` | 7 days | true | true (prod) / false (dev) | Strict | / |

**Environment Consideration**:
- `Secure: true` in production (HTTPS only)
- `Secure: false` in development (HTTP localhost)
- Detect via `ENVIRONMENT` config variable

### JWT Claims Structure
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "exp": 1739721600,
  "iat": 1739720700,
  "jti": "550e8400-e29b-41d4-a716-446655440000",
  "type": "access"
}
```

| Claim | Type | Purpose |
|-------|------|---------|
| `sub` | string | User identifier (UUID) |
| `email` | string | User email for quick access |
| `exp` | int64 | Expiration timestamp (Unix) |
| `iat` | int64 | Issued at timestamp (Unix) |
| `jti` | string | Unique token ID (UUID) for blacklist tracking |
| `type` | string | Token type: `access` or `refresh` |

### Redis Key Structure
| Key Pattern | Value | Purpose | TTL |
|-------------|-------|---------|-----|
| `token:blacklist:{jti}` | "1" | Blacklisted refresh token | 7 days |
| `token:refresh:{user_id}:{jti}` | tokenID | Active refresh token | 7 days |

### Redis Configuration
| Parameter | Value | Environment Variable |
|-----------|-------|---------------------|
| Redis Host | `redis` | `REDIS_HOST` |
| Redis Port | `6379` | `REDIS_PORT` |
| Redis Password | `admin` | `REDIS_PASSWORD` |
| Token DB Index | `1` | `REDIS_TOKEN_DB` |
| Identity DB Index | `?` | `IDENTITY_DB` |

**Note**: Use separate Redis DB for tokens (DB 1) to isolate from identity tokens (DB ?) and rate limiting.

---

## API Endpoints (Planned)

### Authentication Endpoints
| Endpoint | Method | Auth Required | Purpose | Request | Response |
|----------|--------|---------------|---------|---------|----------|
| `/api/v1/authentication/login` | POST | No | Authenticate and receive cookies | `{identifier, password}` | `{message, user, tokens}` + cookies |
| `/api/v1/authentication/register` | POST | No | Create new user account | `{email, password}` | `{id, email}` |
| `/api/v1/authentication/refresh` | POST | No (uses refresh token) | Refresh access token | Cookies: `REFRESH_TOKEN` | `{access_token}` + cookie |
| `/api/v1/authentication/logout` | POST | No (uses refresh token) | Revoke tokens and clear cookies | Cookies: `REFRESH_TOKEN` | `{message}` + clear cookies |

### Protected Routes
Any route protected by JWT middleware will:
1. Require `ACCESS_TOKEN` cookie
2. Validate token via gRPC call to Authentication Service
3. Set user context (`c.Set("user", user)`) for downstream handlers
4. Return 401 Unauthorized if invalid/missing token

### Example Protected Route Usage
```go
// In router setup
protected := r.Group("/api/v1")
protected.Use(middleware.JWT(cfg, authModule))
{
    protected.GET("/profile", profileHandler.GetProfile)
    protected.PUT("/profile", profileHandler.UpdateProfile)
}
```

---

## gRPC Service Methods (Planned)

| Method | Request | Response | Purpose |
|--------|---------|----------|---------|
| `Register` | `register.Request` | `register.Response` | Create user account |
| `Login` | `login.Request` | `login.Response` (with tokens) | Authenticate user |
| `Refresh` | `token.RefreshRequest` | `token.RefreshResponse` | Refresh access token |
| `Logout` | `token.LogoutRequest` | `token.LogoutResponse` | Revoke refresh token |
| `Validate` | `token.ValidateRequest` | `token.ValidateResponse` | Validate access token |

### Proto Definitions (Already Updated)
```protobuf
// login/response.proto
message Response {
    string message = 1;
    User user = 2;
    string access_token = 3;   // ✅ NEW
    string refresh_token = 4;  // ✅ NEW
}

// service.proto
service Authentication {
    rpc Register(register.Request) returns (register.Response) {}
    rpc Login(login.Request) returns (login.Response) {}
    rpc Refresh(token.RefreshRequest) returns (token.RefreshResponse) {}      // ✅ NEW
    rpc Logout(token.LogoutRequest) returns (token.LogoutResponse) {}         // ✅ NEW
    rpc Validate(token.ValidateRequest) returns (token.ValidateResponse) {}   // ✅ NEW
}
```

---

## Data Flows

### Login Flow
```
1. Client → POST /api/v1/authentication/login
   Headers: Content-Type: application/json
   Body: {
     "identifier": "user@example.com",
     "password": "SecurePass123!"
   }

2. API Gateway (Login Controller):
   a. Parse HTTP request
   b. Create gRPC request: login.Request{identifier, password}
   c. Call gRPC Authentication.Login(request)

3. Authentication Service (Login Use Case):
   a. Get user by email from PostgreSQL
   b. Verify password hash (bcrypt/argon2)
   c. Generate access token (15 min) using JWT service
   d. Generate refresh token (7 days) using JWT service
   e. Store refresh token ID in Redis with TTL
   f. Return LoginResponse{
        message: "Login successful",
        user: {id, email, is_verified},
        access_token: "eyJhbGc...",
        refresh_token: "eyJhbGc..."
      }

4. API Gateway (Login Controller):
   a. Receive gRPC response with tokens
   b. Set ACCESS_TOKEN cookie:
      - Name: ACCESS_TOKEN
      - Value: access_token from response
      - HttpOnly: true
      - Secure: true (prod) / false (dev)
      - SameSite: Strict
      - Expires: now + 15 minutes
   c. Set REFRESH_TOKEN cookie:
      - Name: REFRESH_TOKEN
      - Value: refresh_token from response
      - HttpOnly: true
      - Secure: true (prod) / false (dev)
      - SameSite: Strict
      - Expires: now + 7 days
   d. Return HTTP 200 JSON response:
      {
        "success": true,
        "message": "Login successful",
        "data": {
          "message": "Login successful",
          "user": {...}
        }
      }

5. Client:
   a. Receives HTTP 200 response
   b. Browser automatically stores cookies
   c. Cookies sent automatically on subsequent requests
```

### Token Refresh Flow
```
1. Client → POST /api/v1/authentication/refresh
   Headers: Content-Type: application/json
   Cookies: REFRESH_TOKEN=eyJhbGc...

2. API Gateway (Refresh Controller):
   a. Read REFRESH_TOKEN from cookie
   b. Create gRPC request: refresh.Request{refresh_token}
   c. Call gRPC Authentication.Refresh(request)

3. Authentication Service (Refresh Use Case):
   a. Validate refresh token signature (HS256)
   b. Check token type == "refresh"
   c. Check expiration
   d. Extract jti (token ID) from claims
   e. Check if blacklisted in Redis:
      - Key: token:blacklist:{jti}
      - If exists → return error (token revoked)
   f. Extract user claims (sub, email)
   g. Generate new access token (15 min)
   h. Return RefreshResponse{
        access_token: "eyJhbGc..."
      }

4. API Gateway (Refresh Controller):
   a. Receive gRPC response with new access token
   b. Set ACCESS_TOKEN cookie (15 min expiration)
   c. Return HTTP 200 JSON response:
      {
        "success": true,
        "message": "Token refreshed",
        "data": {
          "access_token": "eyJhbGc..."
        }
      }

5. Client:
   a. Receives HTTP 200 response
   b. Browser automatically updates ACCESS_TOKEN cookie
   c. New access token sent on subsequent requests
```

### Logout Flow
```
1. Client → POST /api/v1/authentication/logout
   Headers: Content-Type: application/json
   Cookies: REFRESH_TOKEN=eyJhbGc...

2. API Gateway (Logout Controller):
   a. Read REFRESH_TOKEN from cookie
   b. Create gRPC request: logout.Request{refresh_token}
   c. Call gRPC Authentication.Logout(request)

3. Authentication Service (Logout Use Case):
   a. Validate refresh token signature
   b. Extract jti (token ID) from claims
   c. Add to Redis blacklist:
      - Key: token:blacklist:{jti}
      - Value: "1"
      - TTL: 7 days (match refresh token expiration)
   d. Return LogoutResponse{success: true}

4. API Gateway (Logout Controller):
   a. Receive gRPC response
   b. Clear ACCESS_TOKEN cookie:
      - Name: ACCESS_TOKEN
      - Value: ""
      - MaxAge: -1 (immediate deletion)
   c. Clear REFRESH_TOKEN cookie:
      - Name: REFRESH_TOKEN
      - Value: ""
      - MaxAge: -1 (immediate deletion)
   d. Return HTTP 200 JSON response:
      {
        "success": true,
        "message": "Logged out successfully"
      }

5. Client:
   a. Receives HTTP 200 response
   b. Browser deletes both cookies
   c. User is now logged out
   d. Blacklisted refresh token cannot be used for refresh
```

### Protected Route Access Flow
```
1. Client → GET /api/v1/protected/resource
   Cookies: ACCESS_TOKEN=eyJhbGc...

2. API Gateway → JWT Middleware:
   a. Extract ACCESS_TOKEN from cookie
   b. If missing → abort 401 Unauthorized
   c. Create gRPC request: validate.Request{access_token}
   d. Call gRPC Authentication.Validate(request)

3. Authentication Service (Validate Use Case):
   a. Validate access token signature (HS256)
   b. Check token type == "access"
   c. Check expiration (15 min window)
   d. Extract user claims (sub, email)
   e. Return ValidateResponse{
        valid: true,
        user: {
          id: "user-uuid",
          email: "user@example.com"
        }
      }

4. API Gateway (JWT Middleware):
   a. Receive validation response
   b. Set user context: c.Set("user", response.User)
   c. Call c.Next() to continue to handler

5. Protected Handler:
   a. Extract user from context: user := c.MustGet("user")
   b. Process request with user context
   c. Return response

Error Cases:
- Missing ACCESS_TOKEN → 401 Unauthorized
- Invalid signature → 401 Unauthorized
- Expired token → 401 Unauthorized (client should refresh)
- Wrong token type → 401 Unauthorized
```

---

## Environment Variables (New)

### Authentication Service
```bash
# Existing
DB_HOST=authentication-db
DB_PORT=5432
DB_USER=user
DB_PASSWORD=password
DB_NAME=moufube_auth
DB_SSL_MODE=disable
GRPC_HOST=0.0.0.0
GRPC_PORT=1001
ENVIRONMENT=dev

# NEW - JWT Configuration
JWT_ACCESS_SECRET=your-256-bit-access-secret-change-in-production
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-change-in-production
JWT_ACCESS_EXPIRATION_MINUTES=15
JWT_REFRESH_EXPIRATION_DAYS=7

# NEW - Redis for Token Blacklist
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=admin
REDIS_TOKEN_DB=1
```

### API Gateway
```bash
# Existing
ENVIRONMENT=dev
HTTP_PORT=3000
READ_TIMEOUT=990
WRITE_TIMEOUT=999
IDLE_TIMEOUT=999
SIZE_IDENTITY_TOKEN=32
VISITOR_TOKEN_EXPIRE_DAYS=365
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=admin
IDENTITY_DB=1
GRPC_AUTHENTICATION_HOST=authentication-service
GRPC_AUTHENTICATION_PORT=6769

# NEW - Redis Token Blacklist DB (shared with auth service)
REDIS_TOKEN_DB=1
```

---

## Implementation Phases (from Architecture Plan)

### Phase 1: Authentication Service - JWT Core ⏱️
**Files to Create**:
- `services/authentication/internal/domain/service/jwt.go`
- `services/authentication/internal/domain/repository/token/reader.go`
- `services/authentication/internal/domain/repository/token/writer.go`
- `services/authentication/internal/infrastructure/repository/token/redis.go`

**Files to Modify**:
- `services/authentication/internal/config/type.go` - Add JWT config
- `services/authentication/internal/bootstrap/type.go` - Add JWT service/repositories

**Tasks**:
1. Add JWT config struct (secret, expiration times)
2. Create JWT service interface and implementation
   - `GenerateAccessToken(user) (token, error)`
   - `GenerateRefreshToken(user) (token, tokenID, error)`
   - `ValidateAccessToken(token) (claims, error)`
   - `ValidateRefreshToken(token) (claims, error)`
3. Create token repository interfaces
4. Implement Redis-based token blacklist repository

### Phase 2: Protobuf ✅ COMPLETE
- Proto definitions already updated
- Generated Go code exists
- No action needed

### Phase 3: Authentication Service - Use Cases ⏱️
**Files to Create**:
- `services/authentication/internal/application/dto/command/refresh_token.go`
- `services/authentication/internal/application/dto/command/logout.go`
- `services/authentication/internal/application/dto/command/validate_token.go`
- `services/authentication/internal/application/dto/result/refresh_token.go`
- `services/authentication/internal/application/dto/result/logout.go`
- `services/authentication/internal/application/dto/result/validate_token.go`
- `services/authentication/internal/application/usecase/user/refresh.go`
- `services/authentication/internal/application/usecase/user/logout.go`
- `services/authentication/internal/application/usecase/user/validate.go`

**Files to Modify**:
- `services/authentication/internal/application/usecase/user/login.go` - Add JWT generation
- `services/authentication/internal/application/dto/result/login_response.go` - Add token fields
- `services/authentication/internal/bootstrap/use_case.go` - Inject token repos

**Tasks**:
1. Update Login use case to generate tokens
2. Create RefreshToken use case
3. Create Logout use case
4. Create ValidateToken use case

### Phase 4: Authentication Service - Controllers ⏱️
**Files to Create**:
- `services/authentication/internal/interface/controller/user/refresh.go`
- `services/authentication/internal/interface/controller/user/logout.go`
- `services/authentication/internal/interface/controller/user/validate.go`

**Files to Modify**:
- `services/authentication/internal/interface/controller/user/login.go` - Return tokens
- `services/authentication/internal/bootstrap/controller.go` - Register new controllers

**Tasks**:
1. Update Login controller to return tokens
2. Create RefreshToken gRPC controller
3. Create Logout gRPC controller
4. Create ValidateToken gRPC controller

### Phase 5: API Gateway - Cookie Handling ⏱️
**Files to Create**:
- `services/api-gateway/internal/modules/authentication/refresh/controller.go`
- `services/api-gateway/internal/modules/authentication/refresh/service.go`
- `services/api-gateway/internal/modules/authentication/refresh/grpc_client.go`
- `services/api-gateway/internal/modules/authentication/refresh/request.go`
- `services/api-gateway/internal/modules/authentication/logout/controller.go`
- `services/api-gateway/internal/modules/authentication/logout/service.go`
- `services/api-gateway/internal/modules/authentication/logout/grpc_client.go`
- `services/api-gateway/internal/bootstrap/module/authentication/refresh.go`
- `services/api-gateway/internal/bootstrap/module/authentication/logout.go`

**Files to Modify**:
- `services/api-gateway/internal/modules/authentication/login/controller.go` - Set cookies
- `services/api-gateway/internal/bootstrap/middleware/constant/cookie.go` - Add token constants
- `services/api-gateway/internal/bootstrap/module/authentication/bootstrap.go` - Add refresh/logout modules
- `services/api-gateway/internal/bootstrap/router/v1/authentication.go` - Add routes

**Tasks**:
1. Update login controller to set HTTP-only cookies
2. Create refresh token HTTP endpoint
3. Create logout HTTP endpoint
4. Add cookie constants (ACCESS_TOKEN, REFRESH_TOKEN)

### Phase 6: API Gateway - JWT Middleware ⏱️
**Files to Create**:
- `services/api-gateway/internal/bootstrap/middleware/jwt.go`

**Tasks**:
1. Create JWT validation middleware
2. Extract access token from cookie
3. Call gRPC Validate endpoint
4. Set user context in gin.Context
5. Return 401 on invalid/missing token

### Phase 7: Configuration & Environment ⏱️
**Files to Modify**:
- `services/authentication/.env.example` - Add JWT variables
- `services/api-gateway/.env.example` - Add Redis token DB
- `deployment/docker-compose.yml` - Ensure Redis DB 1 is accessible

**Tasks**:
1. Add JWT secrets to environment variables
2. Add token expiration config
3. Configure Redis connection for blacklist
4. Update deployment configuration

### Phase 8: Testing & Documentation ⏱️
**Tasks**:
1. Unit tests for JWT service
   - Token generation
   - Token validation
   - Expiration handling
   - Claim extraction
2. Integration tests for endpoints
   - Login flow (token generation + cookie setting)
   - Refresh flow (token validation + new access token)
   - Logout flow (blacklist + cookie clearing)
   - Protected route access (middleware validation)
3. Swagger documentation
   - Update login endpoint docs
   - Add refresh endpoint docs
   - Add logout endpoint docs
   - Document cookie behavior

### Phase 9: Frontend Integration (Optional) ⏱️
**Files to Create** (if implementing frontend):
- `frontend/src/app/(auth)/login/page.tsx`
- `frontend/src/app/(auth)/register/page.tsx`
- `frontend/src/contexts/AuthContext.tsx`
- `frontend/src/lib/api.ts`
- `frontend/src/middleware.ts` (for protected routes)

**Tasks**:
1. Create login/logout UI
2. Create auth context provider
3. Handle authentication state
4. Add protected route wrapper
5. Implement automatic token refresh

---

## Security Considerations

### Token Security
- ✅ **HTTP-only cookies** prevent XSS token theft (JavaScript cannot access)
- ✅ **SameSite=Strict** prevents CSRF attacks
- ✅ **Short-lived access tokens** (15 min) reduce breach window
- ✅ **Refresh token blacklisting** on logout prevents token reuse
- ✅ **Different secrets** for access and refresh tokens
- ✅ **Unique token ID (jti)** for blacklist tracking
- ⚠️ **Consider**: Refresh token rotation for enhanced security (future enhancement)
- ⚠️ **Consider**: Token revocation on password change (future enhancement)
- ⚠️ **Consider**: Rate limiting on refresh endpoint

### Cookie Security
- ✅ **HttpOnly**: JavaScript cannot access tokens (prevents XSS)
- ✅ **Secure**: HTTPS only in production (prevents MITM)
- ✅ **SameSite=Strict**: Prevents cross-site request forgery (CSRF)
- ✅ **Path=/**: Available across entire application
- ⚠️ **Note**: Set `Secure: false` in development for HTTP localhost

### Infrastructure Security
- ✅ **Redis password protected**
- ✅ **Separate Redis DB** for tokens (DB 1) vs identity (DB ?)
- ✅ **Different secrets** for access and refresh tokens
- ⚠️ **Secrets should be rotated periodically**
- ⚠️ **Consider**: Using Vault for secret management in production
- ⚠️ **Consider**: Encrypting tokens at rest in Redis

### Signing Algorithm Security
- ✅ **HS256** (HMAC-SHA256): Fast validation for middleware
- ✅ **Symmetric key**: Simple key management
- ⚠️ **Alternative**: RS256 (RSA) for asymmetric signing (if needed)
- ⚠️ **Key length**: Use 256-bit secrets minimum

---

## Observations (No Recommendations)

1. **Architecture plan is comprehensive and production-ready** - The existing plan covers all aspects from security to implementation details

2. **Proto definitions are already updated** - Token fields and new RPC methods are defined, reducing implementation work

3. **Cookie pattern exists in identity middleware** - Can be directly referenced for JWT cookie implementation

4. **Frontend is minimal** - Only basic Next.js structure exists, auth UI needs to be built from scratch (optional)

5. **No JWT code exists yet** - Implementation will be greenfield, no refactoring needed

6. **Redis already configured** - Infrastructure exists, just needs new DB index for tokens

7. **Clean architecture separation** - Easy to add new components without affecting existing code

8. **gRPC communication established** - Pattern exists for service-to-service calls

9. **Environment-based configuration** - Easy to add new config variables

10. **Modular architecture in API Gateway** - New features can be added as independent modules

11. **Existing middleware patterns** - Identity middleware provides excellent reference for JWT middleware

12. **Repository pattern well-established** - Token repositories can follow same pattern as user repositories

13. **Use case pattern consistent** - New use cases can follow exact same structure as login/register

14. **Bootstrap pattern clear** - New components can be wired up following existing bootstrap code

15. **Error handling patterns exist** - Application errors and gRPC error handling already established

---

## Diagram Reference

**Architecture diagram available in**: `.opencode/plan/20260214_185528_implement-jwt-authentication-cookie.md`

**Shows**:
- Client → API Gateway → Authentication Service flow
- Redis integration for token blacklist
- Cookie handling at API Gateway layer
- gRPC communication between services
- Dual-token strategy (access + refresh)

---

## Notes

- This is a **greenfield JWT implementation** - no existing JWT code to refactor
- **Proto definitions are complete and generated** - no protobuf work needed
- **Architecture plan is detailed and comprehensive** (41KB file)
- **Existing patterns** (middleware, repositories, use cases) can be directly replicated
- **Frontend work is separate** and can proceed independently after backend is complete
- **Redis infrastructure exists**, just needs new DB index configuration
- **Security best practices are well-defined** in the architecture plan
- **Implementation can proceed phase-by-phase** as outlined in the plan
- **No breaking changes** to existing functionality - JWT is additive
- **Backward compatible** - existing login/register endpoints continue to work
- **Environment-aware** - cookie security attributes adjust based on environment

---

**Exploration Complete**
**Next Agent**: System Designer / Backend Engineer
**Estimated Complexity**: Large (L) - Multiple services, new components, Redis integration, middleware
**Estimated Effort**: 3-5 days for backend implementation, 1-2 days for frontend integration (optional)
