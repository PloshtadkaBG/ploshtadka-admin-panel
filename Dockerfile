# syntax=docker/dockerfile:1.4

# ---- deps stage ----
FROM oven/bun:1-alpine AS deps
WORKDIR /app

COPY package.json bun.lock* ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# ---- build stage ----
FROM oven/bun:1-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG VITE_BASENAME=/admin
ENV VITE_BASENAME=$VITE_BASENAME

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun run build

# ---- production stage ----
FROM oven/bun:1-alpine AS production
WORKDIR /app

COPY --from=builder /app/dist ./dist

COPY <<'SERVE' serve.ts
Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);
    const file = Bun.file(`dist${url.pathname}`);
    if (await file.exists()) return new Response(file);
    return new Response(Bun.file("dist/index.html"));
  },
});
SERVE

EXPOSE 3000

CMD ["bun", "serve.ts"]
