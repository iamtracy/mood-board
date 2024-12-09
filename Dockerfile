FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/apps ./dist
COPY --from=build /app/db ./db
COPY --from=build /app/tsconfig.migration.json ./tsconfig.migration.json 
COPY --from=build /app/apps/api/src/app/entities ./entities
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/scripts/migrate-and-start.sh ./scripts/migrate-and-start.sh

ENV NODE_ENV=production

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["/bin/sh", "/app/scripts/migrate-and-start.sh"]
