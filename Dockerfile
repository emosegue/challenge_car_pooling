FROM node:20-alpine

WORKDIR usr/src/app

COPY package*.json ./

COPY . .

RUN npm install

ENV NODE_ENV=production

CMD ["npm", "start"]