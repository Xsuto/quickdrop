FROM node:22-slim as installer
WORKDIR /app
COPY package*.json ./
RUN npm install

FROM node:22-slim as builder
WORKDIR /app
COPY --from=installer /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-slim as production
WORKDIR /app
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/.vinxi ./.vinxi
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production
EXPOSE 3000

CMD [ "node", "/app/.output/server/index.mjs" ]
