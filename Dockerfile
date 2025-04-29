 FROM node:20

 WORKDIR /app

 COPY package*.json ./

 RUN yarn install

 COPY . .

 ENV PORT=9000

 EXPOSE 9000

 CMD [ "yarn","dev"]