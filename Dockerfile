FROM python:3.8-buster as base
# Install node
ENV NODE_VERSION=16.8.0
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN apt update \
  && apt install -y curl git libgbm-dev \
  && curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash \
  && apt clean
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION} \
  && . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION} \
  && . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}

# Install yarn
RUN npm i -g yarn

# Setup Python and Black for the formatters
RUN python -m ensurepip && pip install --upgrade pip && pip install --no-cache setuptools wheel black==21.7b0 guesslang==2.2.1

RUN mkdir /app
COPY package.json jest.config.js yarn.lock tsconfig.json app/

COPY src/ /app/src
COPY tests/ /app/tests
WORKDIR /app

RUN rm -rf node_modules && yarn install --frozen-lockfile

from base as test
CMD yarn jest

from base as build
RUN yarn build
CMD ["node", "./build/main/src/index.js"]
