FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install -g nx
RUN npm install

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist/apps ./dist
COPY --from=build /app/node_modules ./node_modules

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "dist/api/main"]
