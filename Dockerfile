FROM node:22 AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN npx tsc -p /app/tsconfig.migration.json
RUN npm run build

FROM node:22

WORKDIR /app

COPY --from=build /app/dist/apps ./dist
COPY --from=build /app/db ./dist/db
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/scripts/migrate-and-start.sh ./scripts/migrate-and-start.sh

ENV NODE_ENV=production

ARG PORT=3000
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["/bin/sh", "/app/scripts/migrate-and-start.sh"]
