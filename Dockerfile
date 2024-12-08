FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/apps ./dist
COPY --from=build /app/db ./dist/db
COPY --from=build /app/tsconfig.migration.json ./dist/db/tsconfig.migration.json
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

# npx ts-node -P dist/db/tsconfig.migration.json --require tsconfig-paths/register /app/node_modules/typeorm/cli.js migration:run -d dist/db/typeorm.config.ts &&
CMD node dist/api/main
