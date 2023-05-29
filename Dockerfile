FROM node:lts-alpine

WORKDIR /app

RUN cd /app

COPY package.json package-lock.json ./

RUN npm ci

COPY  . .

RUN npm run build

CMD [ "npm", "run", "start:prod"]
