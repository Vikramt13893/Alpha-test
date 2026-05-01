# Alpha

Monorepo for the **Alpha** web app: React (Vite) + Spring Boot + PostgreSQL, with the HTTP contract defined **OpenAPI-first** under `openapi/`.

## Layout

| Path | Role |
|------|------|
| `openapi/openapi.yaml` | Canonical REST contract (single source of truth) |
| `frontend/` | JavaScript + React + Vite; regenerate TS types from OpenAPI |
| `backend/` | Spring Boot API implementing the same paths and schemas |

## Prerequisites

- Java 17+
- Node 20+ (for the Vite dev server and `npm run generate:api`)
- PostgreSQL 15+ — quickest: Docker Compose at repo root

## Database

```bash
docker compose up -d
```

This starts PostgreSQL with database/user/password `alpha` (see `docker-compose.yml`), matching `backend/src/main/resources/application.yml`.

## OpenAPI workflow

1. Edit **`openapi/openapi.yaml`** when the API changes.
2. **Frontend** — regenerate typed helpers:

   ```bash
   cd frontend && npm install && npm run generate:api
   ```

3. **Backend** — implement controllers/services to match paths, status codes, and JSON shapes. Optionally compare with **Swagger UI** at `http://localhost:8080/swagger-ui/index.html` after starting Spring (OpenAPI JSON at `/api-docs`).

## Run backend

Create database `alpha` and set credentials in `backend/src/main/resources/application.yml` (or env overrides).

```bash
cd backend
./mvnw -DskipTests spring-boot:run
```

## Run frontend

```bash
cd frontend
npm install
npm run generate:api
npm run dev
```

Vite dev server defaults to `http://localhost:5173`. CORS is allowed for that origin from the backend.

## Environment notes

- Configure AWS S3 and presigned URL signing in Spring when you add real uploads and playback.
- Use Flyway migrations under `backend/src/main/resources/db/migration/` for schema changes.
