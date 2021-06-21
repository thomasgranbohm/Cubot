FROM node:14

WORKDIR /cubot

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENV NODE_ENV production

CMD ["node", "--max-old-space-size=16384",  "dist/index.js"]

