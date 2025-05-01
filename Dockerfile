 FROM node:20

 WORKDIR /app

 COPY package*.json ./

 RUN yarn install

 COPY . .

 ENV PORT=10000

 ENV NODE_OPTIONS="--max-old-space-size=4096"

 EXPOSE 10000

 CMD ["yarn", "start"]