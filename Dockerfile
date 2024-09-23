FROM node:20-alpine

WORKDIR usr/src/app

COPY package*.json ./

RUN npm run install

COPY . .

RUN npm install

ENV NODE_ENV=production

CMD ["npm", "start"]