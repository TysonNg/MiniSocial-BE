 FROM node:20

 WORKDIR /app

 COPY package*.json ./

 RUN yarn install

 COPY . .

 ENV PORT=9000

 ENV NODE_OPTIONS="--max-old-space-size=4096"

 EXPOSE 9000

 CMD [ "yarn","start"]