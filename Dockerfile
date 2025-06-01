FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install || (cat npm-debug.log && exit 1)

COPY . .

RUN npm run build || (cat npm-debug.log && exit 1)

EXPOSE 3000

CMD [ "sh" ]
