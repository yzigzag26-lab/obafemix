# obafemix-api (Fastify)

Backend for the OBAFEMIX portfolio. Scope & decisions: `docs/BACKEND_SCOPE.md`.
Endpoint guide: `docs/API.md`. Interactive docs: **Swagger UI at `/docs`** (generated from the zod route schemas — always accurate).

## Scaffold from scratch (what was run to create this folder)

```bash
mkdir -p apps/api/src/{routes,config} && cd apps/api
npm init -y
npm i  fastify @fastify/cors @fastify/cookie @fastify/rate-limit \
       @fastify/swagger @fastify/swagger-ui fastify-type-provider-zod zod dotenv
npm i -D typescript tsx @types/node
```

Structure:

```
src/
  server.ts        entry: loads .env, builds app, listens on 0.0.0.0:PORT
  app.ts           buildApp(): plugins (CORS/cookie/rate-limit/Swagger),
                   shared error envelope, /api/v1 route registration
  config/env.ts    zod-validated environment (fail-fast at boot)
  routes/
    health.ts      GET /api/v1/health  ← Render health check + keep-alive target
    (next) site.ts · projects.ts · skills.ts · contact.ts · auth.ts · admin-media.ts · ai.ts
```

## Run it

```bash
cp .env.example .env     # fill in values (DATABASE_URL etc. as features land)
npm run dev              # tsx watch on http://localhost:4000
# or production-style:
npm run build && npm start
```

- Swagger UI: http://localhost:4000/docs
- Health: http://localhost:4000/api/v1/health

## Deploy (Render)

`render.yaml` at the repo root already describes this service
(`rootDir: apps/api`, `healthCheckPath: /api/v1/health`, env vars with
`sync: false`). The keep-alive workflow pings the health endpoint every
10 minutes so the free service never sleeps (see BACKEND_SCOPE.md §8).
