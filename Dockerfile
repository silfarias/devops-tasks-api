# ---- Build ----
FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# ---- Production ----
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn workspaces focus --production && yarn cache clean

COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]
