FROM node:16-alpine

# Add Git
RUN apk update
RUN apk add git

# Add build essential
RUN apk add build-base

# Setup Python and Black for the formatters
RUN apk add --update --no-cache python3 python3-dev && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools wheel
RUN pip3 install black
# For automatic language detection.
RUN pip3 install guesslang

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