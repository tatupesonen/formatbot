FROM python:3.7.5-buster

# Install node
ENV NODE_VERSION=16.8.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Install yarn
RUN npm i -g yarn
# Add Git
RUN apt update
RUN apt install git


# Setup Python and Black for the formatters
# RUN apt install python3 python3-dev && ln -sf python3 /usr/bin/pytho
RUN python3 -m ensurepip
RUN pip3 install --upgrade pip
RUN pip3 install --no-cache --upgrade setuptools wheel
RUN pip3 install black
# For automatic language detection.
RUN pip3 install -I guesslang==2.2.1


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