FROM node:16-alpine

# Add Git
RUN apk update
RUN apk add git

RUN mkdir /app
COPY package.json /app
COPY yarn.lock /app
COPY tsconfig.json /app
COPY src/ /app/src
WORKDIR /app

RUN rm -rf node_modules && yarn install --frozen-lockfile
RUN yarn build
RUN ls -a 
ENTRYPOINT ["node", "./build/main/src/index.js"]