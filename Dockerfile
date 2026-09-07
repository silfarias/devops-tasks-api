# ---- Dependencies ----
FROM node:24-alpine AS deps

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.18.0 --activate

COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

# ---- Build ----
FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.18.0 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY package.json yarn.lock .yarnrc.yml ./
COPY . .

RUN yarn build

# ---- Production ----
FROM node:24-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

USER node

CMD ["node", "dist/main.js"]