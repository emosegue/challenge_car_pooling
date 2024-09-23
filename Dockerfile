FROM node:20

WORKDIR usr/src/app

COPY package*.json ./

RUN npm run install

COPY . .

EXPOSE 9091

CMD ["npm", "start"]