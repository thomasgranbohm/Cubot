FROM node:14

WORKDIR /CuBot

COPY package.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

ENV NODE_ENV production

USER node

CMD ["node", "dist/index.js"]

