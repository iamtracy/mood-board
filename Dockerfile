FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install -g nx && npm install

COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/apps ./dist
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

ARG PORT=3000
ENV PORT=${PORT}

ARG DOMAIN='mood-board.me'
ENV DOMAIN=${DOMAIN}

ARG SUBDOMAIN='dev'
ENV SUBDOMAIN=${SUBDOMAIN}

EXPOSE ${PORT}

CMD ["node", "dist/api/main"]
