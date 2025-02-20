FROM oven/bun:1 as installer
WORKDIR /app
COPY package*.json ./
COPY bun.lock ./
RUN bun install

FROM oven/bun:1 as builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
RUN bun run build

FROM oven/bun:1 as production
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./.vinxi
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD [ "bun", "/app/.output/server/index.mjs" ]
