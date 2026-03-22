# Project Tree

```
project/
├── .github
│   └── workflows
│       └── ci.yml
├── .opencode
│   ├── agents
│   │   ├── architect.md
│   │   ├── backend-engineer.md
│   │   ├── code-reviewer.md
│   │   ├── frontend-engineer.md
│   │   ├── github.md
│   │   ├── plan-reviewer.md
│   │   ├── proto.md
│   │   ├── requirements-analyst.md
│   │   ├── swaggo.md
│   │   └── technical-writer.md
│   ├── plan
│   │   ├── .gitkeep
│   │   └── 20260214_185528_implement-jwt-authentication-cookie.md
│   ├── ticket
│   │   ├── created
│   │   │   └── 20260214_185528_implement-jwt-authentication-cookie.md
│   │   ├── finished
│   │   ├── on-going
│   │   └── testing
│   └── package.json
├── data
│   ├── database
│   │   └── authentication
│   │       └── query
│   │           └── table
│   │               └── users.sql
│   ├── pb
│   │   └── authentication
│   │       └── v1
│   │           ├── login
│   │           │   ├── request.pb.go
│   │           │   └── response.pb.go
│   │           ├── register
│   │           │   ├── request.pb.go
│   │           │   └── response.pb.go
│   │           ├── service_grpc.pb.go
│   │           └── service.pb.go
│   └── proto
│       ├── authentication
│       │   └── v1
│       │       ├── login
│       │       │   ├── request.proto
│       │       │   └── response.proto
│       │       ├── register
│       │       │   ├── request.proto
│       │       │   └── response.proto
│       │       ├── token
│       │       │   ├── logout_request.proto
│       │       │   ├── logout_response.proto
│       │       │   ├── refresh_request.proto
│       │       │   ├── refresh_response.proto
│       │       │   ├── validate_request.proto
│       │       │   └── validate_response.proto
│       │       └── service.proto
│       └── scripts
│           └── compile.sh
├── deployment
│   └── docker-compose.yml
├── frontend
│   ├── public
│   │   ├── file.svg
│   │   ├── globe.svg
│   │   ├── next.svg
│   │   ├── vercel.svg
│   │   └── window.svg
│   ├── src
│   │   └── app
│   │       ├── favicon.ico
│   │       ├── globals.css
│   │       ├── layout.tsx
│   │       ├── page.module.css
│   │       └── page.tsx
│   ├── .dockerignore
│   ├── .env
│   ├── .prettierignore
│   ├── .prettierrc.json
│   ├── Dockerfile
│   ├── eslint.config.mjs
│   ├── next-env.d.ts
│   ├── next.config.ts
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
├── scripts
│   ├── compile-proto.sh
│   ├── lint.sh
│   └── stop-all-service.sh
├── services
│   ├── api-gateway
│   │   ├── .devcontainer
│   │   │   └── devcontainer.json
│   │   ├── certs
│   │   │   ├── ca.crt
│   │   │   ├── ca.key
│   │   │   ├── ca.srl
│   │   │   ├── server.crt
│   │   │   ├── server.csr
│   │   │   └── server.key
│   │   ├── cmd
│   │   │   └── app
│   │   │       └── main.go
│   │   ├── deployment
│   │   │   └── docker
│   │   │       ├── .env
│   │   │       ├── docker-compose.yml
│   │   │       └── Dockerfile
│   │   ├── documentation
│   │   │   ├── api
│   │   │   │   ├── docs.go
│   │   │   │   ├── swagger.json
│   │   │   │   └── swagger.yaml
│   │   │   ├── api-requirement
│   │   │   │   ├── authentication
│   │   │   │   │   ├── login.md
│   │   │   │   │   ├── password-reset.md
│   │   │   │   │   ├── register.md
│   │   │   │   │   └── update.md
│   │   │   │   ├── health
│   │   │   │   │   └── check.md
│   │   │   │   └── UPDATE_SUMMARY.md
│   │   │   └── architecture.md
│   │   ├── internal
│   │   │   ├── appctx
│   │   │   │   ├── external
│   │   │   │   │   └── grpc_error_parser.go
│   │   │   │   ├── response
│   │   │   │   │   ├── abort.go
│   │   │   │   │   ├── error.go
│   │   │   │   │   ├── success.go
│   │   │   │   │   └── type.go
│   │   │   │   └── strings
│   │   │   │       ├── generate_base64_token.go
│   │   │   │       ├── to_int_64.go
│   │   │   │       └── to_int.go
│   │   │   ├── apperr
│   │   │   │   ├── config_err.go
│   │   │   │   ├── constant.go
│   │   │   │   ├── env_err.go
│   │   │   │   ├── grpc_err.go
│   │   │   │   └── infrastructure_err.go
│   │   │   ├── bootstrap
│   │   │   │   ├── grpc
│   │   │   │   │   └── stub
│   │   │   │   │       └── create.go
│   │   │   │   ├── middleware
│   │   │   │   │   ├── constant
│   │   │   │   │   │   ├── cookie.go
│   │   │   │   │   │   ├── error_message.go
│   │   │   │   │   │   └── key.go
│   │   │   │   │   ├── identity.go
│   │   │   │   │   ├── init.go
│   │   │   │   │   └── rate_limit.go
│   │   │   │   ├── module
│   │   │   │   │   ├── authentication
│   │   │   │   │   │   ├── bootstrap.go
│   │   │   │   │   │   ├── login.go
│   │   │   │   │   │   └── register.go
│   │   │   │   │   ├── health
│   │   │   │   │   │   ├── bootstrap.go
│   │   │   │   │   │   └── check.go
│   │   │   │   │   ├── identity
│   │   │   │   │   │   ├── bootstrap.go
│   │   │   │   │   │   ├── handle_rate_limit.go
│   │   │   │   │   │   └── handle_visitor.go
│   │   │   │   │   └── bootstrap.go
│   │   │   │   ├── router
│   │   │   │   │   ├── v1
│   │   │   │   │   │   ├── authentication.go
│   │   │   │   │   │   └── register.go
│   │   │   │   │   ├── health.go
│   │   │   │   │   └── register.go
│   │   │   │   ├── init.go
│   │   │   │   └── type.go
│   │   │   ├── config
│   │   │   │   ├── load.go
│   │   │   │   └── type.go
│   │   │   ├── generated
│   │   │   │   └── pb
│   │   │   │       └── authentication
│   │   │   │           └── v1
│   │   │   │               ├── login
│   │   │   │               │   ├── request.pb.go
│   │   │   │               │   └── response.pb.go
│   │   │   │               ├── register
│   │   │   │               │   ├── request.pb.go
│   │   │   │               │   └── response.pb.go
│   │   │   │               ├── service_grpc.pb.go
│   │   │   │               └── service.pb.go
│   │   │   ├── infrastructure
│   │   │   │   ├── cache
│   │   │   │   │   └── redis.go
│   │   │   │   ├── grpc
│   │   │   │   │   └── stub
│   │   │   │   │       └── authentication.go
│   │   │   │   ├── http
│   │   │   │   │   ├── gin
│   │   │   │   │   │   └── init.go
│   │   │   │   │   └── server
│   │   │   │   │       ├── init.go
│   │   │   │   │       └── start.go
│   │   │   │   ├── logger
│   │   │   │   │   ├── app_logger.go
│   │   │   │   │   └── slog.go
│   │   │   │   └── repository
│   │   │   │       └── identity
│   │   │   │           ├── reader
│   │   │   │           │   ├── get_identity_by_id.go
│   │   │   │           │   ├── init.go
│   │   │   │           │   └── type.go
│   │   │   │           └── writer
│   │   │   │               ├── init.go
│   │   │   │               ├── set_identity.go
│   │   │   │               ├── set_visitor_id_rate_limit.go
│   │   │   │               └── type.go
│   │   │   └── modules
│   │   │       ├── authentication
│   │   │       │   ├── login
│   │   │       │   │   ├── controller.go
│   │   │       │   │   ├── grpc_client.go
│   │   │       │   │   ├── request.go
│   │   │       │   │   ├── response.go
│   │   │       │   │   └── service.go
│   │   │       │   └── register
│   │   │       │       ├── controller.go
│   │   │       │       ├── grpc_client.go
│   │   │       │       ├── request.go
│   │   │       │       ├── response.go
│   │   │       │       └── service.go
│   │   │       ├── health
│   │   │       │   └── check
│   │   │       │       └── controller.go
│   │   │       └── identity
│   │   │           ├── handle_rate_limit
│   │   │           │   ├── controller.go
│   │   │           │   ├── request.go
│   │   │           │   ├── response.go
│   │   │           │   └── service.go
│   │   │           ├── handle_visitor
│   │   │           │   ├── controller.go
│   │   │           │   ├── request.go
│   │   │           │   ├── response.go
│   │   │           │   └── service.go
│   │   │           ├── constant.go
│   │   │           ├── error.go
│   │   │           ├── mapper.go
│   │   │           ├── reader.go
│   │   │           ├── type.go
│   │   │           └── writer.go
│   │   ├── tmp
│   │   │   └── main
│   │   ├── .air.toml
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── .golangci.yml
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── authentication
│   │   ├── .devcontainer
│   │   │   └── devcontainer.json
│   │   ├── certs
│   │   │   ├── ca.crt
│   │   │   ├── ca.key
│   │   │   ├── ca.srl
│   │   │   ├── server.crt
│   │   │   ├── server.csr
│   │   │   └── server.key
│   │   ├── cmd
│   │   │   └── app
│   │   │       └── main.go
│   │   ├── deployment
│   │   │   └── docker
│   │   │       ├── .env
│   │   │       ├── docker-compose.yml
│   │   │       └── Dockerfile
│   │   ├── documentation
│   │   ├── internal
│   │   │   ├── appctx
│   │   │   │   └── strings
│   │   │   │       ├── generate_base64_token.go
│   │   │   │       ├── to_int_64.go
│   │   │   │       └── to_int.go
│   │   │   ├── application
│   │   │   │   ├── apperr
│   │   │   │   │   └── user.go
│   │   │   │   ├── dto
│   │   │   │   │   ├── command
│   │   │   │   │   │   ├── login_request.go
│   │   │   │   │   │   └── register_request.go
│   │   │   │   │   └── result
│   │   │   │   │       ├── login_response.go
│   │   │   │   │       └── register_response.go
│   │   │   │   ├── port
│   │   │   │   │   └── inbound
│   │   │   │   │       └── user.go
│   │   │   │   └── usecase
│   │   │   │       └── user
│   │   │   │           ├── mockup
│   │   │   │           │   ├── error_reader.go
│   │   │   │           │   └── reader.go
│   │   │   │           ├── init.go
│   │   │   │           ├── login_test.go
│   │   │   │           ├── login.go
│   │   │   │           ├── register.go
│   │   │   │           └── type.go
│   │   │   ├── bootstrap
│   │   │   │   ├── controller.go
│   │   │   │   ├── grpc_stub.go
│   │   │   │   ├── init.go
│   │   │   │   ├── reader.go
│   │   │   │   ├── type.go
│   │   │   │   ├── use_case.go
│   │   │   │   └── writer.go
│   │   │   ├── config
│   │   │   │   ├── load.go
│   │   │   │   ├── loader.go
│   │   │   │   └── type.go
│   │   │   ├── domain
│   │   │   │   ├── entity
│   │   │   │   │   └── user.go
│   │   │   │   ├── factory
│   │   │   │   │   └── user.go
│   │   │   │   ├── repository
│   │   │   │   │   ├── repoerr
│   │   │   │   │   │   ├── init.go
│   │   │   │   │   │   └── user.go
│   │   │   │   │   └── user
│   │   │   │   │       ├── reader.go
│   │   │   │   │       └── writer.go
│   │   │   │   └── valueobject
│   │   │   │       ├── voconstant
│   │   │   │       │   └── password.go
│   │   │   │       ├── voerr
│   │   │   │       │   ├── email.go
│   │   │   │       │   └── password.go
│   │   │   │       ├── email.go
│   │   │   │       ├── password_hash.go
│   │   │   │       └── password.go
│   │   │   ├── generated
│   │   │   │   └── pb
│   │   │   │       └── authentication
│   │   │   │           └── v1
│   │   │   │               ├── login
│   │   │   │               │   ├── request.pb.go
│   │   │   │               │   └── response.pb.go
│   │   │   │               ├── register
│   │   │   │               │   ├── request.pb.go
│   │   │   │               │   └── response.pb.go
│   │   │   │               ├── service_grpc.pb.go
│   │   │   │               └── service.pb.go
│   │   │   ├── infrastructure
│   │   │   │   ├── database
│   │   │   │   │   ├── connection.go
│   │   │   │   │   └── orm.go
│   │   │   │   ├── grpcserver
│   │   │   │   │   └── init.go
│   │   │   │   ├── logger
│   │   │   │   │   ├── app_logger.go
│   │   │   │   │   └── slog.go
│   │   │   │   └── repository
│   │   │   │       └── user
│   │   │   │           ├── reader
│   │   │   │           │   ├── get_by_email.go
│   │   │   │           │   ├── init.go
│   │   │   │           │   └── type.go
│   │   │   │           └── writer
│   │   │   │               ├── create.go
│   │   │   │               ├── init.go
│   │   │   │               └── type.go
│   │   │   └── interface
│   │   │       └── controller
│   │   │           └── user
│   │   │               ├── init.go
│   │   │               ├── login.go
│   │   │               ├── register.go
│   │   │               └── type.go
│   │   ├── tmp
│   │   │   └── main
│   │   ├── .air.toml
│   │   ├── .env
│   │   ├── .env.example
│   │   ├── .golangci.yml
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── reverse-proxy
│       ├── conf.d
│       │   └── proxy.conf
│       ├── .env
│       └── docker-compose.yml
├── tools
│   ├── lint.Dockerfile
│   └── proto-compiler.Dockerfile
├── .ignore
├── AGENTS.md
└── README.md
```
