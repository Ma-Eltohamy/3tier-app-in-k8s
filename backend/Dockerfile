FROM node:16-slim AS backend-build

WORKDIR /app

COPY ./package.json . 

COPY .env.production . 

RUN npm install

COPY ./src ./src

RUN npm run build

FROM node:16-slim

WORKDIR /app

COPY --from=backend-build /app /app

ENV NODE_ENV=production

EXPOSE 4000

CMD ["npm", "start"]
